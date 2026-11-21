import type { Grid } from "./game";

// Mirrors backend/types/server-types.ts. Keep both files in sync when the protocol changes.

export interface ServerToClientEvents {
  createRoom: (data: { room: string }) => void;
  enter: (userID: string, username: string) => void;
  isConnected: (connected: boolean) => void;
  /** result: the winner's PlayerId, "restart", or empty when the game goes on. */
  updateBoard: (grid: Grid, turn: string, result: string | null | undefined) => void;
  restartRequest: () => void;
  playerLeft: (player: string) => void;
}

export interface ClientToServerEvents {
  create: () => void;
  enter: (roomID: string) => void;
  isConnected: () => void;
  timer: (roomID: string, userID: string) => void;
  playerMove: (userID: string, column: number) => void;
  restartGame: (userID: string) => void;
  restartAns: (accepted: boolean) => void;
}
