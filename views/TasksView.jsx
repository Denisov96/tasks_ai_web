"use client";

import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import styles from "../styles.module.css";
import { getTasks, updateTask, createTask } from "../lib/requests";

export function TaskView() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    async function fetchAndSetTasks() {
      const tasks = await getTasks();
      setTasks(tasks);
    }
    fetchAndSetTasks();
  }, []);

  async function handleSubmit() {
    if (taskToEdit.text.trim() === "") return;

    const newTasks = taskToEdit.id
    ? await updateTask(taskToEdit)
    : await createTask(taskToEdit.text);

    setTasks(newTasks);
    setTaskToEdit(null);
  }

  return (
    <div className={styles.pageContainer}>
      <Logo />

      <TaskInput
        value={taskToEdit?.text}
        onSubmit={handleSubmit}
        onChange={(value) => setTaskToEdit({ ...taskToEdit, text: value })}
      />

      <hr />

      <TaskList
        tasks={tasks}
        onChange={(newTasks) => setTasks(newTasks)}
        onEdit={(task) => {
          setTaskToEdit(task);
        }}
      />
    </div>
  );
}
