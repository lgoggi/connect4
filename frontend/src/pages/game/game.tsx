import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { SocketContext } from "../../providers/socketProvider";
import Footer from "../../components/gamePage/footer/footer";
import GameBox from "../../components/gamePage/GameBox/GameBox";
import Header from "../../components/gamePage/header/header";
import PlayerBox from "../../components/gamePage/playerBox/playerBox";
import PlayerTurn from "../../components/gamePage/playerTurn/playerTurn";
import Result from "../../components/gamePage/Result/Result";
import Invite from "../../components/gamePage/invite/invite";
import Restart from "../../components/gamePage/restart/restart";

const Wrapper = styled.div`
  background-color: var(--main-purple);
  display: grid;
  grid-template-columns: 3fr 4fr 3fr;
  grid-template-rows: 1fr 4fr 1.5fr;
  grid-template-areas:
  ". header ."
  "player1 gameBox player2"
  "footer footer footer";
  height: 100vh;
  justify-items: center;
  width: 100vw;
  @media screen and (max-width: 997px) {
    justify-items: normal;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      ". header ."
      ". players ."
      ". gameBox ."
      "footer footer footer";
  }
`

function App() {
  const { players, enterRoom, checkConnected, hasWon, isConnected, restart} = useContext(SocketContext);
  const id = useParams().roomID;

  useEffect(()=>{
    if(id){
      enterRoom(id)
    }
  }, [])
  
  if(!isConnected){
    checkConnected();
  }
  return (
    <>
      {restart && <Restart />}
      {hasWon.display && <Result />}
      {!isConnected && <Invite />}
      <Wrapper>

        <Header />
        <Footer />

        <PlayerBox player={players!.player1} />
        <PlayerBox player={players!.player2} />

        <GameBox />
        
        <PlayerTurn />

      </Wrapper>
    </>  
  );
}

export default App;