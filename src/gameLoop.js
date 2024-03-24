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
  removeButtons,
  changeDifficulty,
  setDifficulty,
} from './userInterface.js';

import {
  showShips,
  updateShipPositions,
  deactivateShips,
} from './shipRender.js';

import { selectIndexEasy, selectIndexHard } from './algorithm.js';

import restartGame from './restart.js';

let difficulty;

function gameIsOver(player1, player2) {
  if (player1.gameboard.checkAllShipsSunk() || player2.gameboard.checkAllShipsSunk()) {
    return true;
  }
  return false;
}

function nextPlayer(player, enemyPlayer) {
  if (gameIsOver(player, enemyPlayer)) {
    winningText(enemyPlayer);
    deactivateGrid(player);
    deactivateGrid(enemyPlayer);
    restartGame(enemyPlayer);
    // play again button !!
  } else if (player.number === 1) { // human player turn
    activateGrid(enemyPlayer);
  } else { // computer turn
    deactivateGrid(player);
    if (difficulty === 'easy') {
      updateBoard(enemyPlayer, selectIndexEasy(enemyPlayer.gameboard));
    } else if (difficulty === 'hard') {
      updateBoard(enemyPlayer, selectIndexHard(enemyPlayer.gameboard));
    }

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

function startGame(player1, player2) {
  // fix this to show what the player and the computer do
  difficulty = setDifficulty();
  updateText(player1, false, true);
  removeButtons();
  deactivateShips();
  updateEventListeners(player1, player2);
  fadeBoard(player2);
  activateGrid(player2);
}

function setGame() {
  const player1 = new Player(1);
  const player2 = new Player(2);

  // create the ships for the two boards
  player1.gameboard.placeNewShip(5, 1, 3, 'y', 1);
  player1.gameboard.placeNewShip(4, 4, 6, 'y', 2);
  player1.gameboard.placeNewShip(3, 7, 8, 'x', 3);
  player1.gameboard.placeNewShip(3, 7, 2, 'x', 4);
  player1.gameboard.placeNewShip(2, 4, 4, 'x', 5);

  player2.gameboard.placeNewShip(5, 1, 3, 'y', 1);
  player2.gameboard.placeNewShip(4, 4, 6, 'y', 2);
  player2.gameboard.placeNewShip(3, 1, 1, 'x', 3);
  player2.gameboard.placeNewShip(3, 7, 2, 'y', 4);
  player2.gameboard.placeNewShip(2, 4, 4, 'x', 5);

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
    updateShipPositions(player1);
  });

  player2.gameboard.randomizeShipPlacement();
  updateShipPositions(player2);

  changeDifficulty();

  // --- start the actualy game
  const playButton = document.querySelector('#play');
  playButton.addEventListener('click', () => startGame(player1, player2));
}

setGame();
