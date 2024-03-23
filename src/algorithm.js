let stack = [];

function addToStack(gameboard, target) {
  if (gameboard.board[target].ship !== null) {
    if (target - 10 >= 0 && !gameboard.board[target - 10].isHit) {
      // check if there are two below it to push instead of unshift
      // make sure it's on the board and make sure they're both not part of sunken ships
      // also make sure removing duplicates keeps the last guys, maybe use shift
      stack.unshift(target - 10);
    }
    if (target + 10 <= 99 && !gameboard.board[target + 10].isHit) stack.unshift(target + 10);
    if ((target % 10) - 1 >= 0 && !gameboard.board[target - 1].isHit) stack.unshift(target - 1);
    if ((target % 10) + 1 <= 9 && !gameboard.board[target + 1].isHit) stack.unshift(target + 1);
  }
  // remove duplicates from stack
  stack = [...new Set(stack)];
}

function noStrayHits(gameboard) {
  for (let i = 0; i < gameboard.board.length; i += 1) {
    if (gameboard.board[i].isHit && gameboard.board[i].ship !== null) {
      if (!gameboard.board[i].ship.isSunk()) return false;
    }
  }
  return true;
}
/*
function checkAround(index) {
  const adjacentIndices = [];
  if (index - 10 >= 0) adjacentIndices.push(index - 10);
  if (index + 10 <= 99) adjacentIndices.push(index + 10);
  if ((index % 10) - 1 >= 0) adjacentIndices.push(index - 1);
  if ((index % 10) + 1 <= 9) adjacentIndices.push(index + 1);
  return adjacentIndices;
}

function followPossibleShip(gameboard) {
  // if there are two in one direction, follow that direction
  for (let i = 0; i < gameboard.board.length; i += 1) {
    // check for a hit that isn't part of a sunken ship
    if (gameboard.board[i].isHit
      && gameboard.board[i].ship !== null
      && !gameboard.board[i].ship.isSunk()) {
      // check around this cell for another
      const adjacentIndices = checkAround(i);
      adjacentIndices.forEach((val) => {
        if (gameboard.board[val].isHit
          && gameboard.board[val].ship !== null
          && !gameboard.board[i].ship.isSunk()) {
          return val;
        }
        return -1;
      });
    }
  }
  return -1;
} */
/*
function noConfinedSquares(gameboard) {

}
*/
export default function selectIndex(gameboard) {
  if (noStrayHits(gameboard)) {
    stack = [];
  }
  if (stack.length !== 0) {
    // clear stack if all hits are part of sunken ships
    addToStack(gameboard, stack[stack.length - 1]);
    return stack.pop();
  }
  // hunting mode
  const possibleEvenIndices = gameboard.board.map((cell, index) => {
    const checkerSquare = (Math.floor(index / 10) + (index % 10)) % 2 === 1;
    if (!cell.isHit && checkerSquare) return index;
    return null;
  }).filter((val) => val !== null);
  const randomIndex = Math.floor(Math.random() * possibleEvenIndices.length);

  addToStack(gameboard, possibleEvenIndices[randomIndex]);
  return possibleEvenIndices[randomIndex];
}

// change the checkerboard pattern to adapt to hits and misses
// change checkerboard to every 3 when the 2 is gone
