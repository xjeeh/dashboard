import Dashboard from "./components/Dashboard";
import css from "./App.module.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PostIt } from "./components/PostIt";
import { CalendarPage } from "./pages/Calendar";
import { Notepad } from "./components/Notepad";
import { MindMap } from "./components/MindMap";
import { Taskbar } from "./components/Taskbar";
import { WindowProvider, useWindow } from "./contexts/WindowContext";
import { ErrorBoundary } from "react-error-boundary";
import { AppError } from "./components/AppError";

const AppContent = () => {
  const { minimizedWindows, removeMinimizedWindow } = useWindow();

  const handleRestore = (windowId) => {
    // Remover da taskbar
    removeMinimizedWindow(windowId);

    // Atualizar estado do componente no localStorage
    const storeKeys = {
      notepad: "notepad-daily",
      postit: "postIt-daily",
      mindmap: "mindmap-daily",
    };

    const storeKey = storeKeys[windowId];
    if (storeKey) {
      const data = JSON.parse(localStorage.getItem(storeKey) || "{}");
      data.isMinimized = false;
      localStorage.setItem(storeKey, JSON.stringify(data));

      // Disparar evento para notificar os componentes
      window.dispatchEvent(new CustomEvent("storage:restore"));
    }
  };

  return (
    <div className={css.wrapper}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <div className={css.floatingWindows}>
        <PostIt />
        <CalendarPage />
        <Notepad />
        <MindMap />
      </div>
      <Taskbar minimizedWindows={minimizedWindows} onRestore={handleRestore} />
    </div>
  );
};

const App = () => {
  return (
    <>
      <>a</>
      <ErrorBoundary FallbackComponent={AppError}>
        <WindowProvider>
          <AppContent />
        </WindowProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;
