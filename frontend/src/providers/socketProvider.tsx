import { createContext, ReactNode, useState } from "react";
import { io, Socket } from "socket.io-client";
import { gridProps, hasWonProps, playersProps, sessionProps } from "../types/types";

type SocketProviderTypes = {
  children: ReactNode;
}
type SocketContextTypes = {
  socket: Socket;
  session: sessionProps;
  players: playersProps;
  hasWon: hasWonProps;
  setHasWon: React.Dispatch<React.SetStateAction<hasWonProps>>;
  initialGrid: gridProps[][];
  isConnected: boolean;
  turn: string;
  grid: gridProps[][];
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  createRoom: () => void;
  enterRoom: (a: string) => void;
  checkConnected: () => void;
  updateBoard: () => void;
  sendPlay: (a: number) => void;
  changeTurn: () => void;
  restartGame: () => void;
  restartGameReq: () => void;
  restartGameAns: (a: boolean) => void;
  playerLeftListener: () => void;
}

export const SocketContext = createContext<SocketContextTypes>({} as SocketContextTypes);
const socket = io(import.meta.env.VITE_SERVER_URL);

export const SocketProvider = ({ children }: SocketProviderTypes) => {
  const initialGrid: gridProps[][] = Array.from({ length: 7 }, (v, k) => k).map((column) => {
    return (
      Array.from({ length: 6 }, (v, k) => k).map((row) => {
        return ({ column, row, occupied: false, player: 'empty' })
      })
    )
  })
  const [session, setSession] = useState<sessionProps>({
    roomID: '',
    userID: '',
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [players, setPlayers] = useState<playersProps>({
    player1: { name: 'player1', wins: 0},
    player2: { name: 'player2', wins: 0}
  });
  const [turn, setTurn] = useState('player1');
  const [hasWon, setHasWon] = useState<hasWonProps>(
    { winner: '', isFinished: false, display: false }
  );
  const [grid, setGrid] = useState<gridProps[][]>(initialGrid);
  const [restart, setRestart] = useState(false);

  const createRoom = () => {
    socket.emit("create");
    socket.once("createRoom", (data) => {
      setSession(
        {
          ...session,
          roomID: data.room
        }
      );
    })
  }

  const enterRoom = (roomID: string) => {
    socket.emit("enter", roomID);
    socket.once("enter", (user, username) => {
      if(username==='player1') {
        setPlayers({
          player1: {
            ...players.player1,
            display: 'you'
          },
          player2: {
            ...players.player2,
            display: 'opponent'
          }
        });
      }
      if (username==='player2') {
        setPlayers({
          player2: {
            ...players.player2,
            display: 'you'
          },
          player1: {
            ...players.player1,
            display: 'opponent'
          }
        });
      }
      setSession(
        {
          roomID: roomID,
          userID: user
        }
      );
    })
  }
  const checkConnected = () => {
    socket.emit("isConnected");
    socket.on("isConnected", (data) => {
      setIsConnected(data);
    })
  }

  const changeTurn = () => {
    socket.emit("timer", session.roomID, session.userID)
    setTurn(turn === "player1" ? "player2" : "player1")
  }

  const updateBoard = () => {
    socket.on("updateBoard", (newGrid, newTurn, result) => {
      setGrid(newGrid);
      setTurn(newTurn);
      if (result) {
        if(result==='restart'){
          setHasWon({
            ...hasWon,
            winner: '',
            display: false
          });
        } else {
          setHasWon({
            winner: result,
            isFinished: true,
            display: true
          });
          setPlayers(prevPlayers =>({
            ...prevPlayers,
            [result]: {
              ...prevPlayers[result], 
              wins: prevPlayers[result].wins! + 1
            }
          }))
      }
    }
    })
  }

  const sendPlay = (column: number) => {
    socket.emit("playerMove", session.userID, column);
  }
  const restartGame = () => {
    socket.emit("restartGame", session.userID);
  }

  const restartGameReq = () => {
    socket.on("restartRequest", () => {
      setRestart(true);
      setHasWon({
        ...hasWon,
        winner: '',
        display: false
      })
    })
  }

  const restartGameAns = (answer: boolean) => {
    socket.emit("restartAns", answer);
  }
  
  const playerLeftListener = () =>{
    socket.on("playerLeft", (data)=>{
      setPlayers(prevPlayers =>({
        ...prevPlayers,
        [data]: {
          ...prevPlayers[data],
          display: `${data} has left the game :(`,
          wins: undefined
        }
      }))
    })
  }


  return (
    <SocketContext.Provider value={{ socket, 
      hasWon, setHasWon,
      restart, setRestart,
      session,
      players,
      grid,
      turn,
      isConnected,
      initialGrid,
      createRoom,  
      enterRoom,
      checkConnected,
      changeTurn,
      updateBoard,
      sendPlay,
      restartGame, restartGameReq, restartGameAns,
      playerLeftListener }}>
      {children}
    </SocketContext.Provider>
  )
}
