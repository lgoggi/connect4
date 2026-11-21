"use client";

import { useGame } from "@/providers/GameProvider";
import type { Cell } from "@/types/game";

// The ::before is the dark rim that makes an empty slot look like a hole; a
// disc in the slot gets a softer one.
const disc =
  "absolute z-1 box-content size-(--ball-size) rounded-full border-4 border-black before:absolute before:-z-1 before:size-full before:rounded-full before:content-['']";
const discByOwner: Record<string, string> = {
  empty: "bg-main-purple before:mt-2.5 before:shadow-[0_-10px_rgba(0,0,0,0.8)]",
  player1: "bg-player1 before:mt-2 before:shadow-[0_-8px_rgba(0,0,0,0.5)]",
  player2: "bg-player2 before:mt-2 before:shadow-[0_-8px_rgba(0,0,0,0.5)]",
};

function discClass(cell: Cell) {
  return `${disc} ${discByOwner[cell.player] ?? discByOwner.empty}`;
}

export function Board() {
  const { grid, playMove, result } = useGame();

  const handleColumnClick = (column: number) => {
    if (result.isFinished) return;
    playMove(column);
  };

  return (
    <div className="col-start-2 row-start-2 box-content grid h-full min-h-140 w-full min-w-160 grid-cols-7 gap-[15px] self-start rounded-[25px] border-[3px] border-black bg-white px-2.5 pt-2.5 shadow-[0_16px_rgba(0,0,0,0.9)] [--ball-size:4.5rem] max-tablet:row-start-3 max-tablet:min-h-100 max-tablet:w-[80vw] max-tablet:max-w-160 max-tablet:min-w-[28.2rem] max-tablet:[--ball-size:3.5rem] max-phone:min-h-[35vh] max-phone:min-w-[85vw] max-phone:[--ball-size:2rem]">
      {grid.map((column, columnIndex) => (
        <button
          key={columnIndex}
          type="button"
          onClick={() => handleColumnClick(columnIndex)}
          aria-label={`Drop a disc in column ${columnIndex + 1}`}
          // text-left: a centered button would shift the disc's ::before, which
          // is placed from its static position.
          className="flex h-[92%] w-full cursor-pointer flex-col items-start justify-center gap-[15px] text-left [-webkit-tap-highlight-color:transparent] focus-visible:rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-darker-purple max-phone:gap-0"
        >
          {column.map((cell, rowIndex) => (
            <span key={rowIndex} className="grid size-full place-items-center">
              <span className={discClass(cell)} />
            </span>
          ))}
        </button>
      ))}
    </div>
  );
}
