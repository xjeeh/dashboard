import { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "store2";
import { Clear } from "@mui/icons-material";
import { Icon } from "./Icon";
import css from "./ToDo.module.scss";

const DraggableItem = ({ item, index, move, onToggleFinished, edit, remove }) => {
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

  return (
    <div ref={ref} className={css.item} onClick={() => edit(index)}>
      <div className={css.finished}>
        <input type="checkbox" checked={item.finished} onChange={(e) => onToggleFinished(e, index)} />
      </div>
      <div className={css.order}>{index + 1}</div>
      <div className={css.description}>{item.description}</div>
      <div className={css.action}>
        <Clear onClick={() => remove(index)} />
      </div>
    </div>
  );
};

const Todo = () => {
  const [list, setList] = useState(store("todo") || []);
  const [todo, setTodo] = useState({ id: crypto.randomUUID(), order: list.length, description: "", finished: false });
  const [isEditing, setIsEditing] = useState(false);

  const onChange = ({ target: { value } }) => setTodo((prev) => ({ ...prev, description: value }));

  const toggleFinished = (e, index) => {
    const updatedList = [...list];
    updatedList[index].finished = e.target.checked;
    setList(updatedList);
    store("todo", updatedList);
  };

  const edit = (index) => {
    setIsEditing(true);
    setTodo({ ...list[index] });
  };

  const move = (fromIndex, toIndex) => {
    const updatedList = [...list];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setList(updatedList);
    store("todo", updatedList);
  };

  const save = () => {
    const updatedList = isEditing ? list.map((item) => (item.id === todo.id ? todo : item)) : [...list, { ...todo, finished: false, order: list.length }];
    setList(updatedList);
    store("todo", updatedList);
    setTodo({ id: crypto.randomUUID(), order: 0, description: "", finished: false });
    setIsEditing(false);
  };

  const remove = (index) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    store("todo", updatedList);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.wrapper}>
        <div className={css.todo}>
          <div className={css.form}>
            <input type="text" placeholder="Add a new item" value={todo.description} onChange={onChange} />
            <button className={css.add} onClick={save}>
              <Icon name={isEditing ? "Edit" : "Add"} color="white" />
            </button>
          </div>

          <div className={css.list}>{list.length > 0 ? list.map((item, i) => <DraggableItem key={item.id} index={i} item={item} move={move} onToggleFinished={toggleFinished} edit={edit} remove={remove} />) : <div className={css.empty}>No items</div>}</div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Todo;
