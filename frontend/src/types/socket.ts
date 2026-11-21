import type { Grid } from "./game";

// Mirrors backend/types/server-types.ts. Keep both files in sync when the protocol changes.

export interface ServerToClientEvents {
  createRoom: (data: { room: string }) => void;
  /** username is the seat ("player1"/"player2"), or "" for a spectator. */
  enter: (userID: string, username: string) => void;
  /** Whether both seats are taken. */
  isConnected: (connected: boolean) => void;
  /** result: the winner, "draw", "restart" (fresh board), or empty while the game goes on. */
  updateBoard: (grid: Grid, turn: string, result: string | null | undefined) => void;
  restartRequest: () => void;
  playerLeft: (player: string) => void;
}

// The server identifies players by their socket, so no event carries a user id.
// It also runs the turn clock: when time is up it passes the turn and sends updateBoard.
export interface ClientToServerEvents {
  create: () => void;
  enter: (roomID: string) => void;
  isConnected: () => void;
  playerMove: (column: number) => void;
  restartGame: () => void;
  restartAns: (accepted: boolean) => void;
}
