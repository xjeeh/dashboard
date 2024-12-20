import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Container } from "./style";
import configs from "../../config.json";

interface IDiet {
  id?: string;
  date: Date;
  name: string;
  calories: number;
}

const Diet = () => {
  const [list, setList] = useState([] as IDiet[]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${configs.serverURL}/db?collection=diet`);
      setList(data);
    })();
  }, []);

  return (
    <Container>
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
      <div className="add">
        <input type="text" placeholder="Nome" />
        <input type="text" placeholder="Calorias" />
        <button>Add</button>
      </div>
    </Container>
  );
};

export default Diet;
