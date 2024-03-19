/* eslint-disable import/extensions */
import Gameboard from './gameboard.js';
import Ship from './ship.js';

// test if the placeShip() functions works properly
describe('placeShip', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('should place ship horizontally', () => {
    const size = 3;
    const x = 2;
    const y = 3;
    const axis = 'x';

    gameboard.placeShip(size, x, y, axis);
    const expectShip = new Ship(size, x, y, axis);
    expectShip.location = [32, 33, 34];

    // Check if the ship is placed correctly
    expect(gameboard.board[2 + 3 * 10].ship).toStrictEqual(expectShip);
    expect(gameboard.board[3 + 3 * 10].ship).toStrictEqual(expectShip);
    expect(gameboard.board[4 + 3 * 10].ship).toStrictEqual(expectShip);

    // Check if the ship's location is updated correctly
    expect(expectShip.location).toEqual([2 + 3 * 10, 3 + 3 * 10, 4 + 3 * 10]);
  });

  test('should place ship vertically', () => {
    const size = 2;
    const x = 5;
    const y = 7;
    const axis = 'y';

    gameboard.placeShip(size, x, y, axis);
    const expectShip = new Ship(size, x, y, axis);
    expectShip.location = [75, 85];

    // Check if the ship is placed correctly
    expect(gameboard.board[5 + 7 * 10].ship).toStrictEqual(expectShip);
    expect(gameboard.board[5 + 8 * 10].ship).toStrictEqual(expectShip);

    // Check if the ship's location is updated correctly
    expect(expectShip.location).toEqual([5 + 7 * 10, 5 + 8 * 10]);
  });
});

describe('receiveAttack', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('receive attack on 4, 7', () => {
    const x = 4;
    const y = 7;

    gameboard.receiveAttack(x, y);

    expect(gameboard.board[x + y * 10].isHit).toBeTruthy();
  });
});

describe('checkAllShipsSunk', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('check if ship is sunk when it should be', () => {
    const size = 4;
    const x = 1;
    const y = 1;
    const axis = 'x';

    gameboard.placeShip(size, x, y, axis);
    gameboard.receiveAttack(x, y);
    gameboard.receiveAttack(x + 1, y);
    gameboard.receiveAttack(x + 2, y);
    gameboard.receiveAttack(x + 3, y);

    expect(gameboard.checkAllShipsSunk()).toBeTruthy();
  });

  test('check if ship is sunk when it should not be', () => {
    const size = 4;
    const x = 1;
    const y = 1;
    const axis = 'x';

    gameboard.placeShip(size, x, y, axis);
    gameboard.receiveAttack(x, y);

    expect(gameboard.checkAllShipsSunk()).toBeFalsy();
  });
});
