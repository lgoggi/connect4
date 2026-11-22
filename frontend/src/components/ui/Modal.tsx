import type { CSSProperties, ReactNode } from "react";
import { CloseIcon } from "./icons";

interface ModalProps {
  /** id of the element that names the dialog. */
  labelledBy: string;
  /** Shows a close button in the corner when given. */
  onClose?: () => void;
  /** Seconds to wait before fading in, e.g. to let the board finish animating. */
  delay?: number;
  children: ReactNode;
}

export function Modal({ labelledBy, onClose, delay = 0, children }: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      // The backdrop fades in and each child pops in just after it.
      className="fixed top-0 left-0 z-10 flex h-screen w-screen animate-backdrop-in flex-col items-center justify-center bg-[rgba(50,50,50,0.85)] *:animate-pop-in motion-reduce:animate-none motion-reduce:*:animate-none"
      style={{ "--modal-delay": `${delay}s` } as CSSProperties}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-8 right-8 cursor-pointer px-1.5 py-px text-white"
        >
          <CloseIcon className="scale-150" />
        </button>
      )}
      {children}
    </div>
  );
}
