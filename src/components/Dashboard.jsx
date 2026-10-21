import { useState, useEffect } from "react";
import classNames from "classnames";
import Diet from "../pages/Diet";
import JobOfferAnswer from "../pages/JobOfferAnswer";
import Todo from "./ToDo";
import { Icon } from "./Icon";
import css from "./Dashboard.module.scss";
import store from "store2";
import { useSwipeTabs } from "../hooks/useSwipeTabs";

const TABS = [
  { label: "To-Do", icon: "Checklist", Component: Todo },
  { label: "Dieta", icon: "Restaurant", Component: Diet },
  { label: "Job Offer", icon: "Work", Component: JobOfferAnswer },
];

const Dashboard = () => {
  const STORAGE_KEY = "app-currentTab";
  const [selected, setSelected] = useState(() => {
    const stored = store.get(STORAGE_KEY);
    return typeof stored === "number" ? stored : 0;
  });

  const { viewportRef, dragOffset, isDragging, goTo } = useSwipeTabs(
    TABS.length,
    selected,
    setSelected,
  );

  useEffect(() => {
    store.set(STORAGE_KEY, selected);
  }, [selected]);

  const slideStyle = {
    transform: `translate3d(calc(-${selected * 100}% + ${dragOffset}px), 0, 0)`,
    transition: isDragging ? "none" : "transform 280ms cubic-bezier(0.36, 0.66, 0.04, 1)",
  };

  return (
    <div className={css.dashboardWrapper}>
      <div className={css.pagesViewport} ref={viewportRef}>
        <div className={css.pagesTrack} style={slideStyle}>
          {TABS.map(({ label, Component }, idx) => (
            <section
              key={label}
              className={classNames(css.pagePane, { [css.pageActive]: idx === selected })}
              aria-hidden={idx !== selected}
            >
              <div className={css.dashboardContent}>
                <Component />
              </div>
            </section>
          ))}
        </div>
      </div>

      <nav className={css.tabSelector} aria-label="Navegação principal">
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => goTo(idx)}
            className={classNames(css.tabButton, { [css.selected]: selected === idx })}
            title={tab.label}
            aria-current={selected === idx ? "page" : undefined}
          >
            <Icon name={tab.icon} color={selected === idx ? "black" : "#888"} />
            <span className={css.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
