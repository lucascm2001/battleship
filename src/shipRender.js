/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-relative-packages

function validToggle(board, shipObject) {
  const horizontal = shipObject.location[1] - shipObject.location[0] === 1;
  const { len } = shipObject;
  const startingIndex = shipObject.location[0];

  // check if vertical fits first if it was originally horizontal
  if (horizontal && startingIndex + 10 * (len - 1) > 99) return false;

  // check if horizontal first if it was originally vertical
  if (!horizontal && (startingIndex % 10) + (len - 1) > 9) return false;

  // check if toggling hits another ship

  for (let i = 1; i < len; i += 1) {
    // check if each cell does NOT have a .ship object that is not null
    let index;
    if (horizontal) { // check if toggling to horizontal hits a ship
      index = startingIndex + 10 * i;
    } else { // check if toggling to vertical hits a ship
      index = startingIndex + i;
    }
    // there is another ship at that point on the board (not the same ship)
    if (board.board[index].ship !== null) return false;
  }
  return true;
}

export function toggleAxis(gameboard, shipObject, shipBox) {
  // update gameboard
  // update UI
  if (validToggle(gameboard, shipObject)) {
    // update gameboard
    gameboard.updatePosition(shipObject, shipObject.location[0], true);
    const { len } = shipObject;
    const horizontal = shipObject.location[1] - shipObject.location[0] === 1;

    // render to screen
    if (horizontal) {
      shipBox.style.top = '-1px';
      shipBox.style.left = '-1px';
      shipBox.style.width = `${40 * len + len - 1}px`; // each square is 40px
      shipBox.style.height = '40px';
    } else { // vertical
      shipBox.style.top = '-1px';
      shipBox.style.left = '-1px';
      shipBox.style.width = '40px'; // each square is 40px
      shipBox.style.height = `${40 * len + len - 1}px`;
    }
  } else {
    shipBox.classList.add('toggle');
    shipBox.style.borderColor = 'red';
    shipBox.style.backgroundColor = '#FFCCCB';
    setTimeout(() => {
      shipBox.classList.remove('toggle');
      shipBox.style.borderColor = 'blue';
      shipBox.style.backgroundColor = 'lightblue';
    }, 600);
  }
}

export function updateShipPositions(gameboard) {
  // grab the information from the gameboard after clicking randomize ship placement
  // gameboard should have valid ship positions to use

  const shipBoxes = [...document.querySelectorAll('#grid1 .ship')];

  for (let i = 0; i < gameboard.ships.length; i += 1) {
    // loop over ships
    // match up the ship id with the shipBox id
    const shipBox = shipBoxes.find((box) => Number(box.getAttribute('data-id')) === gameboard.ships[i].id);
    // put the shipBox in the correct square element
    const containerSquare = shipBox.parentElement;
    containerSquare.removeChild(shipBox);

    const newSquareIndex = gameboard.ships[i].location[0];
    const newSquare = document.querySelector(`#grid1 .square:nth-child(${newSquareIndex + 1})`);
    newSquare.appendChild(shipBox);
  }
}

function validPosition(board, shipObject, originalX, originalY, movedRight, movedDown) {
  // get horizontal and vertical orientation
  const horizontal = shipObject.location[1] - shipObject.location[0] === 1;
  const horizLength = horizontal ? shipObject.len : 1;
  const vertLength = horizontal ? 1 : shipObject.len;
  // check to make sure each cell of the ship is on the grid
  // check horizontally
  if (originalX + movedRight < 0 || originalX + horizLength - 1 + movedRight > 9) return false;
  // check vertically
  if (originalY + movedDown < 0 || originalY + vertLength - 1 + movedDown > 9) return false;

  // check to see if it's position is not hitting another ship

  for (let i = 0; i < shipObject.len; i += 1) {
    // check if each cell does NOT have a .ship object that is not null
    let index;
    if (horizontal) {
      index = (originalX + movedRight) + (originalY + movedDown) * 10 + i;
    } else {
      index = (originalX + movedRight) + (originalY + movedDown) * 10 + 10 * i;
    }
    // there is another ship at that point on the board (not the same ship)
    if (board.board[index].ship !== null && !shipObject.location.includes(index)) return false;
  }
  return true;
}

