import { useContext } from "react";
import {ReactComponent as CloseIcon} from '../../../assets/images/icon-close.svg'
import { Banner, CloseButton, RestartButton, ModalWrapper } from "./styles-result"
import { SocketContext } from "../../../providers/socketProvider";

const Result = () => {
  const {hasWon, setHasWon, restartGame} = useContext(SocketContext);
  
  const handleClose = () => {
    setHasWon({
      ...hasWon,
      display: false,
      isFinished: true
    });
  }
  
  return (
    <ModalWrapper>
      <CloseButton onClick={handleClose}> <CloseIcon className='icon' fill="white"/> </CloseButton>
      <Banner>{`${hasWon.winner} has won the game!`}</Banner>
      <RestartButton onClick={restartGame}>Restart</RestartButton>
    </ModalWrapper>
  )
}

export default Result