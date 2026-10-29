import { useState } from "react";
import classNames from "classnames";
import { USERS, TATTOO_SYMBOLS } from "../auth/users";
import { useAuth } from "../contexts/AuthContext";
import { TattooSymbol } from "../components/TattooSymbols";
import css from "./Login.module.scss";

const Login = () => {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState(USERS[0].id);
  const [sequence, setSequence] = useState([]);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const expectedLen = USERS.find((u) => u.id === selectedUser)?.password.length || 3;

  const pushSymbol = (id) => {
    setError("");
    setSequence((prev) => {
      if (prev.length >= expectedLen) return prev;
      return [...prev, id];
    });
  };

  const backspace = () => {
    setError("");
    setSequence((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setError("");
    setSequence([]);
  };

  const submit = () => {
    const result = login(selectedUser, sequence);
    if (!result.ok) {
      setError(result.error || "Falhou");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setSequence([]);
    }
  };

  return (
    <div className={css.screen}>
      <div className={css.card}>
        <h1 className={css.title}>Dashboard</h1>
        <p className={css.subtitle}>Escolha o usuário e gire o cadeado</p>

        <div className={css.userRow}>
          {USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              className={classNames(css.userBtn, { [css.userActive]: selectedUser === u.id })}
              onClick={() => {
                setSelectedUser(u.id);
                setError("");
              }}
            >
              {u.name}
            </button>
          ))}
        </div>

        <div className={classNames(css.lockFace, { [css.shake]: shake })}>
          <div className={css.slots}>
            {Array.from({ length: expectedLen }).map((_, i) => (
              <div key={i} className={classNames(css.slot, { [css.slotFilled]: sequence[i] })}>
                {sequence[i] ? <TattooSymbol id={sequence[i]} /> : <span className={css.dot}>•</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={css.pad}>
          {TATTOO_SYMBOLS.map((sym) => (
            <button
              key={sym.id}
              type="button"
              className={css.symbolBtn}
              onClick={() => pushSymbol(sym.id)}
              title={sym.label}
              aria-label={sym.label}
              disabled={sequence.length >= expectedLen}
            >
              <TattooSymbol id={sym.id} />
            </button>
          ))}
        </div>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button type="button" className={css.secondary} onClick={backspace}>
            ⌫
          </button>
          <button type="button" className={css.secondary} onClick={clear}>
            Limpar
          </button>
          <button
            type="button"
            className={css.primary}
            onClick={submit}
            disabled={sequence.length !== expectedLen}
          >
            Abrir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
