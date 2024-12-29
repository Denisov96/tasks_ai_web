"use client";
import { useDrag, useDrop } from "react-dnd";
import styles from "./styles.module.css";

const ItemType = "TASK";

export function Task({ id, text, index, onMove, onClick, completed }) {
  const [, ref] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        onMove(item.index, index);
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

  return (
    <div
      ref={(node) => drag(ref(node))}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.dragHandle}>
        <span className={styles.dots}>⋮</span>
      </div>
      <button
        onClick={() => onClick({ id, completed: !completed })}
        className={`${styles.button} ${completed ? styles.completed : ""}`}
      >
        {completed && <span className={styles.checkbox}>✔</span>}
      </button>
      <span
        className={`${styles.text} ${completed ? styles.completedText : ""}`}
      >
        {text}
      </span>
    </div>
  );
}
