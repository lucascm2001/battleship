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

export default function selectIndex(gameboard) {
  // hunt mode if there are no hits that haven't resulted in a sunked ship
  // target mode if there are hits but those haven't resulted in a sink
  // just add things to a stack hehe
  if (stack.length !== 0) {
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
