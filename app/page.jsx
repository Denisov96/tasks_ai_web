"use client";
import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import styles from "../styles.module.css";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

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

  const handleEditTask = (id, text) => {
    setEditTask({ id, text });
  };

  const handleSaveTask = async (newText) => {
    if (!editTask || newText.trim() === "") return;

    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "PUT",
      body: JSON.stringify({
        id: editTask.id,
        text: newText,
        completed: editTask.completed,
      }),
    });

    if (!response.ok) {
      console.error(`Cannot update task. Response status ${response.status}`);
      return;
    }

    const responseObject = await response.json();
    setTasks(responseObject.data);
    setEditTask(null);
  };

  return (
    <div className={styles.pageContainer}>
      <Logo />

      <TaskInput
        onAddTask={(newTasks) => setTasks(newTasks)}
        onSave={handleSaveTask}
        editTask={editTask}
        setEditTask={setEditTask} 
      />

      <hr />

      <TaskList
        tasks={tasks}
        onChange={(newTasks) => setTasks(newTasks)}
        onEdit={handleEditTask}
      />
    </div>
  );
}
