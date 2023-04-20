import { useContext, useState } from "react";
import { SocketContext } from "../../../providers/socketProvider";
import { ModalWrapper } from "../Result/styles-result";
import { ButtonCopy, Container, Link, LinkContainer, Subtitle, Title} from "./styles-invite";

const Invite = () => {
  const {session} = useContext(SocketContext);
  const [titleClass, setTitleClass] = useState('deactivated')
  let link = `${import.meta.env.VITE_CLIENT_URL}/${session.roomID}`
  const handleButton = async (copy: string) => {
    await navigator.clipboard.writeText(copy)
    setTitleClass('activated');
    setTimeout(() => {
      setTitleClass('deactivated');
    }, 8000);
  }

  return(
    <ModalWrapper>
      <Container>
        <Title>CONNECT 4 INVITE</Title>
        <Subtitle>invite a friend!</Subtitle>
        <LinkContainer>
          <Link id='link'>{link}</Link>
          <ButtonCopy onClick={()=>handleButton(link)}>COPY LINK</ButtonCopy>
        </LinkContainer>
        <Subtitle className={titleClass}>link copied to clipboard!</Subtitle>
      </Container>
    </ModalWrapper>
  )
}
export default Invite