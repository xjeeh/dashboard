import styled from "styled-components";
import Diet from "./components/diet";
import JobOfferAnswer from "./components/jobOfferAnswer";
import Todo from "./components/todo";

const Wrapper = styled.div`
  display: flex;
  background: #2f3242;
  width: 100vw;
  height: 100vh;
  color: white;
  align-items: flex-start;

  > * {
    width: 25%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0px 10px;
  }
`;

const App = () => {
  return (
    <Wrapper>
      <Todo></Todo>
      <Diet></Diet>
      <JobOfferAnswer></JobOfferAnswer>
    </Wrapper>
  );
};

export default App;
