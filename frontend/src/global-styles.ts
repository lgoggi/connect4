import { createGlobalStyle } from 'styled-components';
import SpaceGrotesk from './assets/fonts/SpaceGrotesk-VariableFont_wght.ttf'
 
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Space Grotesk';
    src: url(${SpaceGrotesk}) format('truetype');
  }
  :root{
    --main-purple: #7945ff;
    --darker-purple: #5c2dd5;
    --color-player1: #fd6687;
    --color-player2: #ffce67;
  }
  body {
    background-color: var(--main-purple);
    margin: 0;
    padding: 0;
  }
`;
 
export default GlobalStyle;