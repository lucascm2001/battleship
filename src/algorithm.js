/* eslint-disable no-restricted-syntax */

// ---------------- these functions are for easy mode --------
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

export function selectIndexEasy(gameboard) {
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

// ------------ these functions are for hard mode ---------------
function range(a, b) {
  return [...Array(b - a + 1).keys()].map((x) => x + a);
}

function range10(a, b) {
  return [...Array(Math.floor(b / 10) - Math.floor(a / 10) + 1).keys()].map((x) => 10 * x + a);
}

function generateProbabilityMap(gameboard) {
  const probMap = Array(100).fill(0);
  const nonSunkShips = gameboard.ships.filter((ship) => !ship.isSunk());
  for (let j = 0; j < nonSunkShips.length; j += 1) {
    const ship = nonSunkShips[j];
    for (let i = 0; i < gameboard.board.length; i += 1) {
      // if it is an empty cell, get potential ship endpoints
      if (!gameboard.board[i].isHit) {
        const endpoints = [];
        if ((i % 10) + ship.len - 1 <= 9) {
          endpoints.push([i, i + ship.len - 1, 'x']);
        }
        if (i + 10 * (ship.len - 1) <= 99) {
          endpoints.push([i, i + 10 * (ship.len - 1), 'y']);
        }
        for (const possEndpoints of endpoints) {
          // loop here to add to probability map for possible ship placements
          if (possEndpoints[2] === 'x') {
            const rangePoints = range(possEndpoints[0], possEndpoints[1]);
            if (rangePoints.every((index) => !gameboard.board[index].isHit)) {
              for (let k = possEndpoints[0]; k <= possEndpoints[1]; k += 1) {
                probMap[k] += 1;
              }
            }
          } else if (possEndpoints[2] === 'y') {
            const rangePoints = range10(possEndpoints[0], possEndpoints[1]);
            if (rangePoints.every((index) => !gameboard.board[index].isHit)) {
              for (let k = possEndpoints[0]; k <= possEndpoints[1]; k += 10) {
                probMap[k] += 1;
              }
            }
          }
        }
      }

      // increase probability of attacking squares near successful hits
      if (gameboard.board[i].isHit
        && gameboard.board[i].ship !== null
        && !gameboard.board[i].ship.isSunk()) { // has hit ship, not sunk
        // check to the right
        if ((i % 10) + 1 <= 9 && !gameboard.board[i + 1].isHit) {
          if ((i % 10) - 1 >= 0
            && gameboard.board[i + 1].ship !== null
            && !gameboard.board[i + 1].ship.isSunk()) {
            probMap[i + 1] += 15;
          } else {
            probMap[i + 1] += 10;
          }
        }
        // check to the left
        if ((i % 10) - 1 >= 0 && !gameboard.board[i - 1].isHit) {
          if ((i % 10) + 1 <= 9
            && gameboard.board[i - 1].ship !== null
            && !gameboard.board[i - 1].ship.isSunk()) {
            probMap[i - 1] += 15;
          } else {
            probMap[i - 1] += 10;
          }
        }
        // check below
        if (i + 10 <= 99 && !gameboard.board[i + 10].isHit) {
          if (i - 10 >= 0
            && gameboard.board[i - 10].ship !== null
            && !gameboard.board[i - 10].ship.isSunk()) {
            probMap[i + 10] += 15;
          } else {
            probMap[i + 10] += 10;
          }
        }
        // check above
        if (i - 10 >= 0 && !gameboard.board[i - 10].isHit) {
          if (i + 10 <= 99
            && gameboard.board[i + 10].ship !== null
            && !gameboard.board[i + 10].ship.isSunk()) {
            probMap[i - 10] += 15;
          } else {
            probMap[i - 10] += 10;
          }
        }
      } else if (gameboard.board[i].isHit && gameboard.board[i].ship === null) {
        // set any misses to 0 probability
        probMap[i] = 0;
      }
    }
  }
  return probMap;
}

export function selectIndexHard(gameboard) {
  const probMap = generateProbabilityMap(gameboard);
  // find index with maximum value
  // eslint-disable-next-line arrow-body-style
  const indexMaxValue = probMap.reduce((bestIndex, curr, currIndex, arr) => {
    return curr > arr[bestIndex] ? currIndex : bestIndex;
  }, 0);
  return indexMaxValue;
}
