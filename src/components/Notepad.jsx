import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import css from "./Notepad.module.scss";
import classNames from "classnames";
import store from "store2";

export const Notepad = () => {
  const storeIndex = "notepad-daily";
  const [notepad, setNotepad] = useState(
    store.get(storeIndex) || {
      x: "20px",
      y: "20px",
      width: "400px",
      height: "500px",
      isMinimized: false,
      isClosed: false,
      text: "",
    }
  );

  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    store.set(storeIndex, notepad);
  }, [notepad]);

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setNotepad((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const close = (e) => {
    e.stopPropagation();
    setNotepad((prev) => ({ ...prev, isClosed: !prev.isClosed }));
  };

  const handleSetText = ({ target }) => {
    setNotepad((prev) => ({ ...prev, text: target.value }));
  };

  const dragStart = (e) => {
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
    <div
      ref={ref}
      style={{ left: x, top: y, width: width, height: height }}
      className={classNames(css.wrapper, css.darkMode, {
        [css.minimized]: isMinimized,
        [css.closed]: isClosed,
      })}
      draggable="true"
      onDragStart={dragStart}
      onDrag={dragNote}
    >
      <div className={css.windowActions} onClick={toggleMinimize}>
        <span className={css.title}>Notepad</span>
        <Icon name={isMinimized ? "Crop32" : "Minimize"} color="white" />
        <Icon name="Close" color="red" onClick={() => close()} />
      </div>
      <textarea value={text} onChange={handleSetText} spellCheck="false"></textarea>
    </div>
  );
};
