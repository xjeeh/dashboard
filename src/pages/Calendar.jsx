import css from "./Calendar.module.scss";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import React, { useState } from "react";
import dayjs from "dayjs";
import store from "store2";
import { v4 as uuidv4 } from "uuid";

// Novo: chave única para todos os eventos do calendário
const CALENDAR_ALL_KEY = "calendar-all";

function getAllCalendarEvents() {
  return store.get(CALENDAR_ALL_KEY) || {};
}
function setAllCalendarEvents(obj) {
  store.set(CALENDAR_ALL_KEY, obj);
}
function getEventsForDate(date) {
  const all = getAllCalendarEvents();
  return all[date] || [];
}
function setEventsForDate(date, list) {
  const all = getAllCalendarEvents();
  all[date] = list;
  setAllCalendarEvents(all);
}

export const CalendarPage = () => {
  const [value, onChange] = useState(new Date());
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [events, setEvents] = useState(getEventsForDate(dayjs(new Date()).format("YYYY-MM-DD")));
  const [visible, setVisible] = useState(() => {
    const stored = store.get("calendar-visible");
    return typeof stored === "boolean" ? stored : false;
  });

  const categories = [
    { value: "work", label: "Trabalho" },
    { value: "personal", label: "Pessoal" },
    { value: "health", label: "Saúde" },
    { value: "other", label: "Outro" },
  ];

  const dateKey = dayjs(value).format("YYYY-MM-DD");

  // Carregar eventos do dia ao trocar data
  React.useEffect(() => {
    setEvents(getEventsForDate(dateKey));
  }, [dateKey]);

  // Salvar visibilidade no store2 sempre que mudar
  React.useEffect(() => {
    store.set("calendar-visible", visible);
  }, [visible]);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!desc || !category) return;
    const newEvent = { id: uuidv4(), desc, category };
    const updated = [...events, newEvent];
    setEventsForDate(dateKey, updated);
    setEvents(updated);
    setDesc("");
    setCategory("");
  };

  const handleDeleteEvent = (id) => {
    const updated = events.filter((ev) => ev.id !== id);
    setEventsForDate(dateKey, updated);
    setEvents(updated);
  };

  // Função para verificar se um dia tem eventos
  const hasEvents = (date) => {
    const key = dayjs(date).format("YYYY-MM-DD");
    const all = getAllCalendarEvents();
    const dayEvents = all[key];
    return Array.isArray(dayEvents) && dayEvents.length > 0;
  };

  // tileContent para mostrar o círculo vermelho
  const renderTileContent = ({ date, view }) => {
    if (view === "month" && hasEvents(date)) {
      return (
        <span className={css.EventDotWrapper}>
          <span className={css.EventDot}></span>
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <div className={visible ? css.Wrapper : `${css.Wrapper} ${css.hidden}`}>
        <button
          className={`${css.ToggleButton} ${css.ToggleButtonLeft}`}
          onClick={() => setVisible((v) => !v)}
          title={visible ? "Esconder calendário" : "Mostrar calendário"}
          aria-label={visible ? "Esconder calendário" : "Mostrar calendário"}
        >
          <span className={css.ToggleIconMobile}>{visible ? "▾" : "▴"}</span>
          <span className={css.ToggleIconDesktop}>{visible ? "⮞" : "⮜"}</span>
        </button>
        <div className={css.EventList}>
          <div className={css.ActiveDate}>{dayjs(value).format("DD/MM/YYYY")}</div>
          {events.length === 0 && <div>Nenhum evento para este dia.</div>}
          {events.map((ev) => (
            <div key={ev.id} className={css.ScheduleItem}>
              <div className={css.ScheduleItemTime}>{ev.category}</div>
              <div className={css.ScheduleItemDescription}>{ev.desc}</div>
              <button className={css.DeleteButton} onClick={() => handleDeleteEvent(ev.id)}>
                Excluir
              </button>
            </div>
          ))}
        </div>
        <div className={css.FlexColumnCenter}>
          <form onSubmit={handleAddEvent} className={css.Form + " " + css.MarginBottom8}>
            <input
              type="text"
              placeholder="Descrição"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button type="submit">Adicionar</button>
          </form>
          <ReactCalendar
            onChange={onChange}
            value={value}
            formatDay={(_, date) => dayjs(date).format("DD")}
            locale="pt-BR"
            tileContent={renderTileContent}
          />
        </div>
      </div>
    </>
  );
};
