import styled from "styled-components";

export const ModalWrapper = styled.div`
  align-items: center;
  background-color: rgba(50, 50, 50, 0.85);
  display: flex;
  flex-direction: column;
  font-family: 'Space Grotesk';
  justify-content: center;
  height: 100vh;
  position: fixed;
  width: 100vw;
  z-index: 10;
`
export const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  right: 2rem;
  top: 2rem;
  position: absolute;
  .icon{
    transform: scale(1.5);
  }
`
export const Banner = styled.div`
  align-items: center;
  background-color: white;
  border: 2px solid black;
  border-radius: 24px;
  box-shadow: 0 0 10px white;
  display: flex;
  font-size: 4rem;
  height: fit-content;
  justify-content: center;
  margin-bottom: 5rem;
  text-align: center;
  padding: 15px;
  width: 60vw;
  @media screen and (max-width: 997px) {
    font-size: 2rem;
  }
`
export const RestartButton = styled.button`
  background-color: white;
  border: 2px solid black;
  border-radius: 12px;
  box-shadow: 0 0 10px white;
  cursor: pointer;
  font-size: 2rem;
  font-family: 'Space Grotesk';
  height: fit-content;
  padding: 7px;
  width: fit-content;
  @media screen and (max-width: 997px) {
    font-size: 1.5rem;
  }
`