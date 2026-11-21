import { Modal } from "@/components/ui/Modal";

export function GameRules({ onClose }: { onClose: () => void }) {
  return (
    <Modal labelledBy="rules-title" onClose={onClose}>
      <div className="box-content flex min-h-fit w-120 max-w-[80%] flex-col items-center justify-center rounded-xl border-2 border-black bg-white pt-[15px]">
        <h2 id="rules-title" className="text-[2rem] font-black">
          GAME RULES
        </h2>
        <div className="w-4/5 text-center text-[1.5rem] font-extralight max-[701px]:text-[1.1rem] [&>p]:my-[1em]">
          <p>1. Connect 4 is a two-player game played on a board with seven columns and six rows.</p>
          <p>2. The goal is to connect four of your pieces vertically, horizontally, or diagonally.</p>
          <p>3. Players take turns dropping pieces into the columns.</p>
          <p>4. The first player to connect four pieces wins.</p>
        </div>
      </div>
    </Modal>
  );
}
