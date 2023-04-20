export interface gridProps {
  column: number;
  row: number;
  occupied: boolean;
  player: string;
}
export interface hasWonProps {
  winner?: string;
  isFinished: boolean;
  display: boolean;
}
export interface sessionProps {
  roomID: string;
  userID: string;
}
export interface playerProps {
  name?: string,
  wins?: number,
  display?: string;
}
export interface playersProps {
  [key: string]: playerProps
}
