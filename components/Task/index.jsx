"use client";
import { useState } from "react";
import styles from "./styles.module.css";

export function Task({ text }) {
  const [completed, setCompleted] = useState(false);

  function handleClick() {
    setCompleted(!completed);
  }

  return (
    <div onClick={handleClick} className={styles.taskCard}>
      <div className={`${styles.button} ${completed ? styles.completed : ""}`}>
        {completed && <span className={styles.checkbox}>✔</span>}
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
