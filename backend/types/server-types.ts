import { gridProps } from "./game-types";

export interface ServerToClientEvents {
  createRoom: (a: object) => void;
  enter: (a: string, b: string) => void;
  isConnected: (a: boolean) => void;
  timer: (a: string) => void;
  updateBoard: (a: gridProps[][], b: string ,c: string | undefined)=> void;
  restartRequest: () => void;
  playerLeft: (a: string) => void;
}

export interface ClientToServerEvents {
  create: () => void;
  enter: (a: string) => void;
  isConnected: () => void;
  timer: (a: string, b: string) => void;
  playerMove: (b: string, c: number) => void;
  restartGame: (a: string) => void;
  restartAns: (a: boolean) => void;
}

export interface InterServerEvents {
  ping: () => void;
}


