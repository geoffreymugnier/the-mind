import Lobby from "./class/Lobby.js";
import { Server } from "socket.io";

class Lobbies {
  static list = {};

  static create(lobbyId) {
    const lobby = new Lobby(lobbyId);
    Lobbies.list[lobbyId] = lobby;

    return Lobbies.list[lobbyId];
  }

  static remove(lobbyId) {
    const lobby = Lobbies.get(lobbyId);
    lobby.purge();

    delete Lobbies.list[lobbyId];
  }

  static get(lobbyId) {
    if (!Lobbies.list[lobbyId]) {
      return Lobbies.create(lobbyId);
    }

    return Lobbies.list[lobbyId];
  }
}

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    if (socket.lobby?.id) {
      const lobby = Lobbies.get(socket.lobby.id);
      socket.leave(lobby.id);
      lobby.remove(socket.id);

      io.in(lobby.id).emit("player_disconnected", socket.username);
    }
  });

  socket.on("join", (lobbyId) => {
    socket.join(lobbyId);
    // io.in(lobbyId).emit("join", username);
  });

  socket.on("joined_game", ({ lobbyId, username }) => {
    const lobby = Lobbies.get(lobbyId);
    lobby.add(socket.id, username);

    socket.lobby = lobby;
    socket.username = username;
    io.in(lobbyId).emit("joined_game", lobby.getPlayers());
  });

  socket.on("purge", (lobbyId) => {
    io.in(lobbyId).emit("purged");
    io.in(lobbyId).socketsLeave();
    Lobbies.remove(lobbyId);
  });

  socket.on("start", () => {
    const game = socket.lobby.startGame();

    io.to(socket.lobby.id).emit("game_started", {
      level: game.getLevel(),
      lives: game.getLives(),
      stars: game.getStars(),
      players: socket.lobby.getPlayers().map((username) => ({
        username,
        nbOfCards: game.getLevel(),
      })),
    });

    for (let player of socket.lobby.players) {
      io.sockets.sockets.get(player.id).emit("give_cards", player.getDeck());
    }
  });

  socket.on("start_star_vote", () => {
    const game = socket.lobby.game;
    const player = game.getPlayer(socket.id);
    io.to(socket.lobby.id).emit("start_star_vote", player.username);
  });

  socket.on("star_vote", (vote) => {
    const game = socket.lobby.game;
    const round = game.currentRound;
    const player = game.getPlayer(socket.id);

    io.to(socket.lobby.id).emit("star_vote", {
      username: player.username,
      vote,
    });

    player.vote(vote);

    if (vote === false) {
      return io.to(socket.lobby.id).emit("star_vote_failed", player.username);
    }

    const currentLevel = game.getLevel();

    if (round.everyoneAgreesUsingStar() !== false) {
      io.to(socket.lobby.id).emit("star_vote_succeeded", {
        stars: game.getStars(),
        card: round.activeCard,
      });

      // there's no cards left, we can start the next round

      if (game.getLevel() !== currentLevel) {
        io.to(socket.lobby.id).emit("new_round", {
          level: game.getLevel(),
          lives: game.getLives(),
          stars: game.getStars(),
          players: socket.lobby.getPlayers().map((username) => ({
            username,
            nbOfCards: game.getLevel(),
          })),
        });
      }

      for (let _player of game.players) {
        io.sockets.sockets
          .get(_player.id)
          .emit("update_deck", _player.getDeck());

        io.to(socket.lobby.id).emit("update_decks_length", {
          players: game.players.map((player) => ({
            username: player.username,
            nbOfCards: player.getDeck().length,
          })),
        });
      }
    }
  });

  socket.on("play", () => {
    const game = socket.lobby.game;
    const round = game.currentRound;
    const player = game.getPlayer(socket.id);
    const card = player.getSmallestCard();

    let playersWithLesserCards = [];

    const nextRound = () => {
      game.nextRound();

      io.to(socket.lobby.id).emit("new_round", {
        level: game.getLevel(),
        lives: game.getLives(),
        stars: game.getStars(),
        players: socket.lobby.getPlayers().map((username) => ({
          username,
          nbOfCards: game.getLevel(),
        })),
      });

      for (let player of socket.lobby.players) {
        io.sockets.sockets.get(player.id).emit("give_cards", player.getDeck());
      }
    };

    try {
      playersWithLesserCards = round.play(card);
    } catch {
      io.to(socket.lobby.id).emit("game_over");
      io.in(socket.lobby.id).socketsLeave();

      Lobbies.remove(socket.lobby.id);
    }

    socket.emit("update_deck", player.getDeck());

    io.to(socket.lobby.id).emit("played", {
      card,
      players: game.getPlayersDeckLength(),
    });

    io.to(socket.lobby.id).emit("log", {
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

        io.to(socket.lobby.id).emit("log", {
          message,
          type: "error",
        });
      }

      io.to(socket.lobby.id).emit("loose_life", game.lives);

      for (let player of playersWithLesserCards) {
        io.sockets.sockets.get(player.id).emit("update_deck", player.getDeck());
      }
    }

    if (round.isOver()) {
      return nextRound();
    }
  });
});

io.listen(process.env.PORT || 5000);
