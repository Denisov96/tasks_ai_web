"use client";
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
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a new task.."
        className={styles.input}
      />
    </div>
  );
}

    
  
