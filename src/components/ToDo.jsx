import ToDoList from "./ToDoList";
import css from "./ToDo.module.scss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.lists}>
        {categories.map((category) => (
          <ToDoList key={category.id} category={category} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Todo;
