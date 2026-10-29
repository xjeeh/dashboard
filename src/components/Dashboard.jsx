import { useEffect } from "react";
import classNames from "classnames";
import Diet from "../pages/Diet";
import JobOfferAnswer from "../pages/JobOfferAnswer";
import Water from "../pages/Water";
import Todo from "./ToDo";
import { Icon } from "./Icon";
import css from "./Dashboard.module.scss";
import { useSwipeTabs } from "../hooks/useSwipeTabs";
import { useUserData } from "../contexts/UserDataContext";
import { useAuth } from "../contexts/AuthContext";

const TABS = [
  { label: "To-Do", icon: "Checklist", Component: Todo },
  { label: "Dieta", icon: "Restaurant", Component: Diet },
  { label: "Água", icon: "WaterDrop", Component: Water },
  { label: "Job Offer", icon: "Work", Component: JobOfferAnswer },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { data, set } = useUserData();
  const selected = typeof data.currentTab === "number" ? data.currentTab : 0;

  const setSelected = (indexOrFn) => {
    const next = typeof indexOrFn === "function" ? indexOrFn(selected) : indexOrFn;
    set("app-currentTab", next);
  };

  const { viewportRef, dragOffset, isDragging, goTo } = useSwipeTabs(
    TABS.length,
    selected,
    setSelected,
  );

  useEffect(() => {
    if (selected >= TABS.length) set("app-currentTab", 0);
  }, [selected, set]);

  const slideStyle = {
    transform: `translate3d(calc(-${selected * 100}% + ${dragOffset}px), 0, 0)`,
    transition: isDragging ? "none" : "transform 280ms cubic-bezier(0.36, 0.66, 0.04, 1)",
  };

  return (
    <div className={css.dashboardWrapper}>
      <span className={css.userChip}>{user?.name}</span>

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
        <button
          type="button"
          className={classNames(css.tabButton, css.logout)}
          onClick={logout}
          title="Sair"
          aria-label="Sair"
        >
          <Icon name="Logout" color="#ef9a9a" />
          <span className={css.tabLabel}>Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
