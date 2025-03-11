import { useRef } from "react";
import { Icon } from "./Icon";
import { useDrag, useDrop } from "react-dnd";
import classNames from "classnames";
import css from "./ToDo.module.scss";

const ToDoItem = ({ currentTodo, item, index, move, onToggleFinished, onTogglePriority, edit, remove }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "TODO_ITEM",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        move(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, drag] = useDrag({ type: "TODO_ITEM", item: { index }, collect: (monitor) => ({ isDragging: monitor.isDragging() }) });

  drag(drop(ref));

  const itemClass = classNames(css.item, {
    [css.editing]: currentTodo.id === item.id,
    [css.finished]: item.finished,
    [css.priority]: item.priority,
  });

  return (
    <div ref={ref} className={itemClass}>
      <div className={css.toggleFinished}>
        <input type="checkbox" checked={item.finished} onChange={(e) => onToggleFinished(index, e)} />
      </div>
      <div className={css.description} onClick={(e) => edit(index, e)}>
        {index + 1} - {item.description}
      </div>
      <div className={css.action}>
        <Icon name="Warning" onClick={(e) => onTogglePriority(index, e)} color="#b76666" title="Toggle Priority" />
        <Icon name="Clear" onClick={(e) => remove(index, e)} title="Remove" />
      </div>
    </div>
  );
};

export default ToDoItem;
