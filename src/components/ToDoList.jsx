import { Icon } from "./Icon";
import css from "./ToDo.module.scss";
import useKeypress from "react-use-keypress";
import ToDoItem from "./ToDoItem";
import { useEffect, useState } from "react";
import store from "store2";
import update from "immutability-helper";
import classNames from "classnames";

const ToDoList = ({ category }) => {
  const newTodo = () => ({ id: crypto.randomUUID(), order: list.length, description: "", finished: false, priority: false });

  const storageIndex = `list-${category.storageIndex}`;

  const [list, setList] = useState(store(storageIndex) || []);
  const [currentTodo, setCurrentTodo] = useState(newTodo());
  const [isEditing, setIsEditing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const [filter, setFilter] = useState("");
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    const filteredList = store(storageIndex).filter((item) => item.description.toLowerCase().includes(filter.toLowerCase()));
    setList(filteredList);
  }, [filter, storageIndex]);

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
    e.stopPropagation();
    const updatedList = [...list];
    updatedList[index].priority = !updatedList[index].priority;
    setList(updatedList);
    store(storageIndex, updatedList);
  };

  const edit = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setCurrentTodo({ ...list[index] });
  };

  const move = (id, atIndex) => {
    const { item, index } = find(id);
    const updatedList = update(list, {
      $splice: [
        [index, 1],
        [atIndex, 0, item],
      ],
    });
    setList(updatedList);
    store(storageIndex, updatedList);
  };

  const find = (id) => {
    const item = list.filter((c) => `${c.id}` === id)[0];
    return {
      item,
      index: list.indexOf(item),
    };
  };

  const toggleFilterVisibility = () => {
    setShowFilter((prev) => !prev);
    if (showFilter) setFilter("");
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

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
  };

  const progress = {
    current: list.filter((i) => i.finished).length,
    total: list.length,
  };

  progress.percent = (progress.current / progress.total) * 100;

  return (
    <div className={classNames(css.list, { [css.closed]: isClosed })}>
      <div className={css.category} onClick={toggleMinimize} style={{ color: category.color }}>
        <Icon name={category.icon} color="white" />
        <span>{category.name}</span>
        <div className={css.windowActions}>
          <Icon name={isMinimized ? "Crop32" : "Minimize"} color="white" onClick={toggleMinimize} />
          <Icon name="Close" color="red" onClick={() => setIsClosed(true)} />
        </div>
      </div>

      <div className={classNames(css.body, { [css.minimized]: isMinimized })}>
        <div className={css.form}>
          <input className={css.description} type="text" placeholder="Add a new item" value={currentTodo.description} onChange={onChange} onKeyDown={trySubmit} />
          <button className={css.add} onClick={save}>
            <Icon name={isEditing ? "Edit" : "Add"} color="white" />
          </button>
          <div className={css.filter}>
            {showFilter && <input type="text" placeholder="Filter values" value={filter} onChange={({ target: { value } }) => setFilter(value)} />}
            <button onClick={toggleFilterVisibility}>
              <Icon name={showFilter ? "Close" : "FilterList"} color="white" />
            </button>
          </div>
        </div>
        <div className={css.items}>
          {list.length > 0 && list.map((item, i) => <ToDoItem storageIndex={storageIndex} currentTodo={currentTodo} key={item.id} index={i} item={item} move={move} find={find} onToggleFinished={toggleFinished} onTogglePriority={togglePriority} edit={edit} remove={remove} />)}
          {list.length <= 0 && <div className={css.empty}>No items</div>}
        </div>
        <div className={css.progress}>
          <div className={css.total}>
            <div className={css.current} style={{ width: `${progress.percent}%` }} />
            <div className={css.label}>
              <b>{`${progress.current}`}</b> of <b>{`${progress.total}`}</b> tasks done <b>({progress.percent.toFixed()}%</b>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
