"use client";

import { useEffect } from "react";
import { useGame } from "@/providers/GameProvider";
import { Board } from "./Board";
import { Header } from "./Header";
import { InviteModal } from "./InviteModal";
import { PlayerCard } from "./PlayerCard";
import { RestartModal } from "./RestartModal";
import { ResultModal } from "./ResultModal";
import { TurnIndicator } from "./TurnIndicator";

/*
 * Page grid. Desktop: 3 columns x 3 rows, cards beside the board.
 * Tablet and below: 1fr auto 1fr x 4 rows, cards stacked above the board.
 * Each child places itself with col-start / row-start.
 *
 *   desktop                       tablet
 *   .       header  .             .  header   .
 *   player1 board   player2       .  players  .
 *   footer  footer  footer        .  board    .
 *                                 footer footer footer
 */
export function GameScreen({ roomID }: { roomID: string }) {
  const { players, enterRoom, isConnected, result, restartRequested, boardVersion } = useGame();

  useEffect(() => {
    enterRoom(roomID);
  }, [enterRoom, roomID]);

  return (
    <>
      {restartRequested && <RestartModal />}
      {result.display && <ResultModal />}
      {!isConnected && <InviteModal roomID={roomID} />}
      <main className="grid h-screen w-screen grid-cols-[3fr_4fr_3fr] grid-rows-[1fr_4fr_1.5fr] justify-items-center bg-main-purple max-tablet:grid-cols-[1fr_auto_1fr] max-tablet:grid-rows-[auto] max-tablet:[justify-items:normal]">
        <Header />
        <div className="col-span-full row-start-3 h-[110%] self-end justify-self-stretch rounded-t-[50px] bg-darker-purple max-tablet:row-start-4" />
        <PlayerCard player={players.player1} />
        <PlayerCard player={players.player2} />
        <Board />
        {/* Remounting on every server update restarts the turn clock. */}
        <TurnIndicator key={boardVersion} />
      </main>
    </>
  );
}
