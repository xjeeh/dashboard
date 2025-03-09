import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import css from "./Diet.module.scss";
import configs from "../config.json";

const Diet = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${configs.serverURL}/db?collection=diet`);
      setList(data);
    })();
  }, []);

  return (
    <div className={css.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Nome</th>
            <th>Caloria</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => {
            return (
              <tr key={item.id}>
                <td>{format(new Date(item.date), "HH:MM")}</td>
                <td>{item.name}</td>
                <td>{item.calories}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={css.add}>
        <input type="text" placeholder="Nome" />
        <input type="text" placeholder="Calorias" />
        <button>Add</button>
      </div>
    </div>
  );
};

export default Diet;
