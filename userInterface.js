/* eslint-disable import/extensions */
// create grids

export function createGrids() {
  const container = document.querySelector('.board-container');

  const grid1 = document.createElement('div');
  grid1.classList.add('grid');
  grid1.setAttribute('id', 'grid1');

  for (let i = 0; i < 100; i += 1) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add('hover');
    grid1.appendChild(square);
  }

  const grid2 = document.createElement('div');
  grid2.classList.add('grid');
  grid2.setAttribute('id', 'grid2');

  for (let i = 0; i < 100; i += 1) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add('hover');
    grid2.appendChild(square);
  }
  container.appendChild(grid1);
  container.appendChild(grid2);
}

function waitForMs(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}
async function typeSentence(sentence, eleRef, delay = 100) {
  eleRef.textContent = '';
  const letters = sentence.split('');
  let i = 0;
  while (i < letters.length) {
    await waitForMs(delay);
    eleRef.textContent += letters[i];
    i += 1;
  }
}

export function initialText() {
  const gameText = document.querySelector('#sentence');
  typeSentence('Welcome to Battleship!', gameText);
}

function hitText(player, hit) {
  const gameText = document.querySelector('#sentence');
  if (hit) {
    typeSentence(`Player ${player.number} hit!`, gameText);
  } else {
    typeSentence(`Player ${player.number} missed`, gameText);
  }
}

export function updateBoard(enemyPlayer, x, y) {
  const index = x + y * 10;
  const boardNumber = enemyPlayer.number;
  const square = document.querySelector(`#grid${boardNumber} .square:nth-child(${index + 1})`);

  enemyPlayer.gameboard.receiveAttack(x, y);
  // need to only update that grid
  if (enemyPlayer.gameboard.board[index].ship === null) {
    square.textContent = '*';
    // hitText(player, false);
  } else {
    square.textContent = 'x';
    // hitText(player, true);
  }
}

// fade board not being hit and toggle the hover effect
export function fadeBoard(player) {
  const gridToFade = document.querySelector(`#grid${player.number}`);
  gridToFade.classList.toggle('fade');
  [...gridToFade.children].forEach((square) => {
    square.classList.toggle('hover');
  });
}

// update text based on
export function updateText(player) {
  // update text to say 'Player 1's turn'
  const gameText = document.querySelector('#sentence');
  gameText.textContent = `Player ${player.number}'s turn to shoot`;
  // typeSentence(`Player ${player.number}'s turn to shoot`, gameText);
}

export function deactivateGrid(player) {
  const grid = document.querySelector(`#grid${player.number}`);
  for (let i = 0; i < [...grid.children].length; i += 1) {
    [...grid.children][i].style.pointerEvents = 'none';
  }
}

export function activateGrid(player) {
  const grid = document.querySelector(`#grid${player.number}`);
  for (let i = 0; i < [...grid.children].length; i += 1) {
    [...grid.children][i].style.pointerEvents = 'auto';
  }
}
