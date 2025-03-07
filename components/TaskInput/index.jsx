import styles from "./styles.module.css";
import { TrashIcon, PlusIcon } from "../Icons/icons"

export function TaskInput({
  onSubmit,
  value,
  onChange,
  tasks = [],
  deleteTasks,
}) {
  const hasCompletedTasks = tasks.some((task) => task.completed);

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        autoFocus
        value={value ? value : ""}
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
        onClick={deleteTasks}
        disabled={!hasCompletedTasks}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
