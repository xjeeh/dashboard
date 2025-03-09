import Diet from "./components/Diet";
import JobOfferAnswer from "./components/JobOfferAnswer";
import Todo from "./components/ToDo";

import css from "./App.module.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter className={css.wrapper}>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/dieta" element={<Diet />} />
        <Route path="/jobOffer" element={<JobOfferAnswer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
