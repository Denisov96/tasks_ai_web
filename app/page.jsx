"use client";
import { Task } from "../components/Task";
import { TaskInput } from "../components/TaskInput";
import styles from "../styles.module.css";
import { useState, useEffect } from "react";

export default function Page() {
  const [tasks, setTasks] = useState([]);
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
    setCompletedTasks([
      ...completedTasks,
      { ...taskToComplete, completed: true },
    ]);
  };

  const revertTask = (index) => {
    const taskToRevert = completedTasks[index];
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
    setTasks([...tasks, { ...taskToRevert, completed: false }]);
  };

  const addNewTask = async (newTaskText) => {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      body: newTaskText,
    });
    if (!response.ok) {
      console.error(
        `Cannot create new task. Response status ${response.status}`
      );
      return;
    }
    const task = await response.json();
    setTasks((prevTasks) => [task.data[task.data.length - 1], ...prevTasks]);
  };
  
  

  useEffect(() => {
    async function getTasks() {
      const response = await fetch("http://localhost:3000/api/tasks");
      if (!response.ok) {
        console.error(`Cannot fetch tasks. Response status ${response.status}`);
        return;
      }
      const responseObject = await response.json();

      setTasks(responseObject.data);
    }
    getTasks();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <TaskInput onAddTask={addNewTask} />

      <h3 className={styles.h3}></h3>

      {tasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          onMove={moveTask}
          onComplete={completeTask}
          onRevert={() => {}}
          isCompleted={false}
        />
      ))}

      <h3 className={styles.h3}></h3>

      {completedTasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          onMove={() => {}}
          onComplete={() => {}}
          onRevert={revertTask}
          isCompleted={true}
        />
      ))}
    </div>
  );
}
