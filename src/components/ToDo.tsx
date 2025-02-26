import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./ToDo";
import { default as axios } from "axios";
import configs from "../config.json";
import { Wrapper } from "./ToDo.module";

import { ArrowDropUp, ArrowDropDown, Clear } from "@mui/icons-material";
import { Icon, IconNames } from "./Icon";

interface ITodo {
  id?: string;
  order: number;
  description: string;
  finished: boolean;
}

const Todo = () => {
  const [list, setList] = useState([] as ITodo[]);
  const [todo, setTodo] = useState({
    order: 0,
    description: "",
    finished: false,
  });

  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${configs.serverURL}/db?collection=todo`);
      setList(data);
    })();
  }, []);

  const newRef = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;
    setTodo((prevState) => ({ ...prevState, description: value }));
  };

  const onToggleFinished = async (e: ChangeEvent<HTMLInputElement>, item: ITodo) => {
    const value = e.target?.checked;
    const newValue = { ...item, finished: value };
    const newList = list.map((i) => {
      if (i.id === item.id) return newValue;
      return i;
    });
    setList(newList);
    await axios.put(`${configs.serverURL}/todo/${item.id}`, {
      ...item,
      finished: value,
    });
  };

  const onMouseOver = () => {
    setShowNew(true);
  };

  const onMouseLeave = () => {
    const hasFocus = document.activeElement === newRef.current;
    if (!todo.description && !hasFocus) {
      setShowNew(false);
    }
  };

  const add = async () => {
    const newTodo = {
      order: list.length,
      description: todo.description,
      finished: false,
    };
    const updatedList = [...list, newTodo];
    await axios.post(`${configs.serverURL}/todo`, newTodo);
    setList(updatedList);
    setTodo((prevState) => ({ ...prevState, description: "" }));
  };

  const remove = () => {
    /* aaa */
  };

  const lists = [
    {
      id: "d417ef6b-2dc1-484e-ba90-6d8de5262e49",
      name: "ToDo",
      icon: "List",
      color: "#3498DB",
    },
    {
      id: "7f64e44f-cc3b-4f25-b959-fc25a2710412",
      name: "ToBuy",
      icon: "ShoppingCart",
      color: "#E67E22",
    },
  ];

  return (
    <Wrapper>
      <div className="tabs">
        {lists.map((item) => {
          const { id, name, icon, color } = item;
          return (
            <div className="tab selected" key={id}>
              <div className="icon">
                <Icon name={icon as IconNames} color={color} />
              </div>
              <div className="name">{name}</div>
            </div>
          );
        })}
        <div className="tab add">
          <Icon name={"AddCircle"} />
        </div>
      </div>
      <div className="todo">
        <div className="title">ToDo List</div>
        <div className="list">
          {list.map((item, i) => {
            const { order, description, finished } = item;
            return (
              <div className="item" key={i}>
                <div className="finished">
                  <input type="checkbox" checked={finished} onChange={(e) => onToggleFinished(e, item)} />
                </div>
                <div className="order">{order + 1}</div>
                <div className="description">{description}</div>
                <div className="action">
                  {i > 0 && <ArrowDropUp />}
                  {i < list.length - 1 && <ArrowDropDown />}
                  <Clear onClick={remove} />
                </div>
              </div>
            );
          })}
          <div className="new" onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
            {showNew && (
              <>
                <div className="order"></div>
                <div className="description">
                  <input ref={newRef} type="text" onBlur={onMouseLeave} value={todo.description} onChange={onChange} />
                </div>
                <button className="add" onClick={add}>
                  Add
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Todo;
