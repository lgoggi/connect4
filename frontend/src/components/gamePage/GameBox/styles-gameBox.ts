import styled from "styled-components";

export const Wrapper = styled.div`
--ball-size: 4.5rem;
  align-self: flex-start;
  background-color: white;
  border: 3px solid black;
  box-shadow: 0 16px rgba(0, 0, 0, 0.9);
  border-radius: 25px;
  display: grid;
  gap: 15px;
  grid-area: gameBox;
  grid-template-columns: repeat(7, 1fr);
  height: 100%;
  min-height: 35rem;
  min-width: 40rem;
  padding: 10px 10px 0;
  width: 100%;
  @media screen and (max-width: 997px) {
    --ball-size: 3.5rem;
    max-width: 40rem;
    min-height: 25rem;
    min-width: 28.2rem;
    width: 80vw;
  }
  @media screen and (max-width: 540px) {
    --ball-size: 2rem;
    min-width: 85vw;
    min-height: 35vh;
  }
` 
export const Column = styled.div`
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 92%;
  justify-content: center;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  @media screen and (max-width: 540px) {
    gap: 0;
  }
  `
export const Square = styled.div`
  place-items: center;
  height: 100%;
  display: grid;
  width: 100%;
`
export const PlayerBall = styled.div`
  background-color: var(--main-purple);
  border: 4px solid black;
  border-radius: 50%;
  height: var(--ball-size);
  width: var(--ball-size);
  position: absolute;
  z-index: 1;
  &.player1{
    background-color: var(--color-player1);
    &::before{
      box-shadow: 0 -8px rgba(0,0,0, 0.5);
      margin-top: 8px;
    }
  }
  &.player2{
    box-shadow: none;
    background-color: var(--color-player2);
    &::before{
      box-shadow: 0 -8px rgba(0,0,0, 0.5);
      margin-top: 8px;
    }
  }
  &::before{
    border-radius: 50%;
    box-shadow: 0 -10px rgba(0,0,0, 0.8);
    content: "";
    height: 100%;
    margin-top: 10px;
    position: absolute;
    width:  100%;
    z-index: -1;
  }
`
