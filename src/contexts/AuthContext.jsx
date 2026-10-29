import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { AUTH_STORAGE_KEY, findUser, verifyPassword } from "../auth/users";

const AuthContext = createContext(null);

export function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const found = findUser(parsed?.id);
    if (!found) return null;
    return { id: found.id, name: found.name };
  } catch {
    return null;
  }
}

function writeStoredUser(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearStoredUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const AuthProvider = ({ children }) => {
  // Lazy init: lê o user do localStorage na 1ª montagem (sobrevive a Ctrl+F5)
  const [user, setUser] = useState(() => readStoredUser());

  // Revalida após mount (ex.: outra aba fez login) e em eventos storage
  useEffect(() => {
    const sync = () => {
      const stored = readStoredUser();
      setUser((prev) => {
        if (prev?.id === stored?.id && prev?.name === stored?.name) return prev;
        return stored;
      });
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = useCallback((userId, sequence) => {
    if (!verifyPassword(userId, sequence)) {
      return { ok: false, error: "Combinação incorreta" };
    }
    const found = findUser(userId);
    const session = { id: found.id, name: found.name };
    writeStoredUser(session);
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
