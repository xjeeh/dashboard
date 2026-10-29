import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUserData } from "./UserDataContext";
import { useAuth } from "./AuthContext";

const WindowContext = createContext();

export const WindowProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { ready, get } = useUserData();
  const [minimizedWindows, setMinimizedWindows] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !ready) {
      setMinimizedWindows([]);
      return;
    }

    const windows = [];
    const notepadData = get("notepad-daily");
    const postitData = get("postIt-daily");
    const mindmapData = get("mindmap-daily");

    if (notepadData?.isMinimized && !notepadData?.isClosed) {
      windows.push({ id: "notepad", type: "notepad", title: "Notepad", isMinimized: true });
    }
    if (postitData?.isMinimized && !postitData?.isClosed) {
      windows.push({ id: "postit", type: "postit", title: "Post-it", isMinimized: true });
    }
    if (mindmapData?.isMinimized && !mindmapData?.isClosed) {
      windows.push({ id: "mindmap", type: "mindmap", title: "Mind Map", isMinimized: true });
    }
    setMinimizedWindows(windows);
  }, [isAuthenticated, ready, get]);

  const addMinimizedWindow = useCallback((window) => {
    setMinimizedWindows((prev) => {
      if (prev.find((w) => w.id === window.id)) {
        return prev.map((w) => (w.id === window.id ? window : w));
      }
      return [...prev, window];
    });
  }, []);

  const removeMinimizedWindow = useCallback((windowId) => {
    setMinimizedWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const value = {
    minimizedWindows,
    addMinimizedWindow,
    removeMinimizedWindow,
  };

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
};

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
};
