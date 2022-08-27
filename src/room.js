import { writable } from "svelte/store";
import { socket } from "./socket";

const room = () => {
  const state = {
    players: [],
    level: 1,
    lives: 1,
    stars: 1,
    voting: false,
    voteStartedBy: null,
    lastCard: 0,
  };

  const { subscribe, set, update } = writable(state);

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

  socket.on("new_round", ({ level, players, lives }) => {
    update((state) => {
      state.level = level;
      state.lives = lives;
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

  return {
    set,
    stopVote,
    subscribe,
  };
};

export default room();
