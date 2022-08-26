export default class Player {
  deck = [];
  lastRemovedCards = [];

  constructor(id, username) {
    this.username = username;
    this.id = id;
  }

  play() {
    const minValue = Math.min(...this.deck);
    return minValue;
  }

  getSmallerCards(card) {
    return this.deck.filter((v) => v < card);
  }

  hasCard(card) {
    return this.deck.includes(card);
  }

  getDeck() {
    return this.deck;
  }

  getSmallestCard() {
    return Math.min(...this.deck);
  }

  resetDeck() {
    this.deck = [];
  }

  removeCards(cards) {
    for (let card of cards) {
      this.removeCard(card);
    }

    this.lastRemovedCards = cards;
  }

  removeCard(card) {
    this.deck = this.deck.filter((v) => v !== card);
  }

  addToDeck(card) {
    this.deck.push(card);
    this.deck = this.deck.sort((a, b) => a - b);
  }
  setDeck(deck) {
    this.deck = deck;
  }
}
