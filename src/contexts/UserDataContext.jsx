import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ensureUserData, patchUserData } from "../api/client";
import { useAuth } from "./AuthContext";

const UserDataContext = createContext(null);

const EMPTY = {
  list: {},
  dietAll: {},
  calendarAll: {},
  calendarVisible: false,
  currentTab: 0,
  waterByDay: {},
  waterResetHour: 6,
  notepad: null,
  postIt: null,
  mindmap: null,
};

/** Mapeia chaves antigas do store2 → campos da API */
const KEY_MAP = {
  list: "list",
  "diet-all": "dietAll",
  "calendar-all": "calendarAll",
  "calendar-visible": "calendarVisible",
  "app-currentTab": "currentTab",
  "notepad-daily": "notepad",
  "postIt-daily": "postIt",
  "mindmap-daily": "mindmap",
  waterByDay: "waterByDay",
  waterResetHour: "waterResetHour",
};

function resolveKey(key) {
  return KEY_MAP[key] || key;
}

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const dataRef = useRef(data);
  const syncTimer = useRef(null);
  const pendingPatch = useRef({});

  dataRef.current = data;

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setData(EMPTY);
      setReady(false);
      setError(null);
      pendingPatch.current = {};
      if (syncTimer.current) clearTimeout(syncTimer.current);
      return;
    }

    setReady(false);
    setError(null);

    ensureUserData(user.id)
      .then((remote) => {
        if (cancelled) return;
        setData({ ...EMPTY, ...remote });
        setReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        const status = err.response?.status;
        let message = err.message;
        if (err.code === "MISSING_COLLECTION") {
          message = err.message;
        } else if (!err.response) {
          message =
            "Não foi possível alcançar a API. Confirme o json-server em http://localhost:3005 e reinicie o Vite (proxy /api).";
        } else if (status === 404) {
          message =
            'Coleção ausente: adicione "userData": [] no db.json do json-server (:3005) e reinicie o server.';
        } else {
          message = `Erro na API (${status || "?"}): ${err.message}`;
        }
        setError(message);
        setReady(false);
      });

    return () => {
      cancelled = true;
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [user]);

  const flushPatch = useCallback(async () => {
    if (!user || Object.keys(pendingPatch.current).length === 0) return;
    const payload = { ...pendingPatch.current };
    pendingPatch.current = {};
    try {
      const updated = await patchUserData(user.id, payload);
      setData((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      console.error("Falha ao salvar no json-server", err);
      // recoloca no pending para tentar de novo
      pendingPatch.current = { ...payload, ...pendingPatch.current };
    }
  }, [user]);

  const scheduleSync = useCallback(
    (partial) => {
      pendingPatch.current = { ...pendingPatch.current, ...partial };
      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(flushPatch, 350);
    },
    [flushPatch],
  );

  const get = useCallback((key) => {
    const field = resolveKey(key);
    return dataRef.current[field];
  }, []);

  const set = useCallback(
    (key, value) => {
      const field = resolveKey(key);
      setData((prev) => {
        const next = { ...prev, [field]: value };
        dataRef.current = next;
        return next;
      });
      scheduleSync({ [field]: value });
    },
    [scheduleSync],
  );

  const patch = useCallback(
    (partial) => {
      setData((prev) => {
        const next = { ...prev, ...partial };
        dataRef.current = next;
        return next;
      });
      scheduleSync(partial);
    },
    [scheduleSync],
  );

  const value = useMemo(
    () => ({
      ready,
      error,
      data,
      get,
      set,
      patch,
      userId: user?.id || null,
    }),
    [ready, error, data, get, set, patch, user],
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
};
