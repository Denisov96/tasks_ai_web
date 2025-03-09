"use client";
import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import styles from "../styles.module.css";
import { getTasks, updateTask, createTask } from "../lib/requests";
import { RocketIcon } from "../components/Icons/icons"; 

export default function Page() {
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
    if (taskToEdit?.text.trim() === "") return;

    const newTasks = taskToEdit.id
      ? await updateTask(taskToEdit)
      : await createTask(taskToEdit.text);

    setTasks(newTasks);
    setTaskToEdit(null);
  }

  async function handleDeleteTasks() {
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
      setTasks(responseObject.data);
    } catch (error) {
      console.error(error);
      alert("Failed to delete completed tasks. Please try again.");
    }
  }
  return (
    <div className={styles.pageContainer}>
    <Logo />
    {tasks.length === 0 && (
      <p className={styles.placeholderText}>
        Add your first task for today! <RocketIcon />
      </p>
    )}


      <TaskList
        tasks={tasks}
        onChange={(newTasks) => setTasks(newTasks)}
        onEdit={(task) => {
          setTaskToEdit(task);
        }}
      />
      <TaskInput
        value={taskToEdit?.text}
        onSubmit={handleSubmit}
        onChange={(value) => setTaskToEdit({ ...taskToEdit, text: value })}
        tasks={tasks}
        deleteTasks={handleDeleteTasks}
      />
    </div>
  );
}
