import {ReactComponent as CloseIcon} from '../../assets/images/icon-close.svg'
import { CloseButton, ModalWrapper } from "../gamePage/Result/styles-result";
import { Text } from "../gamePage/restart/styles-restart";
import { Container, Rules } from "./styles-gameRules";

interface Props {
  setRulesDisplay: React.Dispatch<React.SetStateAction<boolean>>
}

const GameRules = ({setRulesDisplay}: Props) => {
  
  const handleClose = ()=>{
    setRulesDisplay(false);
  }

  return(
    <ModalWrapper>
      <CloseButton onClick={handleClose}> <CloseIcon className='icon' fill="white"/> </CloseButton>
      <Container>
        <Text>GAME RULES</Text>
        <Rules>
          <p>1. Connect 4 is a two-player game played on a board with seven columns and six rows.</p>
          <p>2. The goal is to connect four of your pieces vertically, horizontally, or diagonally.</p>
          <p>3. Players take turns dropping pieces into the columns.</p>
          <p>4. The first player to connect four pieces wins.</p>
        </Rules>
      </Container>
    </ModalWrapper>
  )
}

export default GameRules;