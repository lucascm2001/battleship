export function showShips(board1, board2) {
  // for each ship, create a rectangle around the coordinates
  // first put down ship

  for (let i = 0; i < board1.shipLocations.length; i += 1) {
    // for each ship, create div and place it on top of the cells
    const shipBox = document.createElement('div');
    shipBox.classList.add('ship');

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

  for (let i = 0; i < board2.shipLocations.length; i += 1) {
    // for each ship, create div and place it on top of the cells
    const shipBox = document.createElement('div');
    shipBox.classList.add('ship');

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

export function dragShips() {

}
