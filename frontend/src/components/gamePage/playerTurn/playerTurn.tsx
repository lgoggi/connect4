import { useCallback, useContext, useEffect, useState } from "react";
import { ReactComponent as BgPlayer1 } from '../../../assets/images/turn-background-red.svg'
import { ReactComponent as BgPlayer2 } from '../../../assets/images/turn-background-yellow.svg'
import { Text, TextContainer, Time, Wrapper } from "./playerTurn-styles"
import {SocketContext} from "../../../providers/socketProvider";

const PlayerTurn = () => {
  const { isConnected, turn, changeTurn, hasWon, players} = useContext(SocketContext);
  const [time, setTime] = useState(30);

  const clock = useCallback(() => {
    setTime((OldTime) => OldTime - 1);
  }, []);

  useEffect(() => {
    setTime(30);
  }, [turn])

  useEffect(() => {
    if (hasWon.isFinished) {
      return;
    }
    if(!isConnected){
      return
    }
    if (time === 0) {
      changeTurn();
      return;
    }
    const timeoutFunction = setInterval(clock, 1000);
    return () => clearInterval(timeoutFunction);
  }, [hasWon,isConnected, time])

  const BgSelector = () => {
    if (hasWon.isFinished) {
      if (hasWon.winner === "player1") {
        return <BgPlayer1 className='icon' />
      } else {
        return <BgPlayer2 className='icon' />
      }
    }
    if (turn === "player1") {
      return <BgPlayer1 className='icon' />
    } else {
      return <BgPlayer2 className='icon' />
    }
  }

  return (
    <Wrapper>
      {BgSelector()}
      <TextContainer>
        {hasWon.isFinished ?
          <>
            <Text className={hasWon.winner==="player1"? 'player1' : 'player2'}> {players[hasWon.winner!].display}</Text>
            <Time>WON</Time>
          </> :
          <>
            <Text className={turn === "player1" ? 'player1' : 'player2'}> {players[turn].display==='you'? 'your':`opponent's`} turn </Text>
            <Time>{time}s</Time>
          </>
        }
      </TextContainer>
    </Wrapper>
  )
}

export default PlayerTurn