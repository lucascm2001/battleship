export default function restartGame(player) {
  const dialog = document.querySelector('dialog');
  const closeDialog = document.querySelector('.close');
  const playerNumber = document.querySelector('#winning-player');
  playerNumber.textContent = player.number === 1 ? 'Player' : 'Computer';

  dialog.showModal();

  closeDialog.addEventListener('click', () => {
    dialog.close();
    window.location.reload();
  });
}
