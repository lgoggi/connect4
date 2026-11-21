"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/providers/GameProvider";
import { TurnBackground } from "@/components/ui/icons";
import { TURN_SECONDS } from "@/types/game";

const labelBg = { player1: "bg-player1", player2: "bg-player2" } as const;

/** Expects to be remounted (via `key`) on every board update, which restarts the clock. */
export function TurnIndicator() {
  const { isConnected, turn, result, players, passTurn } = useGame();
  const [time, setTime] = useState(TURN_SECONDS);
  const running = isConnected && !result.isFinished;
  const myTurn = players[turn].display === "you";

  useEffect(() => {
    if (!running) return;
    if (time === 0) {
      // Only the player on the clock reports the timeout. If both did, the
      // opponent's report could land after the turn flipped and flip it back.
      // When the server takes the turn away it sends a board update and this
      // component remounts; if it refuses, the clock just starts over.
      if (myTurn) passTurn();
      setTime(TURN_SECONDS);
      return;
    }
    const tick = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(tick);
  }, [running, time, myTurn, passTurn]);

  const finished = result.isFinished && result.winner !== "";
  const highlighted = finished ? result.winner || turn : turn;
  const label = finished
    ? players[highlighted].display
    : myTurn
      ? "your turn"
      : "opponent's turn";

  // Shares the footer cell with the purple footer bar, drawn on top of it.
  return (
    <div className="col-span-full row-start-3 grid w-full place-items-center justify-center self-start max-tablet:row-start-4">
      <TurnBackground player={highlighted} className="col-start-1 row-start-1 self-start" />
      <div className="col-start-1 row-start-1 flex h-fit w-fit flex-col items-center justify-center self-end pb-2.5">
        <div className={`text-[1.3rem] font-extrabold text-white ${labelBg[highlighted]}`}>{label}</div>
        <div className="text-[4rem] font-semibold text-white">{finished ? "WON" : `${time}s`}</div>
      </div>
    </div>
  );
}
