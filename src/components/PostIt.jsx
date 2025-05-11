import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import css from "./PostIt.module.scss";
import classNames from "classnames";
import store from "store2";

export const PostIt = () => {
  const storeIndex = "postIt-daily";
  const [postIt, setPostIt] = useState(
    store.get(storeIndex) || {
      x: "0px",
      y: "50px",
      width: "300px",
      height: "200px",
      isMinimized: false,
      isClosed: false,
      text: "",
    }
  );

  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    store.set(storeIndex, postIt);
  }, [postIt]);

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setPostIt((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const close = (e) => {
    e.stopPropagation();
    setPostIt((prev) => ({ ...prev, isClosed: !prev.isClosed }));
  };

  const handleSetText = ({ target }) => {
    setPostIt((prev) => ({ ...prev, text: target.value }));
  };

  const dragStart = (e) => {
    const rect = ref.current.getBoundingClientRect();
    offset.current.x = e.clientX - rect.left;
    offset.current.y = e.clientY - rect.top;

    e.dataTransfer.setData("text/plain", "dragging");

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

    setPostIt((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const { x, y, isMinimized, isClosed, text, width, height } = postIt;

  return (
    <div
      ref={ref}
      style={{ left: x, top: y, width: width, height: height }}
      className={classNames(css.wrapper, {
        [css.minimized]: isMinimized,
        [css.closed]: isClosed,
      })}
      draggable="true"
      onDragStart={dragStart}
      onDrag={dragNote}
    >
      <div className={css.windowActions} onClick={toggleMinimize}>
        <Icon name={isMinimized ? "Crop32" : "Minimize"} color="black" />
        <Icon name="Close" color="red" onClick={() => close()} />
      </div>
      <textarea value={text} onChange={handleSetText} spellCheck="false"></textarea>
    </div>
  );
};
