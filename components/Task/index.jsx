import { useTaskDragDrop } from "../../hooks/useTaskDragDrop";
import styles from "./styles.module.css";

export function Task({
  id,
  text,
  index,
  onMove,
  onClick,
  completed,
  onEdit,
  className = "",
}) {
  const { drag, drop, isDragging } = useTaskDragDrop({
    id,
    index,
    onMove,
  });

  return (
    <div
      ref={drop}
      className={`${styles.taskCard} ${
        isDragging ? styles.dragging : ""
      } ${className}`}
    >
      <div ref={drag} className={styles.dragHandle}>
        <span className={styles.dots}>⋮</span>
      </div>

      <button
        type="button"
        onClick={() => onClick({ id, completed: !completed })}
        className={`${styles.button} ${completed ? styles.completed : ""}`}
      >
        {completed && <span className={styles.checkbox}>✔</span>}
      </button>

      <span
        className={`${styles.text} ${completed ? styles.completedText : ""}`}
        onClick={() => onEdit({ id, text, completed })}
      >
        {text}
      </span>
    </div>
  );
}
