import { playerProps } from "../../../types/types"
import { Wrapper, Box, Player, Wins } from "./styles-playerbox"
import {ReactComponent as Player1} from '../../../assets/images/player-one.svg'
import {ReactComponent as Player2} from '../../../assets/images/player-two.svg'

interface Props {
  player: playerProps;
}
const PlayerBox = ({player}: Props) => {
  return (
    <Wrapper className={player.name}>
      <Box className={player.name}>
        {/* makes the icon disapear in case of player leaving */}
        {player.wins!==undefined && (player.name==="player1" ? <Player1 className='icon'/> : <Player2 className='icon'/>)}
        <Player>{player.display}</Player>
        <Wins>{player.wins}</Wins>
      </Box>
    </Wrapper>
  )
}

export default PlayerBox