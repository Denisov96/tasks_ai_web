"use client";
import { useMemo } from "react";
import { Task } from "../Task";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { booleanSort } from "../../lib/utils";

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

  const toggleTaskCompleted = (id, completed) => {
    const updatedTasks = tasks.map((task) => {
      if (id !== task.id) return task;
      return { ...task, completed };
    });

    onChange(updatedTasks);
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
    </DndProvider>
  );
}
