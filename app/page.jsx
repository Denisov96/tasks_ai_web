"use client";
import { useState } from "react";
import { Task } from "../components/Task";

export default function Page() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy Milk" },
    { id: 2, text: "Repair the door" },
    { id: 3, text: "Throw garbage" },
    { id: 4, text: "Cook a dinner" },
  ]);

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          moveTask={moveTask}
        />
      ))}
    </>
  );
}
