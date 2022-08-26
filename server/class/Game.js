import Round from "./Round.js";

export default class Game {
  players = [];
  level = 1;
  currentRound = null;

  constructor(players) {
    this.lives = players.length;
    this.stars = players.length;
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

    if (this.level === this.lastLevel) {
      return this.win();
    }

    this.currentRound = new Round(this);
  }

  removeLife() {
    let stillAlive = true;

    this.lives--;

    if (this.lives === 0) {
      stillAlive = false;
    }

    return stillAlive;
  }

  win() {}

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
