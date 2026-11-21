import type { Grid, PlayerId } from "./types/game-types";

export const COLUMNS = 7;
export const ROWS = 6;
const WIN_LENGTH = 4;

// Horizontal, vertical and both diagonals. Each is walked both ways.
const DIRECTIONS: [number, number][] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

export function createGrid(): Grid {
  return Array.from({ length: COLUMNS }, (_, column) =>
    Array.from({ length: ROWS }, (_, row) => ({ column, row, occupied: false, player: "empty" as const })),
  );
}

export function isValidColumn(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) < COLUMNS;
}

/** Row a disc dropped in `column` lands on, or -1 when the column is full. */
export function landingRow(grid: Grid, column: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!grid[column][row].occupied) return row;
  }
  return -1;
}

/** Whether the disc at (column, row) completes a line of four for its owner. */
export function isWinningMove(grid: Grid, column: number, row: number): boolean {
  const player = grid[column][row].player;
  if (player === "empty") return false;
  return DIRECTIONS.some(
    ([dc, dr]) =>
      1 + countInDirection(grid, column, row, dc, dr, player) + countInDirection(grid, column, row, -dc, -dr, player) >=
      WIN_LENGTH,
  );
}

/** Consecutive discs of `player` next to (column, row), walking one way. */
function countInDirection(grid: Grid, column: number, row: number, dc: number, dr: number, player: PlayerId): number {
  let count = 0;
  let c = column + dc;
  let r = row + dr;
  while (c >= 0 && c < COLUMNS && r >= 0 && r < ROWS && grid[c][r].player === player) {
    count++;
    c += dc;
    r += dr;
  }
  return count;
}

export function isBoardFull(grid: Grid): boolean {
  return grid.every((column) => column[0].occupied);
}
