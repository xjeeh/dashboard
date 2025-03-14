import ToDoList from "./ToDoList";
import css from "./ToDo.module.scss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "store2";
import { Icon } from "./Icon";

const Todo = () => {
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
  ];

  const backup = () => {
    categories.forEach((category) => store(`list-${category.storageIndex}-backup`, store(`list-${category.storageIndex}`)));
    console.warn("Backup done");
  };

  const restore = () => {
    categories.forEach((category) => {
      store(`list-${category.storageIndex}`, store(`list-${category.storageIndex}-backup`));
      window.location.reload();
      // setList(store(storageBackupIndex));
    });
    console.warn("Restore done");
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
};

export default Todo;
