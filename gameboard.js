/* eslint-disable import/extensions */
import Ship from './ship.js';

export default class Gameboard {
  constructor() {
    this.board = [];

    for (let i = 0; i < 100; i += 1) {
      this.board.push({ ship: null, isHit: false });
    }

    this.shipLocations = [];
    this.ships = [];
  }

  placeShip(size, x, y, axis) {
    // make sure the x, y coords are legal for the ship
    const index = x + y * 10;
    const shipLocation = [];
    const newShip = new Ship(size);

    for (let i = 0; i < newShip.len; i += 1) {
      if (axis === 'x') {
        this.board[index + i].ship = newShip;
        newShip.location.push(index + i);
        shipLocation.push(index + i);
      } else if (axis === 'y') {
        this.board[index + i * 10].ship = newShip;
        newShip.location.push(index + i * 10);
        shipLocation.push(index + i * 10);
      }
    }
    this.shipLocations.push(shipLocation);
    this.ships.push(newShip);
  }

  receiveAttack(x, y) {
    const index = x + y * 10;

    // check if it was already hit
    if (this.board[index].isHit) {
      // do nothing
      console.log('This square is already hit');
    }

    if (this.board[index].ship !== null) {
      this.board[index].ship.hit(index);
    }
    this.board[index].isHit = true;
  }

  checkAllShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  printBoard() {
    let str = '';
    this.board.forEach((val, index) => {
      if (val.ship === null && !val.isHit) str += '. ';
      else if (val.ship === null && val.isHit) str += 'x ';
      else if (!val.isHit) str += 's ';
      else str += '* ';
      if ((1 + index) % 10 === 0) {
        console.log(str);
        str = '';
      }
    });
  }
}
