import { useContext} from "react";
import { SocketContext } from "../../../providers/socketProvider";
import { ModalWrapper } from "../Result/styles-result";
import { Container, OptionsWrapper, Option, Subtext, Text, TextWrapper} from "./styles-restart";

const Restart = () => {
  const { setRestart, restartGameAns } = useContext(SocketContext);

  const handleAnswer = (userAnswer: boolean) => {
    setRestart(false);
    restartGameAns(userAnswer);
  }

  return(
    <ModalWrapper>
      <Container>
        <TextWrapper>
          <Text>Restart resquest</Text>
          <Subtext> do you wish to restart the game? </Subtext>
        </TextWrapper>
        <OptionsWrapper>
          <Option onClick={()=>handleAnswer(true)}>YES</Option>
          <Option onClick={()=>handleAnswer(false)}>NO</Option>
        </OptionsWrapper>
      </Container>
    </ModalWrapper>
  )
}

export default Restart;