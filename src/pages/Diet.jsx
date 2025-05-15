import { useState, useEffect, useRef } from "react";
import css from "./Diet.module.scss";
import store from "store2";
import { Icon } from "../components/Icon";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

function getCurrentTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Substituir o Autocomplete por um select não editável
function SelectNome({ options, value, onSelect }) {
  return (
    <select
      value={value}
      onChange={(e) => onSelect(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #9ba8ea",
        fontSize: 15,
        width: "100%",
        background: "#23243a",
        color: "white",
      }}
    >
      <option value="">Selecione...</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// Novo: chave única para todas as dietas
const DIET_ALL_KEY = "diet-all";

// Função para obter todas as dietas
function getAllDiets() {
  return store.get(DIET_ALL_KEY) || {};
}
// Função para salvar todas as dietas
function setAllDiets(obj) {
  store.set(DIET_ALL_KEY, obj);
}
// Função para obter a lista de um dia
function getDietForDate(date) {
  const all = getAllDiets();
  return all[date] || [];
}
// Função para salvar a lista de um dia
function setDietForDate(date, list) {
  const all = getAllDiets();
  all[date] = list;
  setAllDiets(all);
}

// Componente para o item arrastável
const DraggableRow = ({ index, moveRow, children }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: "DIET_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "DIET_ITEM",
    hover: (draggedItem) => {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveRow(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <tr
      ref={ref}
      className={`${css.tableRow} ${isDragging ? css.dragging : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </tr>
  );
};

const Diet = () => {
  const newItem = () => ({
    id: crypto.randomUUID(),
    name: "",
    quantity: "",
    unit: "",
    calories: "",
    protein: "",
    carb: "",
    fat: "",
    fiber: "",
    time: getCurrentTime(),
  });

  const [selectedDate, setSelectedDate] = useState(getToday());

  const [list, setList] = useState(getDietForDate(getToday()));
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
    setList(getDietForDate(date));
    setCurrentItem({
      ...newItem(),
      time: getCurrentTime(),
    });
  };

  const onChange = ({ target: { name, value } }) => {
    if (name === "quantity") {
      const base = currentItem._base;
      const newQ = Number(value);
      const ratio = base && base.quantity ? newQ / base.quantity : 1;
      setCurrentItem((prev) => ({
        ...prev,
        quantity: value,
        calories: base ? (base.calories * ratio).toFixed(2) : prev.calories,
        protein: base ? (base.protein * ratio).toFixed(2) : prev.protein,
        carb: base ? (base.carb * ratio).toFixed(2) : prev.carb,
        fat: base ? (base.fat * ratio).toFixed(2) : prev.fat,
        fiber: base ? (base.fiber * ratio).toFixed(2) : prev.fiber,
      }));
    } else {
      setCurrentItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }));
    }
  };

  // Quando seleciona um item do autocomplete
  const onSelectComponent = (nome) => {
    const comp = components.find((c) => c.Nome === nome);
    setCurrentItem((prev) => ({
      ...prev,
      id: prev.id,
      name: nome,
      quantity: comp?.Quantidade || "",
      unit: comp?.Unidade || "",
      calories: comp?.Caloria || "",
      protein: comp?.Proteina || "",
      carb: comp?.["Carboidrato L."] || "",
      fat: comp?.Gordura || "",
      fiber: comp?.Fibra || "",
      _base: {
        quantity: Number(comp?.Quantidade || 1),
        calories: Number(comp?.Caloria || 0),
        protein: Number(comp?.Proteina || 0),
        carb: Number(comp?.["Carboidrato L."] || 0),
        fat: Number(comp?.Gordura || 0),
        fiber: Number(comp?.Fibra || 0),
      },
    }));
  };

  const add = () => {
    if (!currentItem.name || !currentItem.calories) return;
    let updatedList;
    const existingIndex = list.findIndex((item) => item.id === currentItem.id);
    if (existingIndex !== -1) {
      // Editando: substitui o item existente
      updatedList = [...list];
      updatedList[existingIndex] = currentItem;
    } else {
      // Novo: adiciona ao final
      updatedList = [...list, currentItem];
    }
    setDietForDate(selectedDate, updatedList);
    setList(updatedList);
    setCurrentItem({
      ...newItem(),
      time: getCurrentTime(),
    });
  };

  const edit = (id) => {
    const current = list.find((i) => i.id === id);
    setCurrentItem(current);
  };

  const remove = (id) => {
    const updatedList = list.filter((e) => e.id !== id);
    setDietForDate(selectedDate, updatedList);
    setList(updatedList);
  };

  const duplicate = (id) => {
    const itemToDuplicate = list.find((e) => e.id === id);
    if (!itemToDuplicate) return;

    const duplicatedItem = {
      ...itemToDuplicate,
      id: crypto.randomUUID(),
    };

    const updatedList = [...list, duplicatedItem];
    setDietForDate(selectedDate, updatedList);
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

  const moveRow = (dragIndex, hoverIndex) => {
    const draggedItem = list[dragIndex];
    const newList = [...list];
    newList.splice(dragIndex, 1);
    newList.splice(hoverIndex, 0, draggedItem);
    setList(newList);
    setDietForDate(selectedDate, newList);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.wrapper}>
        <div className={css.dateNav}>
          <button onClick={goToPrevDay} className={css.dateNavButton} title="Dia anterior">
            <Icon name="ChevronLeft" color="white" />
          </button>
          <span className={css.selectedDate}>{selectedDate}</span>
          {selectedDate !== getToday() && (
            <button onClick={goToNextDay} className={css.dateNavButton} title="Próximo dia">
              <Icon name="ChevronRight" color="white" />
            </button>
          )}
        </div>
        <table className={css.tableWrapper}>
          <thead>
            <tr className={css.tableHeader}>
              <th>Nome</th>
              <th>Horário</th>
              <th className={css.tableCellRight}>Qtd.</th>
              <th className={css.tableCellRight}>Unidade</th>
              <th className={css.tableCellRight}>Calorias</th>
              <th className={css.tableCellRight}>Proteína</th>
              <th className={css.tableCellRight}>Carb. Livre</th>
              <th className={css.tableCellRight}>Gordura</th>
              <th className={css.tableCellRight}>Fibra</th>
              <th className={css.tableCellCenter}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <DraggableRow key={item.id} index={index} moveRow={moveRow}>
                <td className={css.tableCell}>{item.name}</td>
                <td className={css.tableCell}>{item.time}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.quantity}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.unit}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.calories}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.protein}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.carb}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.fat}</td>
                <td className={`${css.tableCell} ${css.tableCellRight}`}>{item.fiber}</td>
                <td className={`${css.tableCell} ${css.tableCellCenter}`}>
                  <button onClick={() => edit(item.id)} className={css.actionButton} title="Editar">
                    <Icon name="Edit" color="#9ba8ea" />
                  </button>
                  <button
                    onClick={() => duplicate(item.id)}
                    className={css.actionButton}
                    title="Duplicar"
                  >
                    <Icon name="ContentCopy" color="#9ba8ea" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className={css.deleteButton}
                    title="Remover"
                  >
                    <Icon name="Delete" color="#e74c3c" />
                  </button>
                </td>
              </DraggableRow>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#2f2f2f", fontWeight: 700 }}>
              <td className={css.tableCellRight} style={{ color: "#9ba8ea" }}>
                Total
              </td>
              <td colSpan={3}></td>
              <td className={css.tableCellRight} style={{ color: "#78b1b8", fontSize: 16 }}>
                {totalCalories}
              </td>
              <td className={css.tableCellRight} style={{ color: "#78b1b8", fontSize: 16 }}>
                {totalProtein}
              </td>
              <td className={css.tableCellRight} style={{ color: "#78b1b8", fontSize: 16 }}>
                {totalCarb}
              </td>
              <td className={css.tableCellRight} style={{ color: "#78b1b8", fontSize: 16 }}>
                {totalFat}
              </td>
              <td className={css.tableCellRight} style={{ color: "#78b1b8", fontSize: 16 }}>
                {totalFiber}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
          className={css.form}
        >
          <div className={`${css.formField} ${css.formFieldLarge}`}>
            <label className={css.formLabel}>Nome</label>
            <SelectNome
              options={[...new Set(components.map((c) => c.Nome).filter(Boolean))]}
              value={currentItem.name}
              onSelect={onSelectComponent}
            />
          </div>
          <div className={css.formField} style={{ minWidth: 120 }}>
            <label className={css.formLabel}>Horário</label>
            <input
              type="time"
              name="time"
              value={currentItem.time}
              onChange={onChange}
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Quantidade</label>
            <input
              type="number"
              name="quantity"
              value={currentItem.quantity}
              onChange={onChange}
              placeholder="Quantidade"
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Unidade</label>
            <input
              type="text"
              name="unit"
              value={currentItem.unit}
              readOnly
              placeholder="Unidade"
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Calorias</label>
            <input
              type="number"
              name="calories"
              value={currentItem.calories}
              onChange={onChange}
              placeholder="Calorias"
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Proteína</label>
            <input
              type="number"
              name="protein"
              value={currentItem.protein}
              onChange={onChange}
              placeholder="Proteína"
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Carb. Livre</label>
            <input
              type="number"
              name="carb"
              value={currentItem.carb}
              onChange={onChange}
              placeholder="Carb. Livre"
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Gordura</label>
            <input
              type="number"
              name="fat"
              value={currentItem.fat}
              onChange={onChange}
              placeholder="Gordura"
              className={css.input}
            />
          </div>
          <div className={css.formField}>
            <label className={css.formLabel}>Fibra</label>
            <input
              type="number"
              name="fiber"
              value={currentItem.fiber}
              onChange={onChange}
              placeholder="Fibra"
              className={css.input}
            />
          </div>
          <div className={css.buttonGroup}>
            <button type="submit" className={css.submitButton}>
              {list.some((item) => item.id === currentItem.id) ? "Salvar" : "Adicionar"}
            </button>
            {list.some((item) => item.id === currentItem.id) && (
              <button
                type="button"
                onClick={() => setCurrentItem({ ...newItem(), time: getCurrentTime() })}
                className={css.cancelButton}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </DndProvider>
  );
};

export default Diet;
