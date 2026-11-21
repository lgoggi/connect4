"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getSocket } from "@/lib/socket";
import {
  createEmptyGrid,
  isPlayerId,
  type GameResult,
  type Grid,
  type PlayerId,
  type Players,
} from "@/types/game";

const INITIAL_RESULT: GameResult = { winner: "", isFinished: false, display: false };
const CREATE_ROOM_TIMEOUT_MS = 10_000;

interface GameContextValue {
  players: Players;
  grid: Grid;
  turn: PlayerId;
  /** Increments on every board update from the server; the turn clock restarts on it. */
  boardVersion: number;
  /** True while both seats in the room are taken. */
  isConnected: boolean;
  result: GameResult;
  restartRequested: boolean;
  createRoom: () => Promise<string>;
  enterRoom: (roomID: string) => void;
  playMove: (column: number) => void;
  requestRestart: () => void;
  answerRestart: (accepted: boolean) => void;
  dismissResult: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used inside <GameProvider>");
  return value;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Players>({
    player1: { name: "player1", wins: 0 },
    player2: { name: "player2", wins: 0 },
  });
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [turn, setTurn] = useState<PlayerId>("player1");
  const [boardVersion, setBoardVersion] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [result, setResult] = useState<GameResult>(INITIAL_RESULT);
  const [restartRequested, setRestartRequested] = useState(false);
  const enteredRoom = useRef<string | null>(null);

  // Room-wide events: registered once, for as long as the app is open.
  useEffect(() => {
    const socket = getSocket();

    const onIsConnected = (connected: boolean) => {
      setIsConnected(connected);
      if (!connected) return;
      // A new opponent took the seat someone left: start a new match.
      setPlayers((prev) => {
        const left = (["player1", "player2"] as const).find((p) => prev[p].wins === undefined);
        if (!left) return prev;
        const stayed: PlayerId = left === "player1" ? "player2" : "player1";
        return {
          ...prev,
          [left]: { name: left, wins: 0, display: "opponent" },
          [stayed]: { ...prev[stayed], wins: 0 },
        };
      });
    };

    const onUpdateBoard = (newGrid: Grid, newTurn: string, outcome: string | null | undefined) => {
      setGrid(newGrid);
      if (isPlayerId(newTurn)) setTurn(newTurn);
      setBoardVersion((v) => v + 1);

      if (outcome === "restart") {
        setResult(INITIAL_RESULT);
        setRestartRequested(false);
      } else if (outcome === "draw") {
        setResult({ winner: "", isFinished: true, display: true });
      } else if (isPlayerId(outcome)) {
        setResult({ winner: outcome, isFinished: true, display: true });
        setPlayers((prev) => ({
          ...prev,
          [outcome]: { ...prev[outcome], wins: (prev[outcome].wins ?? 0) + 1 },
        }));
      }
    };

    const onRestartRequest = () => {
      setRestartRequested(true);
      setResult((prev) => ({ ...prev, display: false }));
    };

    const onPlayerLeft = (player: string) => {
      if (!isPlayerId(player)) return;
      // The server freed the seat and reset the board; show the invite again.
      setIsConnected(false);
      setPlayers((prev) => ({
        ...prev,
        [player]: { ...prev[player], display: `${player} has left the game :(`, wins: undefined },
      }));
    };

    socket.on("isConnected", onIsConnected);
    socket.on("updateBoard", onUpdateBoard);
    socket.on("restartRequest", onRestartRequest);
    socket.on("playerLeft", onPlayerLeft);
    return () => {
      socket.off("isConnected", onIsConnected);
      socket.off("updateBoard", onUpdateBoard);
      socket.off("restartRequest", onRestartRequest);
      socket.off("playerLeft", onPlayerLeft);
    };
  }, []);

  const createRoom = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        const socket = getSocket();
        const onCreated = ({ room }: { room: string }) => {
          clearTimeout(timeout);
          resolve(room);
        };
        const timeout = setTimeout(() => {
          socket.off("createRoom", onCreated);
          reject(new Error("The server did not answer in time."));
        }, CREATE_ROOM_TIMEOUT_MS);
        socket.once("createRoom", onCreated);
        socket.emit("create");
      }),
    [],
  );

  const enterRoom = useCallback((roomID: string) => {
    // Strict Mode re-runs effects in dev; entering once per room is enough.
    if (enteredRoom.current === roomID) return;
    enteredRoom.current = roomID;

    const socket = getSocket();
    socket.once("enter", (_userID, username) => {
      if (isPlayerId(username)) {
        const opponent: PlayerId = username === "player1" ? "player2" : "player1";
        setPlayers((prev) => ({
          ...prev,
          [username]: { ...prev[username], display: "you" },
          [opponent]: { ...prev[opponent], display: "opponent" },
        }));
      }
      // Ask the server to tell the whole room whether both seats are now taken.
      socket.emit("isConnected");
    });
    socket.emit("enter", roomID);
  }, []);

  const playMove = useCallback((column: number) => getSocket().emit("playerMove", column), []);

  const requestRestart = useCallback(() => getSocket().emit("restartGame"), []);

  const answerRestart = useCallback((accepted: boolean) => {
    setRestartRequested(false);
    getSocket().emit("restartAns", accepted);
  }, []);

  const dismissResult = useCallback(() => setResult((prev) => ({ ...prev, display: false })), []);

  return (
    <GameContext.Provider
      value={{
        players,
        grid,
        turn,
        boardVersion,
        isConnected,
        result,
        restartRequested,
        createRoom,
        enterRoom,
        playMove,
        requestRestart,
        answerRestart,
        dismissResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
