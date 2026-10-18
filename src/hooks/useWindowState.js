import { useState, useEffect } from "react";
import store from "store2";

export const useWindowState = (storeKey, defaultState) => {
  // Inicializar estado do localStorage
  const [windowState, setWindowState] = useState(() => {
    const stored = store.get(storeKey);
    return stored || defaultState;
  });

  // Sincronizar com localStorage
  useEffect(() => {
    store.set(storeKey, windowState);
  }, [storeKey, windowState]);

  // Escutar por eventos de restauração
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = store.get(storeKey);
      if (stored) {
        setWindowState(stored);
      }
    };

    window.addEventListener("storage:restore", handleStorageChange);
    return () => window.removeEventListener("storage:restore", handleStorageChange);
  }, [storeKey]);

  return [windowState, setWindowState];
};
