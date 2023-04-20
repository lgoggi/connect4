import { gridProps, gridArrayProps } from "./types/game-types";

export const isGameOver = (square: gridProps, grid: gridProps[][]) => {
  //going to check neighbour squares recursively to see if the game is won
  let result: string | undefined;
  //horizontal check
  let counter = 1;
  let backward = 1;
  let forward = 1;
  while (counter < 4) {
    let prevSquare = (square.column - backward >= 0) ? grid![square.column - backward][square.row] : { occupied: false, player: '' };
    let nextSquare = (square.column + forward <= 6) ? grid![square.column + forward][square.row] : { occupied: false, player: '' };

    if (!(prevSquare!.occupied || nextSquare.occupied)) {
      break;
    }
    if (prevSquare!.occupied) {
      if (prevSquare!.player === square.player) {
        backward++;
        counter++;
      } else {
        break;
      }
    }
    if (nextSquare.occupied) {
      if (nextSquare.player === square.player) {
        forward++;
        counter++;
      } else {
        break;
      }
    }
    if (counter >= 4) {
      result = square.player;
    }
  }

  //vertical check
  counter = 1;
  backward = 1;
  while (counter < 4) {
    let prevSquare = (square.row + backward <= 5) ? grid![square.column][square.row + backward] : { occupied: false, player: '' };

    if (prevSquare.player === square.player) {
      backward++;
      counter++;
    } else {
      break;
    }
    if (counter >= 4) {
       result = square.player;
    }
  }

  //left-bottom to right-top diagonal check
  counter = 1;
  backward = 1;
  forward = 1;
  while (counter < 4) {
    let prevSquare = (square.column - backward >= 0 && square.row + backward <= 5) ? grid![square.column - backward][square.row + backward] : { occupied: false, player: '' };
    let nextSquare = (square.column + forward <= 6 && square.row - forward >= 0) ? grid![square.column + forward][square.row - forward] : { occupied: false, player: '' };
    if (!(prevSquare!.occupied || nextSquare.occupied)) {
      break;
    }
    if (prevSquare!.occupied) {
      if (prevSquare!.player === square.player) {
        backward++;
        counter++;
      } else {
        break;
      }
    }
    if (nextSquare.occupied) {
      if (nextSquare.player === square.player) {
        forward++;
        counter++;
      } else {
        break;
      }
    }
    if (counter >= 4) {
       result = square.player;
    }
  }

  //top-left to right-bottom diagonal check
  counter = 1;
  backward = 1;
  forward = 1;
  while (counter < 4) {
    let prevSquare = (square.column - backward >= 0 && square.row - backward >= 0) ? grid![square.column - backward][square.row - backward] : { occupied: false, player: '' };
    let nextSquare = (square.column + forward <= 6 && square.row + forward <= 5) ? grid![square.column + forward][square.row + forward] : { occupied: false, player: '' };

    if (!(prevSquare!.occupied || nextSquare.occupied)) {
      break;
    }
    if (prevSquare!.occupied) {
      if (prevSquare!.player === square.player) {
        backward++;
        counter++;
      } else {
        break;
      }
    }
    if (nextSquare.occupied) {
      if (nextSquare.player === square.player) {
        forward++;
        counter++;
      } else {
        break;
      }
    }
    if (counter >= 4) {
       result = square.player;
    }
  }
  return result;
}
export function deepCopyArray<T>(arr: T[]): T[] {
  const copy: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      copy[i] = deepCopyArray(arr[i] as any) as any;
    } else if (typeof arr[i] === 'object' && arr[i] !== null) {
      copy[i] = deepCopyObject(arr[i] as any) as any;
    } else {
      copy[i] = arr[i];
    }
  }
  return copy;
}
export function deepCopyObject<T extends Record<string, any>>(obj: T): T {
  const copy = {} as T;
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      copy[key] = deepCopyArray(obj[key] as any) as any;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      copy[key] = deepCopyObject(obj[key] as any) as any;
    } else {
      copy[key] = obj[key];
    }
  }
  return copy;
}

export const defaultGrid: gridProps[][] = (Array.from({length: 7},  (v, k) => k).map((column) => {
  return (
    Array.from({length: 6},  (v, k) => k).map((row) => {
      return ({ column, row, occupied: false, player: 'empty' })
    })
    )
  }))

export const gridArray: gridArrayProps = {};
