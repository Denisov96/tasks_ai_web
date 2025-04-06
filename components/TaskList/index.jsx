import { useMemo } from "react";
import { Task } from "../Task";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { booleanSort } from "../../lib/utils";
import { updateTask } from "../../lib/requests";
import styles from "./styles.module.css";

export function TaskList({ tasks = [], onChange, onEdit, userId }) {
  const sortedTasks = useMemo(() => {
    return tasks.toSorted((prev, curr) =>
      booleanSort(prev.completed, curr.completed)
    );
  }, [tasks]);

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    onChange(updatedTasks);
  };

  const toggleTaskCompleted = async (id, completed) => {
    const updatedTasks = tasks.map((task) => {
      if (id !== task.id) return task;
      return { ...task, completed };
    });

    onChange(updatedTasks);

    try {
      const updated = await updateTask({ id, completed }, userId);
      onChange(updated);
    } catch (error) {
      console.error(error);
    }
  };

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
