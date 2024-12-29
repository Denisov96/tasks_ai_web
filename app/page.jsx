"use client";
import { Logo } from "../components/Logo";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import styles from "../styles.module.css";
import { useState, useEffect } from "react";

export default function Page() {
  const [tasks, setTasks] = useState([]);

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
      <Logo />

      <TaskInput onAddTask={(newTasks) => setTasks(newTasks)} />

      <hr />

      <TaskList tasks={tasks} onChange={(newTasks) => setTasks(newTasks)} />
    </div>
  );
}
