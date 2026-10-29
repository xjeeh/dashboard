import ToDoList from "./ToDoList";
import css from "./ToDo.module.scss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Icon } from "./Icon";
import { useUserData } from "../contexts/UserDataContext";

const Todo = () => {
  const { get, set } = useUserData();

  const categories = [
    {
      id: "d417ef6b-2dc1-484e-ba90-6d8de5262e49",
      name: "To Do",
      icon: "List",
      color: "#3498DB",
      storageIndex: "todo",
    },
    {
      id: "7f64e44f-cc3b-4f25-b959-fc25a2710412",
      name: "To Buy",
      icon: "ShoppingCart",
      color: "#E67E22",
      storageIndex: "tobuy",
    },
    {
      id: "8f64e44f-cc3b-4f25-b959-fc25a2710413",
      name: "Car",
      icon: "DirectionsCar",
      color: "#2ECC71",
      storageIndex: "car",
    },
  ];

  const backup = () => {
    const currentData = get("list") || {};
    const backupData = { ...currentData };

    categories.forEach((category) => {
      if (!backupData[category.storageIndex]) {
        backupData[category.storageIndex] = { list: [], backup: [], showCompleted: false };
      }
      backupData[category.storageIndex].backup = [...(backupData[category.storageIndex].list || [])];
    });

    set("list", backupData);
    console.warn("Backup done");
  };

  const restore = () => {
    const backupData = { ...(get("list") || {}) };

    categories.forEach((category) => {
      if (backupData[category.storageIndex]?.backup) {
        backupData[category.storageIndex].list = [...backupData[category.storageIndex].backup];
      }
    });

    set("list", backupData);
    window.location.reload();
    console.warn("Restore done");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.todoPage}>
        <div className={css.lists}>
          {categories.map((category) => (
            <ToDoList key={category.id} category={category} />
          ))}
        </div>
        <div className={css.options}>
          <button onClick={backup} className={css.backup} title="Save Backup">
            <Icon name="Backup" />
          </button>
          <button onClick={restore} className={css.restore} title="Restore backup">
            <Icon name="RestartAlt" />
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Todo;
