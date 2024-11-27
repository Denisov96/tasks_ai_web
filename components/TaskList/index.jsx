"use client";
import { useMemo } from "react";
import { Task } from "../Task";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function TaskList({ tasks, onChange }) {
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );
  const notCompletedTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    onChange(updatedTasks);
  };

  const toggleTaskCompleted = (id, completed) => {
    const updatedTasks = tasks.map((task) => {
      if (id !== task.id) return task;
      task.completed = completed;
      return task;
    });

    onChange(updatedTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {notCompletedTasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          onMove={moveTask}
          onComplete={(id) => toggleTaskCompleted(id, true)}
          onRevert={() => {}}
          isCompleted={false}
        />
      ))}

      <hr />

      {completedTasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          onMove={() => {}}
          onComplete={() => {}}
          onRevert={(id) => toggleTaskCompleted(id, false)}
          isCompleted={true}
        />
      ))}
    </DndProvider>
  );
}
