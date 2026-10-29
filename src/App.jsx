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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserDataProvider, useUserData } from "./contexts/UserDataContext";
import Login from "./pages/Login";

const AppContent = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { ready, error, get, set } = useUserData();
  const { minimizedWindows, removeMinimizedWindow } = useWindow();

  const handleRestore = (windowId) => {
    removeMinimizedWindow(windowId);

    const storeKeys = {
      notepad: "notepad-daily",
      postit: "postIt-daily",
      mindmap: "mindmap-daily",
    };

    const storeKey = storeKeys[windowId];
    if (storeKey) {
      const data = { ...(get(storeKey) || {}) };
      data.isMinimized = false;
      set(storeKey, data);
      window.dispatchEvent(new CustomEvent("storage:restore"));
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  if (error) {
    return (
      <div className={css.bootMessage}>
        <p>{error}</p>
        <p className={css.bootHint}>
          Sessão de <strong>{user?.name}</strong> mantida. Tente de novo sem precisar logar.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => window.location.reload()}>
            Recarregar
          </button>
          <button type="button" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className={css.bootMessage}>
        <p>Carregando dados de {user?.name}…</p>
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
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
    <ErrorBoundary FallbackComponent={AppError}>
      <AuthProvider>
        <UserDataProvider>
          <WindowProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </WindowProvider>
        </UserDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
