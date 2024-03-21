export default function selectIndex(gameboard) {
  let randomIndex = Math.floor(Math.random() * gameboard.board.length);
  while (gameboard.board[randomIndex].isHit) {
    randomIndex = Math.floor(Math.random() * gameboard.board.length);
  }
  return randomIndex;
}

function huntAndTarget() {

}
