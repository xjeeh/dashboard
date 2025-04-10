import { useRef, useState } from "react";
import { Icon } from "./Icon";
import css from "./PostIt.module.scss";
import classNames from "classnames";
import store from "store2";

export const PostIt = () => {
  const [text, setText] = useState(store.get("postIt-daily"));

  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const ref = useRef(null);

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
  };

  const handleSetText = ({ target }) => {
    setText(target.value);
    store.set("postIt-daily", target.value);
  };

  let offsetX = 0;
  let offsetY = 0;

  const dragStart = (e) => {
    const rect = ref.current.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    e.dataTransfer.setData("text/plain", "dragging");

    // Esconde a imagem de drag padrão
    const img = new Image();
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEWZmZmILVbPAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const dragNote = (e) => {
    const x = e.pageX;
    const y = e.pageY;

    if (!x || !y) return;

    const note = ref.current;
    note.style.position = "absolute";
    note.style.left = `${x - offsetX}px`;
    note.style.top = `${y - offsetY}px`;
  };

  return (
    <div ref={ref} className={classNames(css.wrapper, { [css.minimized]: isMinimized, [css.closed]: isClosed })} draggable="true" onDragStart={dragStart} onDrag={dragNote}>
      <div className={css.windowActions}>
        <Icon name={isMinimized ? "Crop32" : "Minimize"} color="black" onClick={toggleMinimize} />
        <Icon name="Close" color="red" onClick={() => setIsClosed(true)} />
      </div>
      <textarea value={text} onChange={handleSetText} spellCheck="false"></textarea>
    </div>
  );
};
