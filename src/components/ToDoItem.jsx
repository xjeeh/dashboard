import { useRef } from "react";
import { Icon } from "./Icon";
import { useDrag, useDrop } from "react-dnd";
import classNames from "classnames";
import css from "./ToDo.module.scss";

const ToDoItem = ({
  storageIndex,
  currentTodo,
  item,
  index,
  visualIndex,
  move,
  find,
  onToggleFinished,
  onTogglePriority,
  edit,
  remove,
}) => {
  const ref = useRef(null);

  const originalIndex = find(item.id).index;
  const { id } = item;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ITEM",
      item: { id, originalIndex, sourceList: storageIndex },
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
    [id, originalIndex, move, storageIndex]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "ITEM",
      hover({ id: draggedId, sourceList }) {
        if (draggedId !== id) {
          const { index: overIndex } = find(id);
          move(draggedId, overIndex, sourceList);
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
        <input
          type="checkbox"
          checked={item.finished}
          onChange={(e) => onToggleFinished(index, e)}
        />
      </div>
      <div
        className={css.description}
        onDoubleClick={(e) => edit(index, e)}
        onContextMenu={(e) => edit(index, e)}
      >
        {visualIndex + 1} - {item.description}
      </div>
      <div className={css.action}>
        <Icon
          name="PriorityHigh"
          onClick={(e) => onTogglePriority(index, e)}
          color="#ffae00"
          title="Toggle Priority"
        />
        <Icon name="Clear" onClick={(e) => remove(index, e)} title="Remove" color="red" />
      </div>
    </div>
  );
};

export default ToDoItem;
