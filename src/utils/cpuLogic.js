// src/utils/cpuLogic.js

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export function findImmediateMove(board, player) {
  for (let p of winPatterns) {
    const [a,b,c] = p;
    const vals = [board[a], board[b], board[c]];
    const count = vals.filter(v => v === player).length;
    const emptyIndex = vals.indexOf("");
    if (count === 2 && emptyIndex !== -1) {
      return p[emptyIndex];
    }
  }
  return null;
}

export function getRandomMove(board) {
  const empties = board.map((v,i) => (v === "" ? i : null)).filter(i => i !== null);
  if (!empties.length) return -1;
  return empties[Math.floor(Math.random() * empties.length)];
}

export function getBestMoveHard(board) {
  // 1) win
  let m = findImmediateMove(board, "o");
  if (m !== null) return m;

  // 2) block
  m = findImmediateMove(board, "x");
  if (m !== null) return m;

  // 3) center
  if (board[4] === "") return 4;

  // 4) corners
  const corners = [0,2,6,8].filter(i => board[i] === "");
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];

  // 5) sides
  const sides = [1,3,5,7].filter(i => board[i] === "");
  if (sides.length) return sides[Math.floor(Math.random()*sides.length)];

  return -1;
}

export function getBestMoveMedium(board) {
  // Medium: block if necessary, otherwise random
  let m = findImmediateMove(board, "x");
  if (m !== null) return m;
  return getRandomMove(board);
}

/**
 * getMove(difficulty, board)
 * difficulty: "easy"|"medium"|"hard"
 * board: array length 9 with "", "x", "o"
 */
export function getMove(difficulty, board) {
  if (difficulty === "hard") return getBestMoveHard(board);
  if (difficulty === "medium") return getBestMoveMedium(board);
  // default easy
  return getRandomMove(board);
}
