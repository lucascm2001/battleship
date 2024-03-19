/* eslint-disable import/extensions */
import Ship from './ship.js';

export default class Gameboard {
  constructor() {
    this.board = [];

    // Each board element containes an object containing a ship object and isHit boolean
    for (let i = 0; i < 100; i += 1) {
      this.board.push({ ship: null, isHit: false });
    }

    // probably redundant
    this.shipLocations = [];
    this.ships = [];
  }

  placeShip(size, x, y, axis) {
    // TODO make sure the x, y coords are legal for the ship
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
      // do nothing, fix in DOM
      // maybe an update board method instead of calling something here
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

  updatePosition(ship, index, switchAxis = false) {
    // update on this.board, on the ship object itself, and on shipLocations
    console.log(`\nship Location: ${ship.location}\n`);

    const horizontal = ship.location[1] - ship.location[0] === 1;
    this.shipLocations = this.shipLocations.filter((arr) => ship.location[0] !== arr[0]);

    if ((horizontal && !switchAxis) || (!horizontal && switchAxis)) { // horizontal
      for (let i = 0; i < ship.len; i += 1) {
        this.board[ship.location[i]].ship = null;
        ship.location[i] = index + i;
        this.board[ship.location[i]].ship = ship;
      }
    } else { // vertical
      for (let i = 0; i < ship.len; i += 1) {
        this.board[ship.location[i]].ship = null;
        ship.location[i] = index + 10 * i;
        this.board[ship.location[i]].ship = ship;
        // console.log(ship.location[i]);
      }
    }

    // update shipLocations array
    this.shipLocations.push(ship.location);
  }
}
