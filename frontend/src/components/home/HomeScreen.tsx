"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/providers/GameProvider";
import { Logo } from "@/components/ui/icons";
import { GameRules } from "./GameRules";

const button =
  "h-12 w-60 cursor-pointer rounded-xl text-[1.2rem] font-semibold shadow-[3px_4px_rgba(0,0,0,0.75)] disabled:cursor-wait disabled:opacity-70";

export function HomeScreen() {
  const router = useRouter();
  const { createRoom } = useGame();
  const [showRules, setShowRules] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(false);

  async function handlePlay() {
    setCreating(true);
    setError(false);
    try {
      const roomID = await createRoom();
      router.push(`/${roomID}`);
    } catch {
      setError(true);
      setCreating(false);
    }
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      {showRules && <GameRules onClose={() => setShowRules(false)} />}
      <div className="flex h-2/5 w-120 max-w-full flex-col items-center justify-around rounded-3xl">
        <Logo />
        <div className="flex flex-col gap-[15px]">
          <button type="button" className={`${button} bg-player2`} onClick={handlePlay} disabled={creating}>
            PLAY VS PLAYER
          </button>
          <button type="button" className={`${button} bg-white`} onClick={() => setShowRules(true)}>
            GAME RULES
          </button>
        </div>
        {error && <p className="text-center font-semibold text-white">Could not reach the game server. Try again.</p>}
      </div>
    </main>
  );
}
