import { writable } from "svelte/store";
import { socket } from "./socket";

const room = () => {
  const state = {
    players: [],
    level: 1,
    lives: 1,
    stars: 1,
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

  socket.on("new_round", ({ level, players, lives }) => {
    update((state) => {
      state.level = level;
      state.lives = lives;
      state.lastCard = 0;
      state.players = players;

      return state;
    });
  });

  socket.on("loose_life", (lives) => {
    update((state) => {
      state.lives = lives;

      return state;
    });
  });

  return {
    set,
    subscribe,
  };
};

export default room();
