import express from "express";
import { Server } from "socket.io";
import cors, {CorsOptions} from "cors";
import { nanoid } from "nanoid";
import {ClientToServerEvents, ServerToClientEvents, InterServerEvents } from "./types/server-types";
import { gridArray, defaultGrid, deepCopyArray, isGameOver } from "./gameFunctions";

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL;
const corsOptions: CorsOptions = {
  origin: CLIENT_URL,
}

app.use(cors(corsOptions))
const http = require('http').createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
  >(http, {
    cors: {
      origin: [CLIENT_URL!],
      methods: ["GET", "POST"]
    }
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});


io.on('connection', (socket) =>{
  console.log('new connection');
  let roomID: string= '';

  socket.on("create", () => {
    roomID = nanoid(7);
    socket.join(roomID);
    socket.emit("createRoom", {room: roomID});
  });
  
  socket.on("enter", (room)=>{
    roomID = room;
    const userID: string = socket.id;
    let username = "";
    socket.join(roomID);
    if(!(gridArray[roomID])) {
      gridArray[roomID]= {
        players: [userID, '']
      }
      username="player1";
    } else if (gridArray[roomID].players![1]===''){
      gridArray[roomID].players![1]=userID;
      username="player2";
    }
    io.sockets.in(socket.id).emit("enter", userID, username);
  })

  socket.on("isConnected", ()=>{
    let isConnected=false;
    if(!gridArray[roomID]){
      return;
    }
    if(!gridArray[roomID].players?.includes('')) {
      isConnected=true;
    }
    io.sockets.in(roomID).emit("isConnected", isConnected);
  })

  socket.on("timer", (roomID, userID) => {
    if(!gridArray[roomID]){
      return;
    }
    let player: string;
    let checkUser = gridArray[roomID].players!.findIndex( (item) => item === userID);
    if (checkUser===-1) {
      return;
    }
    if (checkUser===0){
      player='player1';
    } else {
      player='player2';
    }
    if(!(player===gridArray[roomID].turn)){
      return;
    }
    gridArray[roomID]={
      ...gridArray[roomID],
      turn: (player==='player1'? 'player2':'player1'),
    };
    io.sockets.in(roomID).emit("updateBoard", gridArray[roomID].grid!, gridArray[roomID].turn!, undefined);
  })

  socket.on("playerMove", (userID, column) => {
    //assign roles to connections
    let player: string;
    let checkUser = gridArray[roomID].players!.findIndex((item) => item === userID);
    if (checkUser === -1) {
      return;
    }
    if (checkUser === 0) {
      player = 'player1';
    } else {
      player = 'player2';
    }
    if (!(gridArray[roomID])) {
      return;
    }
    //assigns initial grid
    if (!(gridArray[roomID].grid)) {
      gridArray[roomID] = {
        ...gridArray[roomID],
        grid: defaultGrid,
        turn: 'player1'
      }
    }

    //makes sure the same player doesnt play twice in a row
    if (player !== gridArray[roomID].turn) {
      return;
    }

    let grid = deepCopyArray(gridArray[roomID].grid!);
    let checkColumn = grid[column].find((item) => item.occupied === true);
    let targetRow;

    if (checkColumn && checkColumn.row > 0) {
      targetRow = checkColumn.row - 1;
    } else {
      targetRow = 5;
    }
    if (!(grid[column][targetRow].occupied)) {
      grid[column][targetRow] = { ...grid[column][targetRow], occupied: true, player: player };
    }
    let result = isGameOver(grid[column][targetRow], grid);

    gridArray[roomID] = {
      ...gridArray[roomID],
      grid: grid,
      turn: (player === 'player1' ? 'player2' : 'player1'),
    };
    io.sockets.in(roomID).emit("updateBoard", gridArray[roomID].grid!, gridArray[roomID].turn!, result);
  })

  socket.on("restartGame", (userID) => {
    let checkUser = gridArray[roomID].players!.findIndex((item) => item === userID);
    if (checkUser === -1) {
      return;
    }
    socket.to(roomID).emit("restartRequest");
  })

  socket.on("restartAns", (answer) => {
    if (!gridArray[roomID]) {
      return;
    }
    if (answer) {
      gridArray[roomID] = {
        ...gridArray[roomID],
        grid: defaultGrid
      }
      io.sockets.in(roomID).emit("updateBoard", gridArray[roomID].grid!, gridArray[roomID].turn!, 'restart');
    }
  })

  socket.on("disconnecting", () => {
    console.log('disconnected')
    let roomArray = Array.from(socket.rooms);
    roomArray.map((item) => {
      if (gridArray[item]) {
        let player;
        let checkUser = gridArray[roomID].players!.findIndex((item) => item === socket.id);
        if (checkUser === -1) {
          return;
        }
        if (checkUser === 0) {
          player = 'player1';
        } else {
          player = 'player2';
        }
        if (io.sockets.adapter.rooms.get(item)!.size >= 2) {
          socket.to(item).emit("playerLeft", player)
        }
        if (io.sockets.adapter.rooms.get(item)!.size <= 1) {
          delete gridArray[item];
        }
      }
    })
  });

})

