import { useState, useEffect } from "react";
import styles from "./styles.module.css";

export function TaskInput({ onAddTask, onSave, editTask }) {
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    if (editTask) {
      setNewTaskText(editTask.text);
    }
  }, [editTask]);

  async function handleAddTask() {
    if (newTaskText.trim() === "") return;

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

    const responseObject = await response.json();

    onAddTask(responseObject.data);
    setNewTaskText("");
  }

  const handleSaveTask = () => {
    if (newTaskText.trim() === "") return;

    onSave(newTaskText);

    setNewTaskText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editTask) {
        handleSaveTask();
      } else {
        handleAddTask();
      }
    }
  };

  return (
    <input
      type="text"
      autoFocus
      value={newTaskText}
      onChange={(e) => setNewTaskText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Enter a new task..."
      className={styles.input}
    />
  );
}
