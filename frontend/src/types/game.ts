export type PlayerId = "player1" | "player2";

export interface Cell {
  column: number;
  row: number;
  occupied: boolean;
  /** "empty" until a disc lands here, then the owner's PlayerId. */
  player: string;
}

/** Indexed as grid[column][row]; row 0 is the top of the board. */
export type Grid = Cell[][];

export interface GameResult {
  winner: PlayerId | "";
  isFinished: boolean;
  /** Whether the "X has won" modal is showing. */
  display: boolean;
}

export interface PlayerInfo {
  name: PlayerId;
  /** undefined once the player has left the game. */
  wins?: number;
  /** "you", "opponent", or a "left the game" notice. */
  display?: string;
}

export type Players = Record<PlayerId, PlayerInfo>;

export const COLUMNS = 7;
export const ROWS = 6;
export const TURN_SECONDS = 30;

export function isPlayerId(value: unknown): value is PlayerId {
  return value === "player1" || value === "player2";
}

export function createEmptyGrid(): Grid {
  return Array.from({ length: COLUMNS }, (_, column) =>
    Array.from({ length: ROWS }, (_, row) => ({
      column,
      row,
      occupied: false,
      player: "empty",
    })),
  );
}
