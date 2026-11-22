"use client";

import type { CSSProperties } from "react";
import { useGame } from "@/providers/GameProvider";
import { COLUMNS, ROWS, type Grid, type PlayerId } from "@/types/game";

// The ::before is the dark rim that makes an empty slot look like a hole; a
// disc in the slot gets a softer one.
const disc =
  "absolute z-1 box-content size-(--ball-size) rounded-full border-4 border-black before:absolute before:-z-1 before:size-full before:rounded-full before:content-['']";
const hole = `${disc} bg-main-purple before:mt-2.5 before:shadow-[0_-10px_rgba(0,0,0,0.8)]`;
const discByOwner: Record<string, string> = {
  player1: "bg-player1 before:mt-2 before:shadow-[0_-8px_rgba(0,0,0,0.5)]",
  player2: "bg-player2 before:mt-2 before:shadow-[0_-8px_rgba(0,0,0,0.5)]",
};

/** Seconds a disc takes to fall `rows` cells, bounce included. */
const dropSeconds = (rows: number) => 0.35 + rows * 0.06;
/** The winning discs start pulsing once the last one has landed. */
const PULSE_DELAY_S = dropSeconds(ROWS);

const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
] as const;

/** "column:row" keys of every disc that is part of a line of four for `winner`. */
function findWinningCells(grid: Grid, winner: PlayerId): Set<string> {
  const owns = (c: number, r: number) => c >= 0 && c < COLUMNS && r >= 0 && r < ROWS && grid[c][r].player === winner;
  const cells = new Set<string>();
  for (let c = 0; c < COLUMNS; c++) {
    for (let r = 0; r < ROWS; r++) {
      for (const [dc, dr] of DIRECTIONS) {
        if ([0, 1, 2, 3].every((i) => owns(c + i * dc, r + i * dr))) {
          for (let i = 0; i < 4; i++) cells.add(`${c + i * dc}:${r + i * dr}`);
        }
      }
    }
  }
  return cells;
}

export function Board() {
  const { grid, playMove, result } = useGame();
  const winningCells = result.winner ? findWinningCells(grid, result.winner) : new Set<string>();

  const handleColumnClick = (column: number) => {
    if (result.isFinished) return;
    playMove(column);
  };

  return (
    <div className="col-start-2 row-start-2 box-content grid h-full min-h-140 w-full min-w-160 grid-cols-7 gap-(--gap) self-start rounded-[25px] border-[3px] border-black bg-white px-2.5 pt-2.5 shadow-[0_16px_rgba(0,0,0,0.9)] [--ball-size:4.5rem] [--gap:15px] max-tablet:row-start-3 max-tablet:min-h-100 max-tablet:w-[80vw] max-tablet:max-w-160 max-tablet:min-w-[28.2rem] max-tablet:[--ball-size:3.5rem] max-phone:min-h-[35vh] max-phone:min-w-[85vw] max-phone:[--ball-size:2rem]">
      {grid.map((column, columnIndex) => (
        <button
          key={columnIndex}
          type="button"
          onClick={() => handleColumnClick(columnIndex)}
          aria-label={`Drop a disc in column ${columnIndex + 1}`}
          // text-left: a centered button would shift the disc's ::before, which
          // is placed from its static position.
          className="flex h-[92%] w-full cursor-pointer flex-col items-start justify-center gap-(--gap) text-left [-webkit-tap-highlight-color:transparent] focus-visible:rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-darker-purple max-phone:[--gap:0px]"
        >
          {column.map((cell, rowIndex) => {
            const owner = discByOwner[cell.player];
            const wins = winningCells.has(`${columnIndex}:${rowIndex}`);
            return (
              <span key={rowIndex} className="relative grid size-full place-items-center">
                <span className={hole} />
                {/* Mounts when the disc lands in this slot, so the drop plays once per move. */}
                {owner && (
                  <span
                    className="absolute inset-0 z-2 grid animate-drop place-items-center motion-reduce:animate-none"
                    style={
                      {
                        "--drop-rows": rowIndex + 1,
                        "--drop-duration": `${dropSeconds(rowIndex + 1)}s`,
                      } as CSSProperties
                    }
                  >
                    <span
                      className={`${disc} ${owner} ${wins ? "animate-win-pulse ring-4 ring-darker-purple motion-reduce:animate-none" : ""}`}
                      style={wins ? ({ "--pulse-delay": `${PULSE_DELAY_S}s` } as CSSProperties) : undefined}
                    />
                  </span>
                )}
              </span>
            );
          })}
        </button>
      ))}
    </div>
  );
}
