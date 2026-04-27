"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "../Task";
import { useTaskList } from "../../hooks/useTaskList";
import styles from "./styles.module.css";

export function TaskList({ tasks, onChange, onEdit, userId }) {
  const { sortedTasks, moveTask, toggleTaskCompleted, changeTaskPriority } =
    useTaskList({ tasks, onChange, userId });

  const [openTaskId, setOpenTaskId] = useState(null);

  const handleToggle = (id) => {
    setOpenTaskId((prev) => (prev === id ? null : id));
  };

  const handleClose = () => {
    setOpenTaskId(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.taskListContainer}>
        {sortedTasks.map((task, index) => {
          const isFirstCompleted =
            task.completed &&
            sortedTasks[index - 1] &&
            !sortedTasks[index - 1].completed;

          return (
            <Task
              key={task.id}
              id={task.id}
              text={task.text}
              index={index}
              completed={task.completed}
              priority={task.priority}
              onMove={moveTask}
              onClick={({ id, completed }) =>
                toggleTaskCompleted(id, completed)
              }
              onEdit={onEdit}
              onPriorityChange={changeTaskPriority}
              className={isFirstCompleted ? styles.completedSeparator : ""}
              isOpen={openTaskId === task.id}
              onToggleOpen={handleToggle}
              onClose={handleClose}
            />
          );
        })}
      </div>
    </DndProvider>
  );
}
