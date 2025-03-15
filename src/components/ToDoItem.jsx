import { useRef } from "react";
import { Icon } from "./Icon";
import { useDrag, useDrop } from "react-dnd";
import classNames from "classnames";
import css from "./ToDo.module.scss";

const ToDoItem = ({ storageIndex, currentTodo, item, index, move, find, onToggleFinished, onTogglePriority, edit, remove }) => {
  const ref = useRef(null);

  const originalIndex = find(item.id).index;
  const { id } = item;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: storageIndex,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          move(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, move]
  );

  const [, drop] = useDrop(
    () => ({
      accept: storageIndex,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = find(id);
          move(draggedId, overIndex);
        }
      },
    }),
    [find, move]
  );

  drag(drop(ref));

  const itemClass = classNames(css.item, {
    [css.editing]: currentTodo.id === item.id,
    [css.finished]: item.finished,
    [css.priority]: item.priority,
  });

  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={ref} className={itemClass} style={{ opacity }}>
      <div className={css.toggleFinished}>
        <input type="checkbox" checked={item.finished} onChange={(e) => onToggleFinished(index, e)} />
      </div>
      <div className={css.description} onDoubleClick={(e) => edit(index, e)} onContextMenu={(e) => edit(index, e)}>
        {index + 1} - {item.description}
      </div>
      <div className={css.action}>
        <Icon name="PriorityHigh" onClick={(e) => onTogglePriority(index, e)} color="#b76666" title="Toggle Priority" />
        <Icon name="Clear" onClick={(e) => remove(index, e)} title="Remove" />
      </div>
    </div>
  );
};

export default ToDoItem;
