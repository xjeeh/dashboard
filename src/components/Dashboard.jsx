import { useState, useEffect } from "react";
import Diet from "../pages/Diet";
import JobOfferAnswer from "../pages/JobOfferAnswer";
import Todo from "./ToDo";
import { Icon } from "./Icon";
import css from "./Dashboard.module.scss";
import store from "store2";

const TABS = [
  { label: "To-Do", icon: "Checklist", component: <Todo /> },
  { label: "Dieta", icon: "Restaurant", component: <Diet /> },
  { label: "Job Offer", icon: "Work", component: <JobOfferAnswer /> },
];

const Dashboard = () => {
  // Salvar/restaurar aba selecionada
  const STORAGE_KEY = "app-currentTab";
  const [selected, setSelected] = useState(() => {
    const stored = store.get(STORAGE_KEY);
    return typeof stored === "number" ? stored : 0;
  });

  useEffect(() => {
    store.set(STORAGE_KEY, selected);
  }, [selected]);

  return (
    <div className={css.dashboardWrapper}>
      <div className={css.tabSelector}>
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setSelected(idx)}
            className={`${css.tabButton} ${selected === idx ? css.selected : ""}`}
            title={tab.label}
          >
            <Icon name={tab.icon} color={selected === idx ? "black" : "#888"} />
          </button>
        ))}
      </div>
      <div className={css.dashboardContent}>{TABS[selected].component}</div>
    </div>
  );
};

export default Dashboard;
