export interface gridProps {
  column: number;
  row: number;
  occupied: boolean;
  player: string;
}

export interface roomDataProps {
  grid?: gridProps[][];
  players?: string[];
  turn?: string;
}
export interface gridArrayProps {
  [key: string]: roomDataProps;
}
