"use client";

import { useGame } from "@/providers/GameProvider";
import { Modal } from "@/components/ui/Modal";

const option = "h-12 w-2/5 cursor-pointer border-2 border-black bg-white text-[2rem] font-normal hover:bg-[#e8e8e8]";

export function RestartModal() {
  const { answerRestart } = useGame();

  return (
    <Modal labelledBy="restart-title">
      <div className="box-content flex h-96 w-128 max-w-[90vw] flex-col items-center justify-center gap-5 rounded-xl border-2 border-black bg-white shadow-[0_0_10px_white]">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h2 id="restart-title" className="text-[2rem] font-black">
            Restart request
          </h2>
          <p className="w-3/5 text-center text-[2rem] font-extralight">do you wish to restart the game?</p>
        </div>
        <div className="flex h-24 w-4/5 flex-row items-center justify-around">
          <button type="button" className={option} onClick={() => answerRestart(true)}>
            YES
          </button>
          <button type="button" className={option} onClick={() => answerRestart(false)}>
            NO
          </button>
        </div>
      </div>
    </Modal>
  );
}
