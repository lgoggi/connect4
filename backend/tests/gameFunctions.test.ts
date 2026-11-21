import { test } from "node:test";
import assert from "node:assert/strict";
import { createGrid, isBoardFull, isValidColumn, isWinningMove, landingRow, ROWS } from "../gameFunctions";
import type { Grid, PlayerId } from "../types/game-types";

/**
 * Builds a grid from a picture of the board, top row first.
 * "X" = player1, "O" = player2, "." = empty.
 */
function board(...rows: string[]): Grid {
  const grid = createGrid();
  rows.forEach((line, i) => {
    const row = ROWS - rows.length + i;
    [...line].forEach((ch, column) => {
      if (ch === ".") return;
      const player: PlayerId = ch === "X" ? "player1" : "player2";
      grid[column][row] = { column, row, occupied: true, player };
    });
  });
  return grid;
}

const BOTTOM = ROWS - 1;

test("horizontal win with the new disc at the end of the line", () => {
  assert.ok(isWinningMove(board("OXXXX.."), 4, BOTTOM));
});

test("horizontal win with an opponent disc touching the new one", () => {
  // These two were missed by the old check, which stopped at the opponent's disc.
  assert.ok(isWinningMove(board("OXXXX.."), 1, BOTTOM));
  assert.ok(isWinningMove(board("XXXXO.."), 3, BOTTOM));
});

test("horizontal win with the new disc in the middle of the line", () => {
  assert.ok(isWinningMove(board(".XXXX.."), 2, BOTTOM));
});

test("three in a row is not a win", () => {
  assert.ok(!isWinningMove(board("XXX.O.."), 2, BOTTOM));
  assert.ok(!isWinningMove(board("XXXOX.."), 4, BOTTOM));
});

test("vertical win", () => {
  assert.ok(isWinningMove(board("X......", "X......", "X......", "X......"), 0, BOTTOM - 3));
});

test("vertical line broken by the opponent is not a win", () => {
  assert.ok(!isWinningMove(board("X......", "X......", "O......", "X......", "X......"), 0, BOTTOM - 4));
});

test("diagonal win going up to the right", () => {
  const grid = board(
    "...X...", //
    "..XO...",
    ".XOO...",
    "XOOO...",
  );
  for (const [c, r] of [
    [0, BOTTOM],
    [1, BOTTOM - 1],
    [2, BOTTOM - 2],
    [3, BOTTOM - 3],
  ]) {
    assert.ok(isWinningMove(grid, c, r), `disc at column ${c} should win`);
  }
});

test("diagonal win going down to the right, with an opponent disc at one end", () => {
  const grid = board(
    "O......", //
    "OX.....",
    "OOX....",
    "XOOX...",
    "XXOOX..",
  );
  // The line runs (1,2) (2,3) (3,4) (4,5); (0,1) above it is the opponent's.
  assert.ok(isWinningMove(grid, 2, BOTTOM - 2));
  assert.ok(isWinningMove(grid, 1, BOTTOM - 3));
});

test("landingRow finds the lowest free row and reports full columns", () => {
  assert.equal(landingRow(createGrid(), 3), BOTTOM);
  assert.equal(landingRow(board("X......", "O......"), 0), BOTTOM - 2);
  assert.equal(landingRow(board("X", "O", "X", "O", "X", "O"), 0), -1);
});

test("isBoardFull", () => {
  assert.ok(!isBoardFull(createGrid()));
  const full = board("XOXOXOX", "XOXOXOX", "OXOXOXO", "OXOXOXO", "XOXOXOX", "XOXOXOX");
  assert.ok(isBoardFull(full));
});

test("isValidColumn rejects anything but an integer from 0 to 6", () => {
  for (const ok of [0, 3, 6]) assert.ok(isValidColumn(ok));
  for (const bad of [-1, 7, 99, 1.5, NaN, "3", null, undefined, {}]) assert.ok(!isValidColumn(bad), String(bad));
});
