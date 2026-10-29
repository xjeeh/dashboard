import { useEffect, useRef, useState } from "react";
import { useUserData } from "../contexts/UserDataContext";

export const useWindowState = (storeKey, defaultState) => {
  const { ready, get, set } = useUserData();
  const [windowState, setWindowState] = useState(defaultState);
  const hydrated = useRef(false);
  const skipNextSync = useRef(false);

  useEffect(() => {
    if (!ready) {
      hydrated.current = false;
      return;
    }
    const stored = get(storeKey);
    skipNextSync.current = true;
    setWindowState(stored && typeof stored === "object" ? { ...defaultState, ...stored } : defaultState);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, storeKey]);

  useEffect(() => {
    if (!ready || !hydrated.current) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    set(storeKey, windowState);
  }, [ready, storeKey, windowState, set]);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = get(storeKey);
      if (stored) {
        skipNextSync.current = true;
        setWindowState(stored);
      }
    };

    window.addEventListener("storage:restore", handleStorageChange);
    return () => window.removeEventListener("storage:restore", handleStorageChange);
  }, [storeKey, get]);

  return [windowState, setWindowState];
};
