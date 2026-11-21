import type { Grid, PlayerId } from "./game-types";

// frontend/src/types/socket.ts mirrors this file. Keep both in sync.

export interface ServerToClientEvents {
  createRoom: (data: { room: string }) => void;
  /** username is the seat ("player1"/"player2"), or "" for a spectator. */
  enter: (userID: string, username: PlayerId | "") => void;
  /** Whether both seats are taken. */
  isConnected: (connected: boolean) => void;
  /** result: the winner, "draw", "restart" (fresh board), or undefined while the game goes on. */
  updateBoard: (grid: Grid, turn: PlayerId, result: string | undefined) => void;
  restartRequest: () => void;
  playerLeft: (player: PlayerId) => void;
}

// The server identifies players by their socket, so no event carries a user id.
export interface ClientToServerEvents {
  create: () => void;
  enter: (roomID: string) => void;
  isConnected: () => void;
  playerMove: (column: number) => void;
  restartGame: () => void;
  restartAns: (accepted: boolean) => void;
}
