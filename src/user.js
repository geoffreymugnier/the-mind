import { writable } from "svelte/store";
import { socket } from "./socket";

const user = () => {
  const state = {
    name: null,
    deck: [],
  };

  const { subscribe, update } = writable(state);

  socket.on("give_cards", (cards) => {
    console.log("receiving cards", cards);
    setDeck(cards);
  });

  socket.on("update_deck", (cards) => {
    console.log("updating deck with", cards);
    setDeck(cards);
  });

  function setDeck(deck) {
    update((state) => {
      state.deck = deck;
      return state;
    });
  }

  function setName(name) {
    return update((state) => {
      state.name = name;
      return state;
    });
  }

  return {
    subscribe,
    setName,
  };
};

export default user();
