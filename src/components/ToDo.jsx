import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "store2";
import { Icon } from "./Icon";
import css from "./ToDo.module.scss";
import useKeypress from "react-use-keypress";
import ToDoItem from "./ToDoItem";

const Todo = () => {
  const newTodo = () => ({ id: crypto.randomUUID(), order: list.length, description: "", finished: false, priority: false });

  const [list, setList] = useState(store("todo") || []);
  const [currentTodo, setCurrentTodo] = useState(newTodo());
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    {
      id: "d417ef6b-2dc1-484e-ba90-6d8de5262e49",
      name: "To Do",
      icon: "List",
      color: "#3498DB",
    },
    {
      id: "7f64e44f-cc3b-4f25-b959-fc25a2710412",
      name: "To Buy",
      icon: "ShoppingCart",
      color: "#E67E22",
    },
  ];

  const clearForm = () => {
    setCurrentTodo(newTodo());
    setIsEditing(false);
  };

  useKeypress("Escape", () => {
    if (!isEditing) return;
    setCurrentTodo(newTodo());
    clearForm();
  });

  const onChange = ({ target: { value } }) => setCurrentTodo((prev) => ({ ...prev, description: value }));

  const trySubmit = (e) => (e.key === "Enter" ? save() : null);

  const toggleFinished = (index, e) => {
    e.stopPropagation();
    const updatedList = [...list];
    updatedList[index].finished = e.target.checked;
    setList(updatedList);
    store("todo", updatedList);
    clearForm();
  };

  const togglePriority = (index, e) => {
    console.log("togglePriority", e, index);
    e.stopPropagation();
    const updatedList = [...list];
    updatedList[index].priority = !updatedList[index].priority;
    setList(updatedList);
    store("todo", updatedList);
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
    store("todo", updatedList);
  };

  const save = () => {
    const updatedList = isEditing ? list.map((item) => (item.id === currentTodo.id ? currentTodo : item)) : [...list, { ...currentTodo, finished: false, order: list.length }];
    setList(updatedList);
    store("todo", updatedList);
    clearForm();
  };

  const remove = (index, e) => {
    e.stopPropagation();
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    store("todo", updatedList);
    clearForm();
  };

  const backup = () => {
    store("todo-backup", store("todo"));
    console.warn("Backup done");
  };

  const restore = () => {
    store("todo", store("todo-backup"));
    setList(store("todo-backup"));
    console.warn("Restore done");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.wrapper}>
        <div className={css.todo}>
          <div className={css.categories}>
            <select>
              {categories.map((item) => {
                const { id, name } = item;
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
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

          <div className={css.list}>
            {list.length > 0 && list.map((item, i) => <ToDoItem currentTodo={currentTodo} key={item.id} index={i} item={item} move={move} onToggleFinished={toggleFinished} onTogglePriority={togglePriority} edit={edit} remove={remove} />)}
            {list.length <= 0 && <div className={css.empty}>No items</div>}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Todo;
