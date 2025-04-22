import { useState } from "react";
import css from "./Diet.module.scss";
import store from "store2";
import { Icon } from "../components/Icon";

const Diet = () => {
  const newItem = () => ({ id: crypto.randomUUID(), name: "", calories: "" });
  const storageIndex = "diet";

  // const testList = [{ id: "5d863fa6-b96c-492c-a9c2-7f0ad119e818", date: "12:28", name: "Frango Desfiado com Batata Doce", calories: 600 }];

  const [list, setList] = useState(store.get(storageIndex));

  const [currentItem, setCurrentItem] = useState(newItem());

  const onChange = ({ target: { name, value } }) => {
    if (!value) return;
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const add = () => {
    if (!currentItem.name || !currentItem.calories) return;
    const updatedList = [...list, currentItem];
    store.set(storageIndex, updatedList);
    setList(updatedList);
    setCurrentItem(newItem());
  };

  const edit = (id) => {
    console.log("id: ", id);
    const current = list.find((i) => (i.id = id));
    console.log("current: ", current);
    setCurrentItem(current);
  };

  const remove = (id) => {
    const updatedList = list.filter((e) => e.id !== id);
    store.set(storageIndex, updatedList);
    setList(updatedList);
  };

  return (
    <div className={css.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Calorias</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => {
            return (
              <tr key={item.id}>
                <td>
                  {item.id} {item.name}
                </td>
                <td>{item.calories}</td>
                <td>
                  <button onClick={() => edit(item.id)}>
                    <Icon name="Edit" />
                  </button>
                  <button onClick={() => remove(item.id)}>
                    <Icon name="Delete" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={css.add}>
        <input type="text" name="name" value={currentItem.name} onChange={onChange} placeholder="Nome" />
        <input type="text" name="calories" value={currentItem.calories} onChange={onChange} placeholder="Calorias" />
        <button onClick={add}>Add</button>
      </div>
    </div>
  );
};

export default Diet;
