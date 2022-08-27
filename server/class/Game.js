import Round from "./Round.js";

export default class Game {
  players = [];
  level = 1;
  currentRound = null;
  isWon = false;

  constructor(players) {
    this.lives = players.length;
    this.stars = 1;
    this.players = players;
    this.lastLevel = this.computeLastLevel();

    this.currentRound = new Round(this);
  }

  startNewRound() {
    this.currentRound = round;
  }

  getPlayersDeckLength() {
    return this.players.map((player) => ({
      username: player.username,
      nbOfCards: player.getDeck().length,
    }));
  }

  nextRound() {
    this.level++;

    if ([2, 5, 8].includes(this.level)) {
      this.stars++;
    }

    if ([3, 6, 9].includes(this.level)) {
      this.lives++;
    }

    if (this.level > this.lastLevel) {
      this.win();
    }

    this.currentRound = new Round(this);
  }

  win() {
    return (this.isWon = true);
  }

  removeLife() {
    let stillAlive = true;

    this.lives--;

    if (this.lives === 0) {
      stillAlive = false;
    }

    return stillAlive;
  }

  computeLastLevel() {
    let lastLevel = 12;

    for (let i = 2; i < this.players.length; i++) {
      lastLevel -= 2;
    }

    return lastLevel;
  }

  getPlayer(id) {
    return this.players.find((p) => p.id == id);
  }

  getLevel() {
    return this.level;
  }

  getLives() {
    return this.lives;
  }

  getStars() {
    return this.stars;
  }

  setLevel(level) {
    this.level = level;
  }
}
