import { TrashIcon, PlusIcon } from "../Icons/icons";
import styles from "./styles.module.css";
import { useTaskInput } from "../../hooks/useTaskInput";

export function TaskInput({ tasks, userId, onChangeTasks }) {
  const {
    value,
    hasCompletedTasks,
    onChange,
    onSubmit,
    deleteCompletedTasks,
  } = useTaskInput({ tasks, userId, onChangeTasks });

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="Enter a new task..."
        className={styles.input}
      />
      <button
        className={`${styles.button} ${styles.addButton}`}
        onClick={onSubmit}
      >
        <PlusIcon />
      </button>
      <button
        className={`${styles.button} ${styles.deleteButton}`}
        onClick={deleteCompletedTasks}
        disabled={!hasCompletedTasks}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
