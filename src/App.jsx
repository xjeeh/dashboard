import Diet from "./components/Diet";
import JobOfferAnswer from "./components/JobOfferAnswer";
import Todo from "./components/ToDo";
import css from "./App.module.scss";

const App = () => {
  return (
    <div className={css.wrapper}>
      <Todo></Todo>
      <Diet></Diet>
      <JobOfferAnswer></JobOfferAnswer>
    </div>
  );
};

export default App;
