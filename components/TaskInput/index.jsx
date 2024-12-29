import { useState } from "react";
import styles from "./styles.module.css";

export function TaskInput({ onAddTask }) {
  const [newTaskText, setNewTaskText] = useState("");

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
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