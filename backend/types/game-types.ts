export type PlayerId = "player1" | "player2";

export interface Cell {
  column: number;
  row: number;
  occupied: boolean;
  player: PlayerId | "empty";
}

/** Indexed as grid[column][row]; row 0 is the top of the board. */
export type Grid = Cell[][];

export interface Room {
  /** Socket ids of player1 and player2; "" marks a free seat. */
  players: [string, string];
  grid: Grid;
  turn: PlayerId;
  /** Someone won or the board filled up; no moves until a restart. */
  finished: boolean;
  /** Socket id of the player waiting for an answer to their restart request. */
  restartRequestedBy: string | null;
  /** Passes the turn when the player on the clock runs out of time. */
  turnTimer: NodeJS.Timeout | null;
}
