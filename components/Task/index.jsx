"use client";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "./styles.module.css";

const ItemType = "TASK";

export function Task({
  id,
  text,
  index,
  moveTask,
  completeTask,
  revertTask,
  isCompleted
}) {
  const [completed, setCompleted] = useState(isCompleted);

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
    if (completed) {
      revertTask(index);
    } else {
      setCompleted(true);
      completeTask(index);
    }
  };

  return (
    <div
      ref={(node) => drag(ref(node))}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""}`}
      style={{ textDecoration: completed ? 'line-through' : 'none', color: completed ? '#888' : 'inherit' }}
    >
      <div className={styles.dragHandle}>
        <span className={styles.dots}>⋮</span>
      </div>
      <button
        onClick={handleClick}
        className={`${styles.button} ${completed ? styles.completed : ""}`}
      >
        {completed && <span className={styles.checkbox}>✔</span>}
      </button>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
