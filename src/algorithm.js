let stack = [];

function addToStack(gameboard, target) {
  if (gameboard.board[target].ship !== null) {
    if (target - 10 >= 0 && !gameboard.board[target - 10].isHit) stack.unshift(target - 10);
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
