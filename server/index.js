import Lobby from "./class/Lobby.js";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
  },
});

const lobby = new Lobby();

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    lobby.add(socket.id, username);
    io.sockets.emit("join", username);
  });

  socket.on("joined", () => {
    socket.emit("joined", lobby.getPlayers());
  });

  socket.on("purge", () => {
    io.socketsLeave();
    lobby.purge();
    socket.emit("joined", lobby.getPlayers());
  });

  socket.on("start", () => {
    const game = lobby.startGame();

    io.sockets.emit("game_started", {
      level: game.getLevel(),
      lives: game.getLives(),
      stars: game.getStars(),
    });

    for (let player of lobby.players) {
      io.sockets.sockets.get(player.id).emit("give_cards", player.getDeck());
    }
  });

  socket.on("play", () => {
    const game = lobby.game;
    const round = game.currentRound;
    const player = game.getPlayer(socket.id);
    const card = player.getSmallestCard();

    let playersWithLesserCards = [];

    const nextRound = () => {
      game.nextRound();

      io.sockets.emit("new_round", {
        level: game.getLevel(),
        lives: game.getLives(),
        stars: game.getStars(),
      });

      for (let player of lobby.players) {
        io.sockets.sockets.get(player.id).emit("give_cards", player.getDeck());
      }
    };

    try {
      playersWithLesserCards = round.play(card);
    } catch {
      io.sockets.emit("game_over");
      io.socketsLeave();
      lobby.purge();
    }

    socket.emit("update_deck", player.getDeck());

    io.sockets.emit("played", {
      card,
    });

    io.sockets.emit("log", {
      message: `${player.username} pose la carte ${card}`,
      type: "play",
    });

    if (playersWithLesserCards.length) {
      for (let _player of playersWithLesserCards) {
        let message = `${_player.username} avait la carte ${_player.lastRemovedCards[0]}`;

        if (_player.lastRemovedCards.length > 1) {
          message = `${
            _player.username
          } avait les cartes ${_player.lastRemovedCards.join(",")}`;
        }

        io.sockets.emit("log", {
          message,
          type: "error",
        });
      }

      io.sockets.emit("loose_life", game.lives);

      for (let player of playersWithLesserCards) {
        io.sockets.sockets.get(player.id).emit("update_deck", player.getDeck());
      }
    }

    if (round.isOver()) {
      return nextRound();
    }
  });
});

io.listen(3000);
