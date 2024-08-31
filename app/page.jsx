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
  const [completedTasks, setCompletedTasks] = useState([]);

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setTasks(tasks.filter((_, i) => i !== index)); 
    setCompletedTasks([...completedTasks, { ...taskToComplete, completed: true }]); 
  };

  const revertTask = (index) => {
    const taskToRevert = completedTasks[index];
    setCompletedTasks(completedTasks.filter((_, i) => i !== index)); 
    setTasks([...tasks, { ...taskToRevert, completed: false }]); 
  };

  return (
    <>
      <h3>Active Tasks</h3>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          moveTask={moveTask}
          completeTask={completeTask}
          revertTask={() => {}}
          isCompleted={false}
        />
      ))}

      <h3>Completed Tasks</h3>
      {completedTasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          moveTask={() => {}}
          completeTask={() => {}}
          revertTask={revertTask}
          isCompleted={true}
        />
      ))}
    </>
  );
}