function dragShips(board) {
  // loop over ship objects and implement this
  const shipBoxes = [...document.querySelectorAll('#grid1 .ship')];
  // const gridRect = document.querySelector('#grid1').getBoundingClientRect();

  for (let i = 0; i < shipBoxes.length; i += 1) {
    // update this to be the position of the ship
    const position = { x: 0, y: 0 };
    // const parentGrid = document.querySelector('#grid1');
    interact(shipBoxes[i])
      .draggable({
        modifiers: [
          interact.modifiers.snap({
            targets: [
              interact.snappers.grid({ x: 41, y: 41 }),
            ],
            offset: 'startCoords',
          }),
          interact.modifiers.restrict({
            // restriction: '#grid1',
            // endOnly: true,
          }),
        ],
      })
      .on('dragmove', (event) => {
        position.x += event.dx;
        position.y += event.dy;
        event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;

        const containerSquare = shipBoxes[i].parentElement;
        const squareIndex = [...containerSquare.parentNode.children].indexOf(containerSquare);
        const shipObject = board.board[squareIndex].ship;

        const originalPosX = squareIndex % 10;
        const originalPosY = Math.floor(squareIndex / 10);
        const movedRight = Math.round(position.x / 41);
        const movedDown = Math.round(position.y / 41);
        if (validPosition(board, shipObject, originalPosX, originalPosY, movedRight, movedDown)) {
          shipBoxes[i].style.backgroundColor = 'lightgreen';
          shipBoxes[i].style.borderColor = 'green';
        } else {
          shipBoxes[i].style.backgroundColor = '#FFCCCB';
          shipBoxes[i].style.borderColor = 'red';
        }
      })
      .on('dragend', (event) => {
        const containerSquare = shipBoxes[i].parentElement;
        const squareIndex = [...containerSquare.parentNode.children].indexOf(containerSquare);
        const shipObject = board.board[squareIndex].ship;

        const originalPosX = squareIndex % 10;
        const originalPosY = Math.floor(squareIndex / 10);
        const movedRight = Math.round(position.x / 41);
        const movedDown = Math.round(position.y / 41);

        // if valid
        // if not valid -- needs to fit on grid and needs to not overlap other ships
        // remove the box from the old square

        if (validPosition(board, shipObject, originalPosX, originalPosY, movedRight, movedDown)) {
          const newSquareIndex = squareIndex + movedRight + movedDown * 10;
          containerSquare.removeChild(shipBoxes[i]);

          // add the box to the new square
          const newSquare = document.querySelector(`#grid1 .square:nth-child(${newSquareIndex + 1})`);
          newSquare.appendChild(shipBoxes[i]);

          // update the board and ship objects
          // can only have 0 through 99 as input for newSquare
          board.updatePosition(shipObject, newSquareIndex, false);

          // reset the translation
          position.x = 0;
          position.y = 0;
          event.target.style.transform = 'translate(0, 0)';
        } else {
          // revert to original position
          position.x = 0;
          position.y = 0;
          event.target.style.transform = 'translate(0, 0)';
        }
        shipBoxes[i].style.backgroundColor = 'lightblue';
        shipBoxes[i].style.borderColor = 'blue';
      });
  }
}

function nonDragClick(element, board1, shipObject, shipBox) {
  const delta = 6;
  let startX;
  let startY;

  element.addEventListener('mousedown', (event) => {
    startX = event.pageX;
    startY = event.pageY;
  });

  element.addEventListener('mouseup', (event) => {
    const diffX = Math.abs(event.pageX - startX);
    const diffY = Math.abs(event.pageY - startY);

    if (diffX < delta && diffY < delta) {
      toggleAxis(board1, shipObject, shipBox);
    }
  });
}

export function showShips(board1, board2) {
  // for each ship, create a rectangle around the coordinates
  // first put down ship

  for (let i = 0; i < board1.shipLocations.length; i += 1) {
    const shipObject = board1.board[board1.shipLocations[i][0]].ship;

    // for each ship, create div and place it on top of the cells
    const shipBox = document.createElement('div');
    shipBox.classList.add('ship');
    shipBox.classList.add('draggable');
    shipBox.setAttribute('data-id', shipObject.id);

    // implement clicking functionality for ships
    nonDragClick(shipBox, board1, shipObject, shipBox);

    const len = board1.shipLocations[i].length;
    const firstIndex = board1.shipLocations[i][0];
    const horizontal = board1.shipLocations[i][1] - board1.shipLocations[i][0] === 1;

    if (horizontal) {
      shipBox.style.top = '-1px';
      shipBox.style.left = '-1px';
      shipBox.style.width = `${40 * len + len - 1}px`; // each square is 40px
      shipBox.style.height = '40px';
    } else { // vertical
      shipBox.style.top = '-1px';
      shipBox.style.left = '-1px';
      shipBox.style.width = '40px'; // each square is 40px
      shipBox.style.height = `${40 * len + len - 1}px`;
    }
    const squareToAppend = document.querySelector(`#grid1 .square:nth-child(${firstIndex + 1})`);
    squareToAppend.appendChild(shipBox);
  }

  dragShips(board1);

  // TODO: need to remove this for playing the bot

  for (let i = 0; i < board2.shipLocations.length; i += 1) {
    // for each ship, create div and place it on top of the cells
    const shipObject = board2.board[board2.shipLocations[i][0]].ship;

    const shipBox = document.createElement('div');
    shipBox.classList.add('no-see-ship');
    shipBox.setAttribute('data-id', shipObject.id);

    const len = board2.shipLocations[i].length;
    const firstIndex = board2.shipLocations[i][0];
    const horizontal = board2.shipLocations[i][1] - board2.shipLocations[i][0] === 1;

    if (horizontal) {
      shipBox.style.top = '-1px';
      shipBox.style.left = '-1px';
      shipBox.style.width = `${40 * len + len - 1}px`; // each square is 40px
      shipBox.style.height = '40px';
    } else { // vertical
      shipBox.style.top = '-1px';
      shipBox.style.left = '-1px';
      shipBox.style.width = '40px'; // each square is 40px
      shipBox.style.height = `${40 * len + len - 1}px`;
    }
    const squareToAppend = document.querySelector(`#grid2 .square:nth-child(${firstIndex + 1})`);
    squareToAppend.appendChild(shipBox);
  }
}

export function deactivateShips() {
  const ships = [...document.querySelectorAll('#grid1 .ship')];
  for (let i = 0; i < ships.length; i += 1) {
    ships[i].style.pointerEvents = 'none';
  }
}

export function shipSunk(player, ship) {
  // grab the right shipBox
  const rightClass = player.number === 1 ? '.ship' : '.no-see-ship';
  const shipBoxes = [...document.querySelectorAll(`#grid${player.number} ${rightClass}`)];
  const shipBox = shipBoxes.find((box) => Number(box.getAttribute('data-id')) === ship.id);

  shipBox.classList.remove('no-see-ship');
  shipBox.classList.add('ship');
  shipBox.style.backgroundColor = '#FFCCCB';
  shipBox.style.border = '2px solid red';
}
