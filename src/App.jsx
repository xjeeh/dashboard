import Dashboard from "./components/Dashboard";

import css from "./App.module.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PostIt } from "./components/PostIt";
import { CalendarPage } from "./pages/Calendar";
import { Notepad } from "./components/Notepad";

const App = () => {
  return (
    <>
      <BrowserRouter className={css.wrapper}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <PostIt />
      <CalendarPage />
      <Notepad />
    </>
  );
};

export default App;
