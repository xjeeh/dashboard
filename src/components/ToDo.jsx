import { useRef, useState } from "react";
import "./ToDo";
import css from "./ToDo.module.scss";

import { Clear } from "@mui/icons-material";
import store from "store2";
import { Icon } from "./Icon";
import { Draggable } from "react-drag-reorder";

const Todo = () => {
  const [list, setList] = useState(store("todo"));
  // const [list, setList] = useState([
  //   { id: "ff8b6f07-de00-48f3-85d7-e0f0ac675668", order: 0, description: "test", finished: false },
  //   { id: "56e87405-d9c4-4b65-a4b2-4d112fae83ac", order: 1, description: "test2", finished: false },
  // ]);
  const [todo, setTodo] = useState({ order: list.length, description: "", finished: false });

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

  const listRef = useRef(null);

  const onChange = ({ target: { value } }) => setTodo((prevState) => ({ ...prevState, description: value }));

  const onToggleFinished = async ({ target: { checked } }, index) => {
    const updatedList = [...list];
    updatedList[index].finished = checked;
    setList(updatedList);
    store("todo", updatedList);
  };

  const save = async () => {
    const newTodo = {
      id: crypto.randomUUID(),
      order: list.length,
      description: todo.description,
      finished: false,
    };
    const updatedList = [...list, newTodo];
    setList(updatedList);
    setTodo({ order: list.length, description: "", finished: false });
    store("todo", updatedList);
  };

  const drag = (currentPos, newPos) => {
    const updatedList = [...list];
    const item = updatedList[currentPos];
    updatedList.splice(currentPos, 1);
    updatedList.splice(newPos, 0, item);
    setList(updatedList);
    store("todo", updatedList);
  };

  const edit = (index) => {
    setIsEditing(true);
    setTodo({
      order: list[index].order,
      description: list[index].description,
      finished: list[index].finished,
    });
  };

  const remove = (index) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    store("todo", updatedList);
  };

  return (
    <div className={css.wrapper}>
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

      <div className={css.todo}>
        <div className={css.form}>
          <>
            <div className={css.order}></div>
            <div className={css.description}>
              <input type="text" placeholder="Add a new item" value={todo.description} onChange={onChange} />
            </div>
            <button className={css.add} onClick={save}>
              {<Icon name={isEditing ? "Edit" : "Add"} color="white" />}
            </button>
          </>
        </div>

        <div className={css.list} ref={listRef}>
          <Draggable onPosChange={drag}>
            {list?.map((item, i) => {
              const { order, description, finished } = item;
              return (
                <div className={css.item} key={i} onClick={() => edit(i)}>
                  <div className={css.finished}>
                    <input type="checkbox" checked={finished} onChange={(e) => onToggleFinished(e, i)} />
                  </div>
                  <div className={css.order}>{order + 1}</div>
                  <div className={css.description}>{description}</div>
                  <div className={css.action}>
                    <Clear onClick={() => remove(i)} />
                  </div>
                </div>
              );
            })}
          </Draggable>
        </div>
      </div>
    </div>
  );
};

export default Todo;
