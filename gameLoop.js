/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable-next-line import/extensions */
import readline from 'readline-sync';
import Player from './player.js';

const player1 = new Player();
const player2 = new Player();

player1.gameboard.placeShip(2, 0, 0, 'x');
player2.gameboard.placeShip(3, 1, 1, 'y');

function gameLoop() {
  // ships already placed, they can shoot where they want

  // player 1 goes
  const player1x = Number(readline.question('Player 1 x coord: '));
  const player1y = Number(readline.question('Player 1 y coord: '));
  player2.gameboard.receiveAttack(player1x, player1y);
  player2.gameboard.printBoard();

  const player2x = Number(readline.question('Player 2 x coord: '));
  const player2y = Number(readline.question('Player 2 y coord: '));
  player1.gameboard.receiveAttack(player2x, player2y);
  player1.gameboard.printBoard();

  if (player1.gameboard.checkAllShipsSunk()) {
    console.log('player 2 wins!');
  } else if (player2.gameboard.checkAllShipsSunk()) {
    console.log('player 1 wins!');
  } else {
    gameLoop();
  }
}

gameLoop();
