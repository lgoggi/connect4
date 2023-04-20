import styled from "styled-components";

export const Container = styled.div`
  align-items: center;
  background-color: white;
  border: 2px solid black;
  border-radius: 12px;
  box-shadow: 0 0 10px white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 24rem;
  justify-content: center;
  width: 32rem;
`
export const TextWrapper = styled.div`
  align-items: center;
  display:flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`
export const Text = styled.div`
  font-size: 2rem;
  font-weight: 900;
`
export const Subtext = styled.div`
  text-align: center;
  font-size: 2rem;
  width: 60%;
  font-weight: 200;
`
export const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  height: 6rem;
  width: 80%;
`
export const Option = styled.button`
  background-color: white;
  border: 2px solid black;
  cursor: pointer;
  font-family: 'Space grotesk';
  font-size: 2rem;
  font-weight: 400;
  height: 3rem;
  width: 40%;
  :hover{
    background-color: #E8E8E8;
  }
`