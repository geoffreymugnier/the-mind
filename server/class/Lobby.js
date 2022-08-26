import Player from "./Player.js";
import Game from "./Game.js";

export default class Lobby {
  id = null;
  players = [];
  game = null;

  constructor(id) {
    this.id = id;
  }

  add(id, username) {
    const player = new Player(id, username);

    if (this.players.find((p) => p.username == username)) {
      throw "This player already exists";
    }

    this.players.push(player);
  }

  remove(username) {
    this.players = this.players.filter((p) => p.username == username);
  }

  purge() {
    this.players = [];
  }

  getPlayers() {
    return this.players.map((p) => p.username);
  }

  startGame() {
    this.game = new Game(this.players);
    return this.game;
  }
}
