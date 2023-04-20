import { useContext } from "react";
import { SocketContext } from "../../../providers/socketProvider";
import { Button, Wrapper } from "./styles-header"

const Header = () => {
  const {restartGame}=useContext(SocketContext)

  const handleMenu = () => {
    window.location.replace('/');
  }
  return (
    <Wrapper>
      <Button onClick={handleMenu}>MENU</Button>
      <Button onClick={restartGame}>RESTART</Button>
    </Wrapper>
  )
}
export default Header