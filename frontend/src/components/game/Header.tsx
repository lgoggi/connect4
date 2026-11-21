"use client";

import { useGame } from "@/providers/GameProvider";

const button =
  "h-10 w-fit cursor-pointer rounded-3xl bg-darker-purple px-[15px] text-[1rem] font-semibold text-white hover:h-12 hover:text-[1.2rem]";

export function Header() {
  const { requestRestart } = useGame();

  // A full page load on purpose: it drops this tab's socket, so the server
  // tells the opponent we left and cleans the room up.
  const goToMenu = () => window.location.replace("/");

  return (
    <header className="col-start-2 row-start-1 flex h-full items-center justify-between justify-self-stretch max-tablet:h-20">
      <button type="button" className={button} onClick={goToMenu}>
        MENU
      </button>
      <button type="button" className={button} onClick={requestRestart}>
        RESTART
      </button>
    </header>
  );
}
