import { useState, useEffect } from "react";
import css from "./Diet.module.scss";
import store from "store2";
import { Icon } from "../components/Icon";

// Função utilitária para parsear CSV simples
function parseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = values[i]?.replace(/(^")|("$)/g, "").trim()));
    return obj;
  });
}

// Componente de Autocomplete
function Autocomplete({ options, value, onChange, onSelect, placeholder }) {
  const [input, setInput] = useState(value || "");
  const [show, setShow] = useState(false);
  const filtered = options.filter((opt) => opt.toLowerCase().includes(input.toLowerCase()));

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={(e) => {
          setInput(e.target.value);
          onChange && onChange(e);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 100)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1.5px solid #9ba8ea",
          fontSize: 15,
          minWidth: 120,
          background: "#23243a",
          color: "white",
          width: "100%",
        }}
      />
      {show && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 10,
            background: "#23243a",
            color: "white",
            width: "100%",
            maxHeight: 180,
            overflowY: "auto",
            border: "1px solid #9ba8ea",
            borderRadius: 8,
            margin: 0,
            padding: 0,
            listStyle: "none",
            boxShadow: "0 2px 8px #0008",
          }}
        >
          {filtered.slice(0, 10).map((opt, i) => (
            <li
              key={i}
              style={{ padding: 8, cursor: "pointer" }}
              onMouseDown={() => {
                onSelect(opt);
                setShow(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const Diet = () => {
  const newItem = () => ({
    id: crypto.randomUUID(),
    name: "",
    calories: "",
    protein: "",
    carb: "",
    fat: "",
    fiber: "",
  });

  const [selectedDate, setSelectedDate] = useState(getToday());
  const storageIndex = (date) => `diet-${date}`;

  const [list, setList] = useState(store.get(storageIndex(getToday())) || []);
  const [currentItem, setCurrentItem] = useState(newItem());

  // Estado para os componentes do CSV
  const [components, setComponents] = useState([]);

  // Carregar e parsear CSV
  useEffect(() => {
    fetch("/src/assets/components.csv")
      .then((res) => res.text())
      .then((text) => {
        const arr = parseCSV(text).filter((e) => e.Nome);
        setComponents(arr);
      });
  }, []);

  // Soma total de calorias do dia
  const totalCalories = list.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const totalProtein = list.reduce((sum, item) => sum + Number(item.protein || 0), 0);
  const totalCarb = list.reduce((sum, item) => sum + Number(item.carb || 0), 0);
  const totalFat = list.reduce((sum, item) => sum + Number(item.fat || 0), 0);
  const totalFiber = list.reduce((sum, item) => sum + Number(item.fiber || 0), 0);

  // Atualiza a lista quando o dia selecionado muda
  const updateListForDate = (date) => {
    setList(store.get(storageIndex(date)) || []);
    setCurrentItem(newItem());
  };

  const onChange = ({ target: { name, value } }) => {
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // Quando seleciona um item do autocomplete
  const onSelectComponent = (nome) => {
    const comp = components.find((c) => c.Nome === nome);
    setCurrentItem((prev) => ({
      ...prev,
      name: nome,
      calories: comp?.Caloria || "",
      protein: comp?.Proteina || "",
      carb: comp?.["Carboidrato L."] || "",
      fat: comp?.Gordura || "",
      fiber: comp?.Fibra || "",
    }));
  };

  const add = () => {
    if (!currentItem.name || !currentItem.calories) return;
    const updatedList = [...list, currentItem];
    store.set(storageIndex(selectedDate), updatedList);
    setList(updatedList);
    setCurrentItem(newItem());
  };

  const edit = (id) => {
    const current = list.find((i) => i.id === id);
    setCurrentItem(current);
  };

  const remove = (id) => {
    const updatedList = list.filter((e) => e.id !== id);
    store.set(storageIndex(selectedDate), updatedList);
    setList(updatedList);
  };

  const goToPrevDay = () => {
    const prevDate = addDays(selectedDate, -1);
    setSelectedDate(prevDate);
    updateListForDate(prevDate);
  };

  const goToNextDay = () => {
    const nextDate = addDays(selectedDate, 1);
    setSelectedDate(nextDate);
    updateListForDate(nextDate);
  };

  return (
    <div
      className={css.wrapper}
      style={{
        maxWidth: 480,
        margin: "32px auto",
        background: "#444876",
        borderRadius: 16,
        boxShadow: "0 2px 16px #0003",
        padding: 24,
        color: "white",
      }}
    >
      <div
        className={css.dateNav}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          gap: 8,
        }}
      >
        <button
          onClick={goToPrevDay}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            transition: "background 0.2s",
            color: "white",
          }}
          title="Dia anterior"
          onMouseOver={(e) => (e.currentTarget.style.background = "#393c5a")}
          onMouseOut={(e) => (e.currentTarget.style.background = "none")}
        >
          <Icon name="ChevronLeft" color="white" />
        </button>
        <span
          style={{
            margin: "0 16px",
            fontWeight: "bold",
            padding: "4px 16px",
            borderRadius: 12,
            background: selectedDate === getToday() ? "#393c5a" : "transparent",
            color: selectedDate === getToday() ? "#9ba8ea" : "#fff",
            border: selectedDate === getToday() ? "2px solid #9ba8ea" : "1px solid #393c5a",
            letterSpacing: selectedDate === getToday() ? "0.5px" : "normal",
            transition: "all 0.2s",
            minWidth: 120,
            textAlign: "center",
          }}
        >
          {selectedDate}
        </span>
        {selectedDate !== getToday() && (
          <button
            onClick={goToNextDay}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              transition: "background 0.2s",
              color: "white",
            }}
            title="Próximo dia"
            onMouseOver={(e) => (e.currentTarget.style.background = "#393c5a")}
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            <Icon name="ChevronRight" color="white" />
          </button>
        )}
        {selectedDate !== getToday() && (
          <button
            onClick={() => {
              setSelectedDate(getToday());
              updateListForDate(getToday());
            }}
            style={{
              marginLeft: 16,
              background: "#9ba8ea",
              color: "#23243a",
              border: "none",
              borderRadius: 6,
              padding: "4px 14px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 8px #0002",
              transition: "background 0.2s",
            }}
            title="Voltar para hoje"
          >
            Hoje
          </button>
        )}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          background: "#393c5a",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 4px #0002",
          color: "white",
        }}
      >
        <thead>
          <tr style={{ background: "#23243a", color: "#9ba8ea" }}>
            <th style={{ padding: "10px 8px", textAlign: "left", fontWeight: 700 }}>Nome</th>
            <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>Calorias</th>
            <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>Proteína</th>
            <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>
              Carb. Livre
            </th>
            <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>Gordura</th>
            <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>Fibra</th>
            <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => {
            return (
              <tr key={item.id} style={{ borderBottom: "1px solid #444876" }}>
                <td style={{ padding: "8px 8px", fontSize: 15 }}>{item.name}</td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 15 }}>
                  {item.calories}
                </td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 15 }}>
                  {item.protein}
                </td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 15 }}>
                  {item.carb}
                </td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 15 }}>{item.fat}</td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 15 }}>
                  {item.fiber}
                </td>
                <td style={{ padding: "8px 8px", textAlign: "center" }}>
                  <button
                    onClick={() => edit(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: 8,
                    }}
                    title="Editar"
                  >
                    <Icon name="Edit" color="#9ba8ea" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    title="Remover"
                  >
                    <Icon name="Delete" color="#e74c3c" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "#2f2f2f", fontWeight: 700 }}>
            <td style={{ padding: "10px 8px", textAlign: "right", color: "#9ba8ea" }}>Total</td>
            <td style={{ padding: "10px 8px", textAlign: "right", color: "#78b1b8", fontSize: 16 }}>
              {totalCalories}
            </td>
            <td style={{ padding: "10px 8px", textAlign: "right", color: "#78b1b8", fontSize: 16 }}>
              {totalProtein}
            </td>
            <td style={{ padding: "10px 8px", textAlign: "right", color: "#78b1b8", fontSize: 16 }}>
              {totalCarb}
            </td>
            <td style={{ padding: "10px 8px", textAlign: "right", color: "#78b1b8", fontSize: 16 }}>
              {totalFat}
            </td>
            <td style={{ padding: "10px 8px", textAlign: "right", color: "#78b1b8", fontSize: 16 }}>
              {totalFiber}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div
        className={css.add}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 24,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: 2, minWidth: 180 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#9ba8ea" }}>
            Nome
          </label>
          <Autocomplete
            options={[...new Set(components.map((c) => c.Nome).filter(Boolean))]}
            value={currentItem.name}
            onChange={(e) => onChange({ target: { name: "name", value: e.target.value } })}
            onSelect={onSelectComponent}
            placeholder="Nome"
          />
        </div>
        <div style={{ minWidth: 90 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#9ba8ea" }}>
            Calorias
          </label>
          <input
            type="number"
            name="calories"
            value={currentItem.calories}
            onChange={onChange}
            placeholder="Calorias"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #9ba8ea",
              fontSize: 15,
              width: "100%",
              background: "#23243a",
              color: "white",
            }}
          />
        </div>
        <div style={{ minWidth: 90 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#9ba8ea" }}>
            Proteína
          </label>
          <input
            type="number"
            name="protein"
            value={currentItem.protein}
            onChange={onChange}
            placeholder="Proteína"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #9ba8ea",
              fontSize: 15,
              width: "100%",
              background: "#23243a",
              color: "white",
            }}
          />
        </div>
        <div style={{ minWidth: 90 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#9ba8ea" }}>
            Carb. Livre
          </label>
          <input
            type="number"
            name="carb"
            value={currentItem.carb}
            onChange={onChange}
            placeholder="Carb. Livre"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #9ba8ea",
              fontSize: 15,
              width: "100%",
              background: "#23243a",
              color: "white",
            }}
          />
        </div>
        <div style={{ minWidth: 90 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#9ba8ea" }}>
            Gordura
          </label>
          <input
            type="number"
            name="fat"
            value={currentItem.fat}
            onChange={onChange}
            placeholder="Gordura"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #9ba8ea",
              fontSize: 15,
              width: "100%",
              background: "#23243a",
              color: "white",
            }}
          />
        </div>
        <div style={{ minWidth: 90 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#9ba8ea" }}>
            Fibra
          </label>
          <input
            type="number"
            name="fiber"
            value={currentItem.fiber}
            onChange={onChange}
            placeholder="Fibra"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #9ba8ea",
              fontSize: 15,
              width: "100%",
              background: "#23243a",
              color: "white",
            }}
          />
        </div>
        <div style={{ alignSelf: "end", minWidth: 120 }}>
          <button
            onClick={add}
            style={{
              background: "#9ba8ea",
              color: "#23243a",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: "bold",
              fontSize: 15,
              boxShadow: "0 1px 4px #0001",
              cursor: "pointer",
              transition: "background 0.2s",
              width: "100%",
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diet;
