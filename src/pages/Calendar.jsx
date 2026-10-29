import css from "./Calendar.module.scss";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { useUserData } from "../contexts/UserDataContext";

export const CalendarPage = () => {
  const { get, set, data } = useUserData();

  const [value, onChange] = useState(new Date());
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(Boolean(data.calendarVisible));
  const skipVisibleSync = useRef(true);

  const categories = [
    { value: "work", label: "Trabalho" },
    { value: "personal", label: "Pessoal" },
    { value: "health", label: "Saúde" },
    { value: "other", label: "Outro" },
  ];

  const dateKey = dayjs(value).format("YYYY-MM-DD");

  const getAllCalendarEvents = () => data.calendarAll || get("calendar-all") || {};

  const setEventsForDate = (date, list) => {
    const all = { ...getAllCalendarEvents() };
    all[date] = list;
    set("calendar-all", all);
  };

  useEffect(() => {
    skipVisibleSync.current = true;
    setVisible(Boolean(data.calendarVisible));
  }, [data.calendarVisible]);

  useEffect(() => {
    const all = getAllCalendarEvents();
    setEvents(all[dateKey] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, data.calendarAll]);

  useEffect(() => {
    if (skipVisibleSync.current) {
      skipVisibleSync.current = false;
      return;
    }
    set("calendar-visible", visible);
  }, [visible, set]);

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

  const hasEvents = (date) => {
    const key = dayjs(date).format("YYYY-MM-DD");
    const dayEvents = getAllCalendarEvents()[key];
    return Array.isArray(dayEvents) && dayEvents.length > 0;
  };

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
