import React from "react";
import classNames from "classnames";
import { Icon } from "./Icon";
import css from "./Taskbar.module.scss";

const WINDOW_ICONS = {
  mindmap: "AccountTree",
  notepad: "Description",
  postit: "StickyNote2",
};

const Taskbar = ({ minimizedWindows, onRestore }) => {
  if (minimizedWindows.length === 0) return null;

  return (
    <div className={css.taskbar}>
      {minimizedWindows.map((window) => (
        <div
          key={window.id}
          className={classNames(css.taskbarItem, { [css.active]: window.isMinimized })}
          onClick={() => onRestore(window.id)}
        >
          <Icon name={WINDOW_ICONS[window.type]} color="white" />
          <span>{window.title}</span>
        </div>
      ))}
    </div>
  );
};

export { Taskbar };
