import "dotenv/config";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "./types/server-types";
import type { PlayerId, Room } from "./types/game-types";
import { createGrid, isBoardFull, isValidColumn, isWinningMove, landingRow } from "./gameFunctions";

const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const TURN_MS = 30_000;
const ROOM_ID = /^[A-Za-z0-9_-]{7}$/; // nanoid(7)

const app = express();
app.use(cors({ origin: CLIENT_URL }));
const http = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(http, {
  cors: { origin: [CLIENT_URL], methods: ["GET", "POST"] },
});

const rooms = new Map<string, Room>();

const seatName = (seat: number): PlayerId => (seat === 0 ? "player1" : "player2");
const otherPlayer = (player: PlayerId): PlayerId => (player === "player1" ? "player2" : "player1");
const isFull = (room: Room) => !room.players.includes("");

function newRoom(): Room {
  return { players: ["", ""], grid: createGrid(), turn: "player1", finished: false, restartRequestedBy: null, turnTimer: null };
}

function resetBoard(room: Room) {
  room.grid = createGrid();
  room.finished = false;
  room.restartRequestedBy = null;
}

function broadcastBoard(roomID: string, room: Room, result?: string) {
  io.to(roomID).emit("updateBoard", room.grid, room.turn, result);
}

function stopTurnClock(room: Room) {
  if (room.turnTimer) clearTimeout(room.turnTimer);
  room.turnTimer = null;
}

/** (Re)starts the clock of whoever's turn it is; only runs while both seats are taken and the game is on. */
function startTurnClock(roomID: string, room: Room) {
  stopTurnClock(room);
  if (room.finished || !isFull(room)) return;
  room.turnTimer = setTimeout(() => {
    room.turn = otherPlayer(room.turn);
    broadcastBoard(roomID, room);
    startTurnClock(roomID, room);
  }, TURN_MS);
}

io.on("connection", (socket) => {
  // The room this socket entered; a socket plays in one room at a time.
  let currentRoomID: string | null = null;

  /** This socket's room and seat, or null if it isn't seated anywhere. */
  function seat() {
    const roomID = currentRoomID;
    const room = roomID ? rooms.get(roomID) : undefined;
    if (!roomID || !room) return null;
    const index = room.players.indexOf(socket.id);
    return index === -1 ? null : { roomID, room, player: seatName(index) };
  }

  function leaveRoom() {
    const roomID = currentRoomID;
    if (!roomID) return;
    currentRoomID = null;
    socket.leave(roomID);

    const room = rooms.get(roomID);
    const index = room ? room.players.indexOf(socket.id) : -1;
    if (!room || index === -1) return;

    room.players[index] = "";
    stopTurnClock(room);
    if (room.players.every((id) => id === "")) {
      rooms.delete(roomID);
      return;
    }
    // Free the seat for someone new, who starts a fresh game.
    resetBoard(room);
    room.turn = "player1";
    broadcastBoard(roomID, room, "restart");
    io.to(roomID).emit("playerLeft", seatName(index));
  }

  socket.on("create", () => {
    socket.emit("createRoom", { room: nanoid(7) });
  });

  socket.on("enter", (roomID) => {
    if (typeof roomID !== "string" || !ROOM_ID.test(roomID)) return;
    if (currentRoomID === roomID) return;
    leaveRoom();

    currentRoomID = roomID;
    socket.join(roomID);
    let room = rooms.get(roomID);
    if (!room) {
      room = newRoom();
      rooms.set(roomID, room);
    }

    const free = room.players.indexOf("");
    if (free === -1) {
      // Room is full: watch as a spectator.
      socket.emit("enter", socket.id, "");
      socket.emit("updateBoard", room.grid, room.turn, undefined);
      return;
    }
    room.players[free] = socket.id;
    socket.emit("enter", socket.id, seatName(free));
    startTurnClock(roomID, room);
  });

  socket.on("isConnected", () => {
    const room = currentRoomID ? rooms.get(currentRoomID) : undefined;
    if (currentRoomID && room) io.to(currentRoomID).emit("isConnected", isFull(room));
  });

  socket.on("playerMove", (column) => {
    const me = seat();
    if (!me) return;
    const { roomID, room, player } = me;
    if (room.finished || !isFull(room) || room.turn !== player || !isValidColumn(column)) return;

    const row = landingRow(room.grid, column);
    if (row === -1) return; // full column: not a move, the turn stays

    room.grid[column][row] = { column, row, occupied: true, player };
    let result: string | undefined;
    if (isWinningMove(room.grid, column, row)) result = player;
    else if (isBoardFull(room.grid)) result = "draw";

    // After a win the loser starts the next game.
    room.turn = otherPlayer(player);
    if (result) {
      room.finished = true;
      stopTurnClock(room);
    } else {
      startTurnClock(roomID, room);
    }
    broadcastBoard(roomID, room, result);
  });

  socket.on("restartGame", () => {
    const me = seat();
    if (!me || !isFull(me.room)) return;
    me.room.restartRequestedBy = socket.id;
    const opponent = me.room.players.find((id) => id !== socket.id)!;
    io.to(opponent).emit("restartRequest");
  });

  socket.on("restartAns", (accepted) => {
    const me = seat();
    if (!me) return;
    const { roomID, room } = me;
    // Only the player who was asked can answer.
    if (!room.restartRequestedBy || room.restartRequestedBy === socket.id) return;
    room.restartRequestedBy = null;
    if (accepted !== true) return;
    resetBoard(room);
    startTurnClock(roomID, room);
    broadcastBoard(roomID, room, "restart");
  });

  socket.on("disconnect", leaveRoom);
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
