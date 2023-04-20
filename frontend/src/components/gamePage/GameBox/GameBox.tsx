import { useContext, useEffect } from "react";
import { SocketContext } from "../../../providers/socketProvider";
import { Column, PlayerBall, Square, Wrapper } from "./styles-gameBox"

const GameBox = () => {
  const {sendPlay, grid, updateBoard, hasWon, restartGameReq, playerLeftListener} = useContext(SocketContext)

  useEffect(()=>{
    updateBoard()
    restartGameReq()
    playerLeftListener()
  }, [])
  const handleSquareClick = (column: number) => {
    if (hasWon.isFinished) {
      return;
    }
    sendPlay(column);
  }

  return (
    <Wrapper>
      {grid!.map((column, index) => {
        return (
          <Column key={index} onClick={() => handleSquareClick(index)}>
            {column.map((square, index) => {
              return (
                <Square key={index}>
                  <PlayerBall className={(square.player!=='empty') ? square.player : ''} />
                </Square>
              )
            })}
          </Column>
        )
      })}
    </Wrapper>
  )
}

export default GameBox
