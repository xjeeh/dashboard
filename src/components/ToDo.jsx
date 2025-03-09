import { useState } from "react";
import "./ToDo";
import css from "./ToDo.module.scss";

import { ArrowDropUp, ArrowDropDown, Clear } from "@mui/icons-material";
import store from "store2";
import { Icon } from "./Icon";

const Todo = () => {
  const [list, setList] = useState(store("todo"));
  // const [list, setList] = useState([
  //   { id: "ff8b6f07-de00-48f3-85d7-e0f0ac675668", order: 0, description: "test", finished: false },
  //   { id: "56e87405-d9c4-4b65-a4b2-4d112fae83ac", order: 1, description: "test2", finished: false },
  // ]);
  const [todo, setTodo] = useState({ order: list.length, description: "", finished: false });

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

  const onChange = ({ target: { value } }) => setTodo((prevState) => ({ ...prevState, description: value }));

  const onToggleFinished = async ({ target: { checked } }, index) => {
    const updatedList = [...list];
    updatedList[index].finished = checked;
    setList(updatedList);
    store("todo", updatedList);
  };

  const add = async () => {
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

  const reorder = (direction, index) => {
    const updatedList = [...list];
    const item = updatedList[index];
    updatedList[index] = updatedList[index + (direction === "up" ? -1 : 1)];
    updatedList[index + (direction === "up" ? -1 : 1)] = item;
    setList(updatedList);
    store("todo", updatedList);
  };

  const remove = (index) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    store("todo", updatedList);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.tabs}>
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
        <div className={css.list}>
          <div className={css.new}>
            <>
              <div className={css.order}></div>
              <div className={css.description}>
                <input type="text" placeholder="Add a new item" value={todo.description} onChange={onChange} />
              </div>
              <button className={css.add} onClick={add}>
                {<Icon name={"Add"} color="white" />}
              </button>
            </>
          </div>
          {list?.map((item, i) => {
            const { order, description, finished } = item;
            return (
              <div className={css.item} key={i}>
                <div className={css.finished}>
                  <input type="checkbox" checked={finished} onChange={(e) => onToggleFinished(e, i)} />
                </div>
                <div className={css.order}>{order + 1}</div>
                <div className={css.description}>{description}</div>
                <div className={css.action}>
                  {i > 0 && <ArrowDropUp onClick={() => reorder("up", i)} />}
                  {i < list.length - 1 && <ArrowDropDown onClick={() => reorder("down", i)} />}
                  <Clear onClick={() => remove(i)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Todo;
