import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "../Task";
import styles from "./styles.module.css";
import { useTaskList } from "../../hooks/useTaskList";

export function TaskList({ tasks = [], onChange, onEdit }) {
  const {
    sortedTasks,
    moveTask,
    toggleTaskCompleted,
  } = useTaskList({ tasks, onChange });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.taskListContainer}>
        {sortedTasks.map((task, index) => (
          <Task
            key={task.id}
            id={task.id}
            text={task.text}
            index={index}
            completed={task.completed}
            onMove={moveTask}
            onClick={({ id, completed }) => toggleTaskCompleted(id, completed)}
            onEdit={onEdit}
          />
        ))}
      </div>
    </DndProvider>
  );
}

