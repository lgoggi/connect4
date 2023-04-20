import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {ReactComponent as Logo} from "../../assets/images/logo.svg";
import { SocketContext } from "../../providers/socketProvider";
import GameRules from "../../components/gameRules/gameRules";


const Wrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
`
const Container = styled.div`
  align-items: center;
  border: none;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  height: 40%;
  justify-content: space-around;
  width: 30rem;
`
const ContainerButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`
const Button = styled.button`
  background-color: var(--color-player2);
  border: none;
  border-radius: 12px;
  box-shadow: 3px 4px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  font-family: 'Space Grotesk';
  font-size: 1.2rem;
  font-weight: 600;
  height: 3rem;
  width: 15rem;
  &.white-bg{
    background-color: white;
  }
`

const Home = () => {
  const navigate = useNavigate();
  const { createRoom, session } = useContext(SocketContext);
  const [rulesDisplay, setRulesDisplay] = useState(false);

  //fix back button/interaction
  useEffect(()=>{
    navigate("/"+session.roomID);
  }, [session.roomID])
  const handleGameRules = () =>{
    setRulesDisplay(true);
  }
  return(
    <Wrapper>
      {rulesDisplay && <GameRules setRulesDisplay={setRulesDisplay}/>}
      <Container>
        <Logo className="icon"/>  
        <ContainerButton>
          <Button onClick={createRoom}>PLAY VS PLAYER</Button>
          <Button className="white-bg" onClick={handleGameRules}>GAME RULES</Button>
        </ContainerButton>     
      </Container>
    </Wrapper>
  )
}
export default Home