/* eslint-disable import/extensions */
import Gameboard from './gameboard.js';

export default class Player {
  constructor(number, bot) {
    this.gameboard = new Gameboard();
    this.number = number;
    this.bot = bot;
  }
}
