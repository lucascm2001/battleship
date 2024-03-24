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

export function updateText(playerNumber, hit, beginningText) {
  const gameText = document.querySelector('#sentence');

  if (beginningText) {
    gameText.textContent = 'Place your ships.';
  } else {
    const playerText = playerNumber === 1 ? 'Player' : 'Computer';
    const hitText = hit ? 'hit' : 'missed';
    gameText.textContent = `${playerText} ${hitText}`;
  }
}

export function updateBoard(enemyPlayer, index) {
  const boardNumber = enemyPlayer.number;
  const square = document.querySelector(`#grid${boardNumber} .square:nth-child(${index + 1})`);

  // will only receive valid places to hit
  // need to only update that grid
  if (enemyPlayer.gameboard.board[index].ship === null) {
    square.classList.add('miss');
    enemyPlayer.gameboard.receiveAttack(index);
    updateText((enemyPlayer.number + 1) % 2, false, false);
  } else {
    const hitBox = document.createElement('div');
    hitBox.classList.add('hitBox');
    hitBox.style.pointerEvents = 'none';
    square.classList.add('hit');
    square.appendChild(hitBox);

    enemyPlayer.gameboard.receiveAttack(index);
    updateText((enemyPlayer.number % 2) + 1, true, false);

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

export function winningText(player) {
  const gameText = document.querySelector('#sentence');
  if (player.number === 1) {
    gameText.textContent = 'Player wins!';
  } else {
    gameText.textContent = 'Computer wins!';
  }
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
  const startGameButton = document.querySelector('#play');
  const instructionContainer = document.querySelector('.instructions-container');

  instructionContainer.remove();
  startGameButton.remove();
}

export function changeDifficulty() {
  const easyButton = document.querySelector('#easy');
  const hardButton = document.querySelector('#hard');

  easyButton.addEventListener('click', () => {
    easyButton.classList.add('difficulty-clicked');
    hardButton.classList.remove('difficulty-clicked');

    easyButton.classList.remove('difficulty-not-clicked');
    hardButton.classList.add('difficulty-not-clicked');
  });
  hardButton.addEventListener('click', () => {
    hardButton.classList.add('difficulty-clicked');
    easyButton.classList.remove('difficulty-clicked');

    hardButton.classList.remove('difficulty-not-clicked');
    easyButton.classList.add('difficulty-not-clicked');
  });
}

export function setDifficulty() {
  const easyButton = document.querySelector('#easy');

  if ([...easyButton.classList].includes('difficulty-clicked')) {
    return 'easy';
  }
  return 'hard';
}
