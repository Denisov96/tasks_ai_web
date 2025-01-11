"use client";
import { useMemo } from "react";
import { Task } from "../Task";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { booleanSort } from "../../lib/utils";
import styles from "../TaskList/styles.module.css";

export function TaskList({ tasks, onChange }) {
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
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task with id: ${id}`);
      }

      const responseObject = await response.json();
      onChange(responseObject.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTasks = async () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    onChange(updatedTasks);

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: tasks.filter((task) => task.completed).map((task) => task.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete tasks");
      }

      const responseObject = await response.json();
      onChange(responseObject.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {sortedTasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          completed={task.completed}
          onMove={moveTask}
          onClick={({ id, completed }) => toggleTaskCompleted(id, completed)}
        />
      ))}
      <button
        className={styles.deleteButton}
        onClick={deleteTasks}
        disabled={tasks.every((task) => !task.completed)}
      >
        Delete completed
      </button>
    </DndProvider>
  );
}
