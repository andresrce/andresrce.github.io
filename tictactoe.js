const boardEl = document.getElementById('board');
let turn = 'X', state = Array(9).fill(null);
// Inicializar tablero
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.addEventListener('click', () => play(i, cell));
  boardEl.appendChild(cell);
}
function play(i, cell) {
  if (state[i]) return;
  state[i] = turn;
  cell.textContent = turn;
  if (checkWin()) alert(`${turn} gana!`);
  turn = turn === 'X' ? 'O' : 'X';
}
function checkWin() {
  const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return combos.some(c => c.every(i => state[i] === turn));
}
