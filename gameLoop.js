/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import Player from './player.js';
import {
  createGrids, updateText, updateBoard,
  fadeBoard, activateGrid, deactivateGrid,
} from './userInterface.js';

import { showShips } from './shipRender.js';

/* TODO: Have screen stop on end game
make ship animations as boxes
allow users to place ships
create randomization for placing ships
create AI for the bot it fights

*/

const player1 = new Player(1, false);
const player2 = new Player(2, false);

player1.gameboard.placeShip(2, 8, 9, 'x');
player1.gameboard.placeShip(5, 1, 3, 'y');
player2.gameboard.placeShip(3, 1, 1, 'y');

const curr = player1;
const enemy = player2;

createGrids();
showShips(player1.gameboard, player2.gameboard);
updateEventListeners(player1, player2);
updateEventListeners(player2, player1);
updateText(player1);
fadeBoard(player1);
activateGrid(player2);
deactivateGrid(player1);

function updateEventListeners(player, enemyPlayer) {
  const gridToAttack = document.querySelector(`#grid${enemyPlayer.number}`);
  [...gridToAttack.children].forEach((square, index) => {
    square.addEventListener('click', () => {
      const y = Math.floor(index / 10);
      const x = index % 10;
      updateBoard(enemyPlayer, x, y);
      nextPlayer(enemyPlayer, player);
    });
  });
}

function nextPlayer(player, enemyPlayer) {
  gameIsOver();
  updateText(player);
  fadeBoard(player);
  deactivateGrid(player);

  fadeBoard(enemyPlayer);
  activateGrid(enemyPlayer);
}

function gameIsOver() {
  if (player1.gameboard.checkAllShipsSunk()) {
    console.log('player 2 wins!');
    return true;
  } if (player2.gameboard.checkAllShipsSunk()) {
    console.log('player 1 wins!');
    return true;
  }
  return false;
}
