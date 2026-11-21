"use client";

import { useGame } from "@/providers/GameProvider";
import { Modal } from "@/components/ui/Modal";

export function ResultModal() {
  const { result, dismissResult, requestRestart } = useGame();

  return (
    <Modal labelledBy="result-title" onClose={dismissResult}>
      <div
        id="result-title"
        className="mb-20 box-content flex h-fit w-[60vw] items-center justify-center rounded-3xl border-2 border-black bg-white p-[15px] text-center text-[4rem] shadow-[0_0_10px_white] max-tablet:text-[2rem]"
      >
        {`${result.winner} has won the game!`}
      </div>
      <button
        type="button"
        onClick={requestRestart}
        className="h-fit w-fit cursor-pointer rounded-xl border-2 border-black bg-white p-[7px] text-[2rem] shadow-[0_0_10px_white] max-tablet:text-[1.5rem]"
      >
        Restart
      </button>
    </Modal>
  );
}
