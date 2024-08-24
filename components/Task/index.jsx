"use client";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "./styles.module.css";

const ItemType = "TASK";

export function Task({ id, text, index, moveTask }) {
  const [completed, setCompleted] = useState(false);

  const [, ref] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    setCompleted((completed) => !completed);
  };

  return (
    <div
      ref={(node) => drag(ref(node))}
      onClick={handleClick}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={`${styles.button} ${completed ? styles.completed : ""}`}>
        {completed && <span className={styles.checkbox}>✔</span>}
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
