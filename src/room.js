import { writable } from "svelte/store";
import { socket } from "./socket";
import logs from "./logs";

const room = () => {
  const state = {
    players: [],
    level: 1,
    lives: 1,
    stars: 1,
    voting: false,
    voteStartedBy: null,
    lastCard: 0,
    logs: [],
  };

  const { subscribe, set, update } = writable(state);

  socket.on("player_disconnected", (username) => {
    update((state) => {
      state.players = state.players.filter((p) => p.username !== username);
      return state;
    });
  });

  socket.on("played", ({ players, card }) => {
    update((state) => {
      state.players = players;
      state.lastCard = card;
      return state;
    });
  });

  socket.on("update_decks_length", ({ players }) => {
    update((state) => {
      state.players = players;
      return state;
    });
  });

  socket.on("new_round", ({ level, players, stars, lives }) => {
    update((state) => {
      state.level = level;
      state.lives = lives;
      state.stars = stars;
      state.lastCard = 0;
      state.players = players;

      return state;
    });
  });

  socket.on("start_star_vote", (username) => {
    update((state) => {
      state.voting = true;
      state.voteStartedBy = username;
      return state;
    });
  });

  socket.on("star_vote", ({ username, vote }) => {
    update((state) => {
      const player = state.players.find(
        (player) => player.username === username
      );
      player.hasVoted = vote;

      return state;
    });
  });

  socket.on("vote_end", () => {
    update((state) => {
      state.players.map((player) => {
        player.hasVoted = false;
      });

      return state;
    });
  });

  socket.on("loose_life", (lives) => {
    update((state) => {
      state.lives = lives;

      return state;
    });
  });

  function stopVote() {
    update((state) => {
      state.voting = false;
      state.voteStartedBy = null;
      return state;
    });
  }

  function pushToLogs(message) {
    update((state) => {
      state.logs = [message, ...state.logs];
      return state;
    });

    if (message.message) {
      logs.pushLog(message);
    }
  }

  function reset() {
    update((state) => {
      state.level = 1;
      state.lives = 1;
      state.stars = 1;
      state.lastCard = 0;
      state.logs = [];
      return state;
    });
  }

  return {
    set,
    stopVote,
    subscribe,
    reset,
    pushToLogs,
  };
};

export default room();
