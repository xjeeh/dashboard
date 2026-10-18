import { useRef } from "react";
import { Icon } from "./Icon";
import css from "./Notepad.module.scss";
import classNames from "classnames";
import { useWindow } from "../contexts/WindowContext";
import { useWindowState } from "../hooks/useWindowState";

export const Notepad = () => {
  const storeIndex = "notepad-daily";
  const [notepad, setNotepad] = useWindowState(storeIndex, {
    x: "20px",
    y: "20px",
    width: "400px",
    height: "500px",
    isMinimized: false,
    isClosed: false,
    text: "",
  });

  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const { addMinimizedWindow, removeMinimizedWindow } = useWindow();

  const toggleMinimize = (e) => {
    e.stopPropagation();
    const newIsMinimized = !notepad.isMinimized;
    setNotepad((prev) => ({ ...prev, isMinimized: newIsMinimized }));

    if (newIsMinimized) {
      addMinimizedWindow({
        id: "notepad",
        type: "notepad",
        title: "Notepad",
        isMinimized: true,
      });
    } else {
      removeMinimizedWindow("notepad");
    }
  };

  const close = (e) => {
    e.stopPropagation();
    setNotepad((prev) => ({ ...prev, isClosed: !prev.isClosed }));
  };

  const handleSetText = (e) => {
    const newText = e.target.value;
    setNotepad((prev) => ({ ...prev, text: newText }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.stopPropagation();
    }
  };

  const dragStart = (e) => {
    // Only start drag if we're not clicking on the textarea
    if (e.target.tagName.toLowerCase() === "textarea") {
      e.preventDefault();
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    offset.current.x = e.clientX - rect.left;
    offset.current.y = e.clientY - rect.top;

    e.dataTransfer.setData("text/plain", "");

    const img = new Image();
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEWZmZmILVbPAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const dragNote = (e) => {
    const x = e.pageX;
    const y = e.pageY;

    if (!x || !y) return;

    const note = ref.current;

    const newX = `${x - offset.current.x}px`;
    const newY = `${y - offset.current.y}px`;

    note.style.position = "absolute";
    note.style.left = newX;
    note.style.top = newY;

    setNotepad((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const { x, y, isMinimized, isClosed, text, width, height } = notepad;

  return (
    <>
      <div
        ref={ref}
        style={{ left: x, top: y, width: width, height: height }}
        className={classNames(css.wrapper, css.darkMode, {
          [css.minimized]: isMinimized,
          [css.closed]: isClosed,
        })}
      >
        <div
          className={css.windowActions}
          onClick={toggleMinimize}
          draggable="true"
          onDragStart={dragStart}
          onDrag={dragNote}
        >
          <span className={css.title}>Notepad</span>
          <Icon name={isMinimized ? "Crop32" : "Minimize"} color="white" />
          <Icon name="Close" color="red" onClick={() => close()} />
        </div>
        <textarea
          value={text}
          onChange={handleSetText}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          style={{ resize: "none" }}
        ></textarea>
      </div>
    </>
  );
};
