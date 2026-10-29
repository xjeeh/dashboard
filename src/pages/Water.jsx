import { useEffect, useMemo } from "react";
import { Icon } from "../components/Icon";
import { useUserData } from "../contexts/UserDataContext";
import { getWaterDayKey } from "../utils/waterDay";
import css from "./Water.module.scss";

const STEP_ML = 500;
const DEFAULT_TARGET_ML = 2000;
const MIN_TARGET_ML = STEP_ML;
const MAX_TARGET_ML = 5000;

const formatLiters = (ml) => {
  const liters = (ml / 1000).toFixed(1).replace(".", ",");
  return `${liters}L`;
};

const CupIcon = ({ filled }) => (
  <svg className={css.cupSvg} viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M12 8h40l-4 56c-0.5 6-5.5 10-11.5 10h-9c-6 0-11-4-11.5-10L12 8z"
      fill={filled ? "#4fc3f7" : "transparent"}
      stroke="#90caf9"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M10 8h44" fill="none" stroke="#bbdefb" strokeWidth="3" strokeLinecap="round" />
    {filled && (
      <path
        d="M18 28c4 3 8-3 12 0s8-3 12 0"
        fill="none"
        stroke="#e1f5fe"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    )}
  </svg>
);

const Water = () => {
  const { data, patch } = useUserData();
  const resetHour = data.waterResetHour ?? 6;
  const dayKey = useMemo(() => getWaterDayKey(resetHour), [resetHour]);

  const dayEntry = data.waterByDay?.[dayKey] || {
    targetMl: DEFAULT_TARGET_ML,
    filledCount: 0,
  };

  const targetMl = dayEntry.targetMl ?? DEFAULT_TARGET_ML;
  const filledCount = dayEntry.filledCount ?? 0;

  const cupCount = Math.max(1, Math.round(targetMl / STEP_ML));
  const safeFilled = Math.min(filledCount, cupCount);

  // Garante registro do dia atual (após o horário de reset, dia novo = zerado)
  useEffect(() => {
    if (!data.waterByDay?.[dayKey]) {
      patch({
        waterByDay: {
          ...(data.waterByDay || {}),
          [dayKey]: { targetMl: DEFAULT_TARGET_ML, filledCount: 0 },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey]);

  const saveDay = (partial) => {
    const nextDay = { ...dayEntry, ...partial };
    patch({
      waterByDay: {
        ...(data.waterByDay || {}),
        [dayKey]: nextDay,
      },
    });
  };

  const decreaseTarget = () => {
    const next = Math.max(MIN_TARGET_ML, targetMl - STEP_ML);
    const nextCups = Math.round(next / STEP_ML);
    saveDay({
      targetMl: next,
      filledCount: Math.min(filledCount, nextCups),
    });
  };

  const increaseTarget = () => {
    saveDay({ targetMl: Math.min(MAX_TARGET_ML, targetMl + STEP_ML) });
  };

  const reset = () => {
    saveDay({ filledCount: 0 });
  };

  const fillOne = () => {
    saveDay({ filledCount: Math.min(cupCount, filledCount + 1) });
  };

  const cups = Array.from({ length: cupCount }, (_, i) => ({
    id: i,
    filled: i < safeFilled,
  }));

  return (
    <div className={css.wrapper}>
      <p className={css.dayHint}>
        Dia {dayKey} · reset às {String(resetHour).padStart(2, "0")}:00
      </p>

      <div className={css.targetRow}>
        <button
          type="button"
          className={css.stepButton}
          onClick={decreaseTarget}
          disabled={targetMl <= MIN_TARGET_ML}
          aria-label="Diminuir meta"
        >
          <Icon name="Remove" color="white" />
        </button>

        <span className={css.targetLabel}>{formatLiters(targetMl)}</span>

        <button
          type="button"
          className={css.stepButton}
          onClick={increaseTarget}
          disabled={targetMl >= MAX_TARGET_ML}
          aria-label="Aumentar meta"
        >
          <Icon name="Add" color="white" />
        </button>

        <button
          type="button"
          className={css.resetButton}
          onClick={reset}
          title="Resetar copos"
          aria-label="Resetar copos"
        >
          <Icon name="RestartAlt" color="#23243a" />
        </button>
      </div>

      <div className={css.cupsRow} role="list" aria-label="Copos de água">
        {cups.map((cup) => (
          <button
            key={cup.id}
            type="button"
            role="listitem"
            className={`${css.cupButton} ${cup.filled ? css.cupFilled : css.cupEmpty}`}
            onClick={fillOne}
            disabled={safeFilled >= cupCount}
            aria-label={
              cup.filled
                ? `Copo ${cup.id + 1} preenchido`
                : `Preencher próximo copo (${safeFilled}/${cupCount})`
            }
          >
            <CupIcon filled={cup.filled} />
          </button>
        ))}
      </div>

      <p className={css.progress}>
        {formatLiters(safeFilled * STEP_ML)} / {formatLiters(targetMl)}
      </p>
    </div>
  );
};

export default Water;
