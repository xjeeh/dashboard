import { Icon } from "./Icon";
import css from "./ToDo.module.scss";
import useKeypress from "react-use-keypress";
import ToDoItem from "./ToDoItem";
import { useState } from "react";
import store from "store2";

const ToDoList = ({ category }) => {
  const newTodo = () => ({ id: crypto.randomUUID(), order: list.length, description: "", finished: false, priority: false });

  const storageIndex = `list-${category.storageIndex}`;
  const storageBackupIndex = `${storageIndex}-backup`;

  const [list, setList] = useState(store(storageIndex) || []);
  const [currentTodo, setCurrentTodo] = useState(newTodo());
  const [isEditing, setIsEditing] = useState(false);

  const onChange = ({ target: { value } }) => setCurrentTodo((prev) => ({ ...prev, description: value }));

  const trySubmit = (e) => (e.key === "Enter" ? save() : null);

  const clearForm = () => {
    setCurrentTodo(newTodo());
    setIsEditing(false);
  };

  useKeypress("Escape", () => {
    if (!isEditing) return;
    setCurrentTodo(newTodo());
    clearForm();
  });

  const toggleFinished = (index, e) => {
    e.stopPropagation();
    const updatedList = [...list];
    updatedList[index].finished = e.target.checked;
    setList(updatedList);
    store(storageIndex, updatedList);
    clearForm();
  };

  const togglePriority = (index, e) => {
    console.log("togglePriority", e, index);
    e.stopPropagation();
    const updatedList = [...list];
    updatedList[index].priority = !updatedList[index].priority;
    setList(updatedList);
    store(storageIndex, updatedList);
  };

  const edit = (index, e) => {
    console.log("edit", index, e);
    e.stopPropagation();
    setIsEditing(true);
    setCurrentTodo({ ...list[index] });
  };

  const move = (fromIndex, toIndex) => {
    const updatedList = [...list];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setList(updatedList);
    store(storageIndex, updatedList);
  };

  const save = () => {
    if (!currentTodo.description) return;
    const updatedList = isEditing ? list.map((item) => (item.id === currentTodo.id ? currentTodo : item)) : [...list, { ...currentTodo, finished: false, order: list.length }];
    setList(updatedList);
    store(storageIndex, updatedList);
    clearForm();
  };

  const remove = (index, e) => {
    e.stopPropagation();
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    store(storageIndex, updatedList);
    clearForm();
  };

  const backup = () => {
    store(storageBackupIndex, store(storageIndex));
    console.warn("Backup done");
  };

  const restore = () => {
    store(storageIndex, store(storageBackupIndex));
    setList(store(storageBackupIndex));
    console.warn("Restore done");
  };

  return (
    <div className={css.list}>
      <div className={css.todo}>
        <div className={css.category} style={{ backgroundColor: category.color }}>
          <Icon name={category.icon} color="white" />
          <span>{category.name}</span>
        </div>

        <div className={css.form}>
          <input className={css.description} type="text" placeholder="Add a new item" value={currentTodo.description} onChange={onChange} onKeyDown={trySubmit} />
          <button className={css.add} onClick={save}>
            <Icon name={isEditing ? "Edit" : "Add"} color="white" />
          </button>
          <button onClick={restore} className={css.restore} title="Restore backup">
            <Icon name="CloudDownload" />
          </button>
          <button onClick={backup} className={css.backup} title="Save Backup">
            <Icon name="CloudUpload" />
          </button>
        </div>

        <div className={css.items}>
          {list.length > 0 && list.map((item, i) => <ToDoItem currentTodo={currentTodo} key={item.id} index={i} item={item} move={move} onToggleFinished={toggleFinished} onTogglePriority={togglePriority} edit={edit} remove={remove} />)}
          {list.length <= 0 && <div className={css.empty}>No items</div>}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
