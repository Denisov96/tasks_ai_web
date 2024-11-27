import { useState } from "react";
import styles from "./styles.module.css";

export function TaskInput({ onAddTask }) {
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    onAddTask(newTaskText);
    setNewTaskText("");
  };

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
