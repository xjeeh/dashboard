import { Icon } from "./Icon";
import css from "./ToDo.module.scss";
import useKeypress from "react-use-keypress";
import ToDoItem from "./ToDoItem";
import { useEffect, useRef, useState } from "react";
import store from "store2";
import update from "immutability-helper";
import classNames from "classnames";
import ProgressBar from "./ProgressBar";
// import YearProgessBar from "./YearProgressBar";

const ToDoList = ({ category }) => {
  const newTodo = () => ({
    id: crypto.randomUUID(),
    description: "",
    finished: false,
    priority: false,
  });

  const [list, setList] = useState(() => {
    const allData = store("list") || {};
    return allData[category.storageIndex]?.list || [];
  });
  const [currentTodo, setCurrentTodo] = useState(newTodo());
  const [isEditing, setIsEditing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showCompleted, setShowCompleted] = useState(() => {
    const allData = store("list") || {};
    return allData[category.storageIndex]?.showCompleted ?? true;
  });

  const [filter, setFilter] = useState("");
  const [showFilter, setShowFilter] = useState(true);

  const descriptionInputRef = useRef(null);

  useEffect(() => {
    const allData = store("list") || {};
    const categoryData = allData[category.storageIndex] || {
      list: [],
      backup: [],
      showCompleted: false,
    };
    const filteredList = categoryData.list.filter((item) =>
      item.description.toLowerCase().includes(filter.toLowerCase())
    );
    setList(filteredList);
  }, [filter, category.storageIndex]);

  const getVisualIndex = (index) => {
    let visualIndex = 0;
    for (let i = 0; i < index; i++) {
      if (list[i] && (!list[i].finished || showCompleted)) {
        visualIndex++;
      }
    }
    return visualIndex;
  };

  const onChange = ({ target: { value } }) =>
    setCurrentTodo((prev) => ({ ...prev, description: value }));

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

    const allData = store("list") || {};
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      list: updatedList,
    };
    store("list", allData);

    clearForm();
  };

  const togglePriority = (index, e) => {
    e.stopPropagation();
    const updatedList = [...list];
    updatedList[index].priority = !updatedList[index].priority;
    setList(updatedList);

    const allData = store("list") || {};
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      list: updatedList,
    };
    store("list", allData);
  };

  const edit = (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    descriptionInputRef.current.focus();

    setIsEditing(true);
    setCurrentTodo({ ...list[index] });
  };

  const move = (id, atIndex, sourceList) => {
    const { item, index } = find(id);

    // If the item is from a different list, handle cross-list movement
    if (sourceList && sourceList !== category.storageIndex) {
      moveBetweenLists(id, sourceList);
      return;
    }

    const updatedList = update(list, {
      $splice: [
        [index, 1],
        [atIndex, 0, item],
      ],
    });
    setList(updatedList);

    const allData = store("list") || {};
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      list: updatedList,
    };
    store("list", allData);
  };

  const moveBetweenLists = (id, sourceList) => {
    const allData = store("list") || {};
    const sourceData = allData[sourceList];

    if (!sourceData || !sourceData.list) return;

    // Find the item in the source list
    const sourceItem = sourceData.list.find((item) => item.id === id);
    if (!sourceItem) return;

    // Remove from source list
    const updatedSourceList = sourceData.list.filter((item) => item.id !== id);

    // Remove from current list if it exists (to prevent duplicates)
    const updatedCurrentList = list.filter((item) => item.id !== id);

    // Add to current list at the end
    updatedCurrentList.push({ ...sourceItem });

    // Update source list
    allData[sourceList] = {
      ...allData[sourceList],
      list: updatedSourceList,
    };

    // Update current list
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      list: updatedCurrentList,
    };

    // Update both lists in storage
    store("list", allData);
    setList(updatedCurrentList);
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

  const toggleShowCompleted = () => {
    const newValue = !showCompleted;
    setShowCompleted(newValue);

    const allData = store("list") || {};
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      showCompleted: newValue,
    };
    store("list", allData);
  };

  const save = () => {
    if (!currentTodo.description) return;
    const updatedList = isEditing
      ? list.map((item) => (item.id === currentTodo.id ? currentTodo : item))
      : [...list, { ...currentTodo, finished: false }];
    setList(updatedList);

    const allData = store("list") || {};
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      list: updatedList,
    };
    store("list", allData);

    clearForm();
  };

  const remove = (index, e) => {
    e.stopPropagation();
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);

    const allData = store("list") || {};
    allData[category.storageIndex] = {
      ...allData[category.storageIndex],
      list: updatedList,
    };
    store("list", allData);

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
          <input
            className={css.description}
            ref={descriptionInputRef}
            type="text"
            placeholder="Add a new item"
            value={currentTodo.description}
            onChange={onChange}
            onKeyDown={trySubmit}
          />
          <button className={css.add} onClick={save}>
            <Icon name={isEditing ? "Edit" : "Add"} color="white" />
          </button>
          <div className={css.filter}>
            {showFilter && (
              <input
                type="text"
                placeholder="Filter"
                value={filter}
                onChange={({ target: { value } }) => setFilter(value)}
              />
            )}
            <button onClick={toggleFilterVisibility}>
              <Icon name={showFilter ? "Close" : "FilterList"} color="white" />
            </button>
            <button onClick={toggleShowCompleted}>
              <Icon name={showCompleted ? "Visibility" : "VisibilityOff"} color="white" />
            </button>
          </div>
        </div>
        <div className={css.items}>
          {list.length > 0 &&
            list.map(
              (item, i) =>
                (!item.finished || showCompleted) && (
                  <ToDoItem
                    storageIndex={category.storageIndex}
                    currentTodo={currentTodo}
                    key={item.id}
                    index={i}
                    visualIndex={getVisualIndex(i)}
                    item={item}
                    move={move}
                    find={find}
                    onToggleFinished={toggleFinished}
                    onTogglePriority={togglePriority}
                    edit={edit}
                    remove={remove}
                  />
                )
            )}
          {list.length <= 0 && <div className={css.empty}>No items</div>}
        </div>
        <ProgressBar
          progress={progress}
          label={
            <>
              <b>{`${progress.current}`}</b> of <b>{`${progress.total}`}</b> tasks done{" "}
              <b>({progress.percent.toFixed()}%</b>)
            </>
          }
        />

        {/* <YearProgessBar /> */}
      </div>
    </div>
  );
};

export default ToDoList;
