"use client";
import { useState } from "react";
import styles from "./styles.module.css";

export function Task(props) {
  const [completed, setCompleted] = useState("");

  function handleClick() {
    setCompleted("completed");
  }

  return (
    <div onClick={handleClick} className={styles.taskCard}>
      <p>{props.text}</p>
      <p>{completed}</p>
    </div>
  );
}
