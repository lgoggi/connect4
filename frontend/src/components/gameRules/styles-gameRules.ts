import styled from "styled-components";
import { Subtext } from "../gamePage/restart/styles-restart";

export const Container = styled.div`
  align-items: center;
  border: 2px solid black;
  border-radius: 12px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: fit-content;
  max-width: 80%;
  padding-top: 15px;
  width: 30rem;
`
export const Rules = styled(Subtext)`
  width: 80%;
  font-size: 1.5rem;
  @media screen and (max-width: 997px) {
    font-size: 1.5rem;
  }
  @media screen and (max-width: 700px) {
    font-size: 1.1rem;
  }
`