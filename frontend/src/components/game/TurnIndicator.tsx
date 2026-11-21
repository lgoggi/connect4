"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/providers/GameProvider";
import { TurnBackground } from "@/components/ui/icons";
import { TURN_SECONDS } from "@/types/game";

const labelBg = { player1: "bg-player1", player2: "bg-player2" } as const;

/**
 * Shows whose turn it is and a countdown. The server runs the real clock and
 * passes the turn when it runs out; this one only displays it. Expects to be
 * remounted (via `key`) on every board update, which restarts the countdown.
 */
export function TurnIndicator() {
  const { isConnected, turn, result, players } = useGame();
  const [time, setTime] = useState(TURN_SECONDS);
  const running = isConnected && !result.isFinished && time > 0;

  useEffect(() => {
    if (!running) return;
    const tick = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(tick);
  }, [running, time]);

  let highlighted = turn;
  let label = players[turn].display === "you" ? "your turn" : "opponent's turn";
  let big = `${time}s`;
  if (result.isFinished && result.winner) {
    highlighted = result.winner;
    label = players[result.winner].display ?? result.winner;
    big = "WON";
  } else if (result.isFinished) {
    label = "game over";
    big = "DRAW";
  }

  // Shares the footer cell with the purple footer bar, drawn on top of it.
  return (
    <div className="col-span-full row-start-3 grid w-full place-items-center justify-center self-start max-tablet:row-start-4">
      <TurnBackground player={highlighted} className="col-start-1 row-start-1 self-start" />
      <div className="col-start-1 row-start-1 flex h-fit w-fit flex-col items-center justify-center self-end pb-2.5">
        <div className={`text-[1.3rem] font-extrabold text-white ${labelBg[highlighted]}`}>{label}</div>
        <div className="text-[4rem] font-semibold text-white">{big}</div>
      </div>
    </div>
  );
}
