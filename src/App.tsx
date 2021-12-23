import React, { useEffect, useState } from "react";
import "./App.css";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { default as axios } from "axios";
import * as config from "./config.json";

interface IToDoList {
  toDo: string[],
  buy: string[],
  task: string[],
}

function App() {
  const [list, setToDo] = useState([] as string[]);

  useEffect(() => {
    (async () => {
      const { task } = await axios.get(`${config.serverURL}/toDoList`) as IToDoList;
      setToDo(task);
    })();
  }, []);


  const [description, setDescription] = useState('');

  const submit = () => {
    setToDo([...list, description]);
    setDescription('');
  };

  const remove = () => {
    console.log('Remove');
  };

  const SortableItem = SortableElement(({ value, i }: { value: string, i: number }) => {
    return (
      // <li>{value}</li>
      <div className="item">
        <div className="order">{i + 1}</div>
        <div className="description">{value}</div>
        <div className="action">
          <div className="remove" onClick={() => remove()}>X</div>
        </div>
      </div>
    );
  });

  const SortableList = SortableContainer(({ items }: { items: typeof list }) => {
    return (
      <div className="list">
        {items?.map((item, i) => {
          return (
            <SortableItem key={`item-${item}`} index={i} value={item} i={i} />
          );
        })}
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    setToDo((prevState) => arrayMoveImmutable(prevState, oldIndex, newIndex));
  };

  return (

    <div className="App">
      <div className="form">
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={submit}>Add</button>
      </div>
      <SortableList
        items={list}
        onSortEnd={onSortEnd}
        pressDelay={100}
        helperClass="helper"
      />
    </div>
  );
}

export default App;
