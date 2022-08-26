export default class Round {
  game;
  players = [];
  level = 1;

  constructor(game) {
    this.game = game;

    this.players = game.players;
    this.level = game.level;

    // this.resetAllDecks();
    this.distributeCards();
  }

  isOver() {
    return this.getPlayersCards().length === 0;
  }

  play(card) {
    let playersWithLesserCards = [];

    for (let player of this.players) {
      const playerSmallerCards = player.getSmallerCards(card);
      player.removeCards(playerSmallerCards);

      if (player.hasCard(card)) {
        player.removeCard(card);
      }

      if (playerSmallerCards.length > 0) {
        playersWithLesserCards.push(player);
        const stillAlive = this.game.removeLife();

        if (!stillAlive) throw new Error("Game over");
      }
    }

    return playersWithLesserCards;
  }

  resetAllDecks() {
    for (let player of this.players) {
      player.resetDeck();
    }
  }
  distributeCards() {
    for (let player of this.players) {
      for (let i = 1; i <= this.level; i++) {
        const card = this.generateCard();
        player.addToDeck(card);
      }
    }
  }

  getPlayersCards() {
    return this.players.map((player) => player.getDeck()).flat();
  }

  generateCard() {
    const cardsInRound = this.getPlayersCards();
    const card = Math.floor(Math.random() * 100) + 1;

    if (cardsInRound.includes(card)) {
      return this.generateCard();
    }

    return card;
  }
}
