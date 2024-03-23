/* eslint-disable import/extensions */
// create grids
import { shipSunk } from './shipRender.js';

export function createGrids() {
  const container = document.querySelector('.board-container');

  const grid1 = document.createElement('div');
  grid1.classList.add('grid');
  grid1.setAttribute('id', 'grid1');

  for (let i = 0; i < 100; i += 1) {
    const square = document.createElement('div');
    square.classList.add('square');
    grid1.appendChild(square);
  }

  const grid2 = document.createElement('div');
  grid2.classList.add('grid');
  grid2.setAttribute('id', 'grid2');

  for (let i = 0; i < 100; i += 1) {
    const square = document.createElement('div');
    square.classList.add('square');
    grid2.appendChild(square);
  }
  container.appendChild(grid1);
  container.appendChild(grid2);
}

export function updateBoard(enemyPlayer, index) {
  const boardNumber = enemyPlayer.number;
  const square = document.querySelector(`#grid${boardNumber} .square:nth-child(${index + 1})`);

  // will only receive valid places to hit
  // need to only update that grid
  if (enemyPlayer.gameboard.board[index].ship === null) {
    square.classList.add('miss');
    enemyPlayer.gameboard.receiveAttack(index);
  } else {
    const hitBox = document.createElement('div');
    hitBox.classList.add('hitBox');
    hitBox.style.pointerEvents = 'none';
    square.classList.add('hit');
    square.appendChild(hitBox);

    enemyPlayer.gameboard.receiveAttack(index);
    if (enemyPlayer.gameboard.board[index].ship.isSunk()) {
      shipSunk(enemyPlayer, enemyPlayer.gameboard.board[index].ship);
    }
    // turn that square off
    square.style.pointerEvents = 'none';
  }
}

// fade board not being hit and toggle the hover effect
export function fadeBoard(player) {
  const gridToFade = document.querySelector(`#grid${player.number}`);
  gridToFade.classList.toggle('fade');

  const playerToFade = document.querySelector(`.players:nth-child(${player.number})`);
  playerToFade.classList.toggle('fade');
}

// update text based on
export function updateText(player) {
  // update text to say 'Player 1's turn'
  const gameText = document.querySelector('#sentence');
  gameText.textContent = `Player ${player.number}'s turn to shoot`;
}

export function winningText(player) {
  const gameText = document.querySelector('#sentence');
  gameText.textContent = `Player ${player.number} wins!`;
}

export function deactivateGrid(player) {
  const grid = document.querySelector(`#grid${player.number}`);
  for (let i = 0; i < [...grid.children].length; i += 1) {
    [...grid.children][i].style.pointerEvents = 'none';
    [...grid.children][i].classList.remove('hover');
  }
}

export function activateGrid(player) {
  const grid = document.querySelector(`#grid${player.number}`);
  for (let i = 0; i < [...grid.children].length; i += 1) {
    // allow the event listeners only for non hits
    if (![...[...grid.children][i].classList].includes('miss') && ![...[...grid.children][i].classList].includes('hit')) {
      [...grid.children][i].style.pointerEvents = 'auto';
    }
    // check if the square is not hit
    if (player.number === 2 && !player.gameboard.board[i].isHit) {
      [...grid.children][i].classList.add('hover');
    }
  }
}

export function removeButtons() {
  const startGameButton = document.querySelector('#place-ships');
  const instructionContainer = document.querySelector('.button-container');
  instructionContainer.remove();
  startGameButton.remove();
}
