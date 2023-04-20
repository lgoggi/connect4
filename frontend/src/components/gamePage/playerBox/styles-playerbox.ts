import styled from "styled-components";

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  font-family: 'Space Grotesk';
  width: 80%;
  height: 100%;
  &.player1{
    grid-area: player1;
    justify-content: end;
  }
  &.player2{
    grid-area: player2;
    justify-content: start;
  }
  @media screen and (max-width: 997px) {
    align-items: flex-start;
    height: 8rem;
    width: 50%;
    &.player1{
      grid-area: players;
      justify-content: center;
    }
    &.player2{
      grid-area: players;
      justify-content: center;
      margin-left: auto;
    }
  }
  @media screen and (max-width: 540px) {
    height: 75%;
  }
`
export const Box = styled.div`
  align-items: center;
  background-color: white;
  border: 3px solid black;
  box-shadow: 0 16px rgba(0, 0, 0, 0.7);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  height: 12rem;
  justify-content: center;
  width: 10rem;
  .icon{
    margin: -15px 0 15px;
    transform: scale(1.25);
  }

  @media screen and (max-width: 997px) {
    box-shadow: 0 12px rgba(0, 0, 0, 0.7);
    height: 6rem;
    justify-content: space-around;
    width: 80%;
    max-width: 100vw;
    &.player1{
      flex-direction: row;
      .icon{
        margin: 0 0 0 -55px;
      }
    }
    &.player2{
      flex-direction: row-reverse;
      .icon{
        margin: 0 -55px 0 0;
      }
    }
  }

  @media screen and (max-width: 540px) {
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    display: grid;
    place-items: center;
    place-content: center;
    height: 100%;
    width: 85%;
    &.player1{
      grid-template-columns: 0 100%;
      grid-template-areas:
      "icon player"
      "icon score";
      .icon{
        margin: 0;
      }
    }
    &.player2{
      grid-template-columns: 100% 0;
      grid-template-areas:
      "player icon"
      "score icon";
      .icon{
        margin: 0;
      }
    }
    .icon{
      grid-area: icon;
      transform: scale(0.80);
    }
  }
`
export const Player = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 900;
  @media screen and (max-width: 997px) {
    font-size: 1.2rem;
  }
  @media screen and (max-width: 540px) {
    padding: 10px;
    font-size: 1rem;
    grid-area: player;
  }
`
export const Wins = styled.div`
  font-weight: bold;
  font-size: 5rem;
  @media screen and (max-width: 997px) {
    font-size: 4rem;
  }
  @media screen and (max-width: 540px) {
    font-size: 2rem;
    grid-area: score;
  }
`