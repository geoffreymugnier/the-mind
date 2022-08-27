export default class Round {
  game;
  activeCard = 0;

  constructor(game) {
    this.game = game;
    this.distributeCards();
  }

  isOver() {
    return this.getPlayersCards().length === 0;
  }

  play(card) {
    let playersWithLesserCards = [];

    for (let player of this.game.players) {
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

    this.activeCard = card;

    return playersWithLesserCards;
  }

  resetAllDecks() {
    for (let player of this.game.players) {
      player.resetDeck();
    }
  }
  distributeCards() {
    for (let player of this.game.players) {
      for (let i = 1; i <= this.game.level; i++) {
        const card = this.generateCard();
        player.addToDeck(card);
      }
    }
  }

  getPlayersCards() {
    return this.game.players.map((player) => player.getDeck()).flat();
  }

  everyoneAgreesUsingStar() {
    const everyoneAgreesUsingStar = this.game.players.every(
      (player) => player.hasVoted
    );

    if (everyoneAgreesUsingStar) {
      this.useStar();
      return true;
    }

    return false;
  }

  useStar() {
    const smallestCards = this.game.players.map((player) => {
      const card = player.getSmallestCard();
      player.removeCard(card);

      return card;
    });

    const biggestCard = Math.max(...smallestCards);

    this.activeCard = biggestCard;
    this.game.stars--;
    this.resetVotes();

    if (this.game.players.every((player) => player.getDeck().length === 0)) {
      return this.game.nextRound();
    }
  }

  resetVotes() {
    this.game.players.map((player) => (player.hasVoted = false));
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
