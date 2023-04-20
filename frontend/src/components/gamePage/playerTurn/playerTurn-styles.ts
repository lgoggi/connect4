import styled from "styled-components";

export const Wrapper = styled.div`
  align-self: flex-start;
  display: grid;
  grid-area: footer;
  justify-content: center;
  place-items: center;
  width: 100%;
  .icon{
    align-self: flex-start;
    grid-area: 1/1;
  }
`
export const TextContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  grid-area: 1/1;
  height: fit-content;
  justify-content: center;
  padding-bottom: 10px;
  width: fit-content;
`
export const Text = styled.div`
  color: white;
  font-family: 'Space Grotesk';
  font-size: 1.3rem;
  font-weight: 800;
  &.player1{
    background-color: var(--color-player1);
  }
  &.player2{
    background-color: var(--color-player2);
  }
`
export const Time = styled.div`
  color: white;
  font-family: 'Space Grotesk';
  font-size: 4rem;
  font-weight: 600;
`