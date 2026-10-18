import { createContext, useContext, useState, useCallback } from "react";
import { useLocalstorage } from "../hooks/useLocalstorage";

const WindowContext = createContext();

export const WindowProvider = ({ children }) => {
  // Inicializar verificando o localStorage de cada componente
  const { getValue } = useLocalstorage();
  const notepadData = getValue("notepad-daily");
  const postitData = getValue("postIt-daily");
  const mindmapData = getValue("mindmap-daily");
  const [minimizedWindows, setMinimizedWindows] = useState(() => {
    const windows = [];

    // Verificar Notepad
    if (notepadData?.isMinimized && !notepadData?.isClosed) {
      windows.push({
        id: "notepad",
        type: "notepad",
        title: "Notepad",
        isMinimized: true,
      });
    }

    // Verificar PostIt
    if (postitData?.isMinimized && !postitData?.isClosed) {
      windows.push({
        id: "postit",
        type: "postit",
        title: "Post-it",
        isMinimized: true,
      });
    }

    // Verificar MindMap
    if (mindmapData?.isMinimized && !mindmapData?.isClosed) {
      windows.push({
        id: "mindmap",
        type: "mindmap",
        title: "Mind Map",
        isMinimized: true,
      });
    }

    return windows;
  });

  const addMinimizedWindow = useCallback((window) => {
    setMinimizedWindows((prev) => {
      // Se a janela já existe, atualiza
      if (prev.find((w) => w.id === window.id)) {
        return prev.map((w) => (w.id === window.id ? window : w));
      }
      // Se não existe, adiciona
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
