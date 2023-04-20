import styled, { keyframes } from "styled-components"

const fadeAnimation = keyframes`
  0% {opacity: 100%;}
  50% {opacity: 80%;}
  100% {opacity: 0%;}
`
export const Container = styled.div`
  align-items: center;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 16rem;
  justify-content: center;
  max-width: 90vw;
  width: 30rem;
`
export const Title = styled.div`
  color: var(--color-player1);
  font-family: 'Space Grotesk';
  font-size: 2rem;
  font-weight: 800;
  text-align: start;
`
export const Subtitle = styled.div`
  color: black;
  font-family: 'Space Grotesk';
  font-size: 1.5rem;
  font-weight: 400;
  text-align: start;
  &.deactivated{
    display: none;
  }
  &.activated{
    font-size: 1.2rem;
    color: red;
    animation: ${fadeAnimation} 7s;
  }
`
export const LinkContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 15px;
  height: 3rem;
  width: 75%;
`
export const Link = styled.div`
  align-items: center;
  background-color: #eee;
  border: 2px solid #ccc;
  border-radius: 4px;
  color: #333;
  display: flex;
  font-size: 1rem;
  font-family: 'Space Grotesk';
  font-weight: 400;
  height: 75%;
	overflow: auto auto;
  padding: 0 5px;
  width: 50%;
  -ms-overflow-style: none; 
  scrollbar-width: none;
  ::-webkit-scrollbar {
  display: none;
}
`
export const ButtonCopy = styled.button`
  font-family: 'Space Grotesk';
  font-weight: 600;
  background-color: #ffce67;
	border: none;
	border-radius: 4px;
	color: #333;
	cursor: pointer;
	font-size: 1.2rem;
  height: 100%;
  width: 50%;
  :hover{
    background-color: #fd6687;
		color: #fff;
  }
`