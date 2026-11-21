"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Modal } from "@/components/ui/Modal";

const STATUS_VISIBLE_MS = 7000;

const noSubscription = () => () => {};

/** window.location.origin in the browser, "" while rendering on the server. */
function useOrigin() {
  return useSyncExternalStore(
    noSubscription,
    () => window.location.origin,
    () => "",
  );
}

export function InviteModal({ roomID }: { roomID: string }) {
  const link = `${useOrigin()}/${roomID}`;
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = setTimeout(() => setStatus("idle"), STATUS_VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [status]);

  async function copyLink() {
    try {
      // Only available on https or localhost.
      await navigator.clipboard.writeText(link);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <Modal labelledBy="invite-title">
      <div className="box-content flex h-64 w-120 max-w-[90vw] flex-col items-center justify-center gap-5 rounded-xl border border-black bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        <h2 id="invite-title" className="text-[2rem] font-extrabold text-player1">
          CONNECT 4 INVITE
        </h2>
        <p className="text-[1.5rem] font-normal text-black">invite a friend!</p>
        <div className="flex h-12 w-3/4 flex-row items-center gap-[15px]">
          <div className="box-content flex h-3/4 w-1/2 items-center overflow-auto rounded-sm border-2 border-[#ccc] bg-[#eee] px-[5px] text-[1rem] font-normal whitespace-nowrap text-[#333] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {link}
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="h-full w-1/2 cursor-pointer rounded-sm bg-player2 text-[1.2rem] font-semibold text-[#333] hover:bg-player1 hover:text-white"
          >
            COPY LINK
          </button>
        </div>
        {status !== "idle" && (
          <p key={status} role="status" className="animate-fade text-[1.2rem] text-[#f00]">
            {status === "copied" ? "link copied to clipboard!" : "couldn't copy, select the link instead"}
          </p>
        )}
      </div>
    </Modal>
  );
}
