import styled from "styled-components";

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  grid-area: header;
  height: 100%;
  justify-content: space-between;
  width: stretch;
  @media screen and (max-width: 997px) {
    height: 5rem;
  }
`
export const Button = styled.button`
  background-color: var(--darker-purple);
  border: none;
  border-radius: 24px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Space Grotesk';
  font-weight: 600;
  height: 2.5rem;
  padding: 0 15px;
  width: fit-content;
  &:hover{
    height: 3rem;
    font-size: 1.2rem;
  }
`