/* eslint-disable import/no-relative-packages */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */

import Player from './player.js';
import {
  createGrids,
  updateText,
  winningText,
  updateBoard,
  fadeBoard,
  activateGrid,
  deactivateGrid,
} from './userInterface.js';

import {
  showShips,
  updateShipPositions,
  deactivateShips,
} from './shipRender.js';

import selectIndex from './algorithm.js';

/* TODO: Have screen stop on end game, play again button
create AI for the bot it fights
*/

const player1 = new Player(1, false);
const player2 = new Player(2, false);

player1.gameboard.placeNewShip(2, 8, 9, 'x', 1);
player1.gameboard.placeNewShip(5, 1, 3, 'y', 2);
player1.gameboard.placeNewShip(3, 1, 1, 'x', 3);

player2.gameboard.placeNewShip(2, 7, 7, 'x', 1);

createGrids();
showShips(player1.gameboard, player2.gameboard);

// --- here is when we should have time to place ships
const gameText = document.querySelector('#sentence');
gameText.textContent = 'Place the ships.';
fadeBoard(player2);

// --- here is functionality for randomly placing ships
const randomizeShipButton = document.querySelector('#randomize');
randomizeShipButton.addEventListener('click', () => {
  player1.gameboard.randomizeShipPlacement();
  updateShipPositions(player1.gameboard);
});

// --- start the actualy game
const placeShipsButton = document.querySelector('#place-ships');
placeShipsButton.addEventListener('click', startGame);

function gameIsOver() {
  if (player1.gameboard.checkAllShipsSunk()) {
    return true;
  } if (player2.gameboard.checkAllShipsSunk()) {
    console.log('player 1 wins!');
    return true;
  }
  return false;
}

function nextPlayer(player, enemyPlayer) {
  if (gameIsOver()) {
    winningText(enemyPlayer);
    deactivateGrid(player);
    deactivateGrid(enemyPlayer);
    // play again button !!
  } else if (player.number === 1) { // human player turn
    updateText(player);
    activateGrid(enemyPlayer);
  } else { // computer turn
    updateText(player);
    deactivateGrid(player);
    updateBoard(enemyPlayer, selectIndex(enemyPlayer.gameboard));
    nextPlayer(enemyPlayer, player);
  }
}

function updateEventListeners(player, enemyPlayer) {
  const gridToAttack = document.querySelector(`#grid${enemyPlayer.number}`);
  [...gridToAttack.children].forEach((square, index) => {
    square.addEventListener('click', () => {
      updateBoard(enemyPlayer, index);
      nextPlayer(enemyPlayer, player);
    });
  });
}

function startGame() {
  // remove event listeners from the ships
  // use the fade board thingy for the event listeners on my board
  deactivateShips();
  updateEventListeners(player1, player2);
  updateText(player1);
  // fadeBoard(player1);
  fadeBoard(player2);
  activateGrid(player2);
  // deactivateGrid(player1);
}
