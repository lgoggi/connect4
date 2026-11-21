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

interface Session {
  roomID: string;
  userID: string;
}

interface GameContextValue {
  session: Session;
  players: Players;
  grid: Grid;
  turn: PlayerId;
  /** Increments on every board update from the server; the turn timer restarts on it. */
  boardVersion: number;
  /** True once both seats in the room are taken. */
  isConnected: boolean;
  result: GameResult;
  restartRequested: boolean;
  createRoom: () => Promise<string>;
  enterRoom: (roomID: string) => void;
  playMove: (column: number) => void;
  passTurn: () => void;
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
  const [session, setSession] = useState<Session>({ roomID: "", userID: "" });
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

    const onIsConnected = (connected: boolean) => setIsConnected(connected);

    const onUpdateBoard = (newGrid: Grid, newTurn: string, outcome: string | null | undefined) => {
      setGrid(newGrid);
      if (isPlayerId(newTurn)) setTurn(newTurn);
      setBoardVersion((v) => v + 1);

      if (outcome === "restart") {
        setResult(INITIAL_RESULT);
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
    // The server gives a seat to every "enter" it receives, so sending it twice
    // (Strict Mode re-runs effects in dev) would seat this tab as both players.
    if (enteredRoom.current === roomID) return;
    enteredRoom.current = roomID;

    const socket = getSocket();
    socket.once("enter", (userID, username) => {
      if (isPlayerId(username)) {
        const opponent: PlayerId = username === "player1" ? "player2" : "player1";
        setPlayers((prev) => ({
          ...prev,
          [username]: { ...prev[username], display: "you" },
          [opponent]: { ...prev[opponent], display: "opponent" },
        }));
      }
      setSession({ roomID, userID });
      // Ask the server to tell the whole room whether both seats are now taken.
      socket.emit("isConnected");
    });
    socket.emit("enter", roomID);
  }, []);

  const { roomID, userID } = session;

  const playMove = useCallback((column: number) => getSocket().emit("playerMove", userID, column), [userID]);

  // The server only accepts this from the player whose turn it is, and answers
  // with an updateBoard. Until then the turn stays as the server last said.
  const passTurn = useCallback(() => getSocket().emit("timer", roomID, userID), [roomID, userID]);

  const requestRestart = useCallback(() => getSocket().emit("restartGame", userID), [userID]);

  const answerRestart = useCallback((accepted: boolean) => {
    setRestartRequested(false);
    getSocket().emit("restartAns", accepted);
  }, []);

  const dismissResult = useCallback(() => setResult((prev) => ({ ...prev, display: false })), []);

  return (
    <GameContext.Provider
      value={{
        session,
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
        passTurn,
        requestRestart,
        answerRestart,
        dismissResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
