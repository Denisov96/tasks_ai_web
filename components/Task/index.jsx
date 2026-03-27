"use client";
import { ChevronsUp, Minus, ChevronDown } from "lucide-react";
import { useTaskDragDrop } from "../../hooks/useTaskDragDrop";
import styles from "./styles.module.css";

const priorities = [
  {
    value: "HIGH",
    label: "High",
    icon: <ChevronsUp size={16} />,
    color: "#ef4444",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: <Minus size={16} />,
    color: "#eab308",
  },
  {
    value: "LOW",
    label: "Low",
    icon: <ChevronDown size={16} />,
    color: "#3b82f6",
  },
];

export function Task({
  id,
  text,
  priority,
  index,
  onMove,
  onClick,
  onEdit,
  completed,
  className,
  onPriorityChange,
  isOpen,
  onToggleOpen,
}) {
  const { drag, drop, isDragging } = useTaskDragDrop({ id, index, onMove });
  const current = priorities.find((p) => p.value === priority) || priorities[1];

  return (
    <div
      ref={drop}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""} ${className}`}
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
        onClick={() => onEdit({ id, text, completed, priority })}
      >
        {text}
      </span>

      <div className={styles.priorityWrapper}>
        <div
          className={styles.prioritySelected}
          onClick={() => onToggleOpen(id)}
        >
          <span style={{ color: current.color }}>{current.icon}</span>
        </div>

        {isOpen && (
          <div className={styles.priorityDropdown}>
            {priorities.map((p) => (
              <div
                key={p.value}
                className={styles.priorityOption}
                onClick={() => {
                  onPriorityChange(id, p.value);
                  onToggleOpen(id);
                }}
              >
                <span style={{ color: p.color }}>{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
