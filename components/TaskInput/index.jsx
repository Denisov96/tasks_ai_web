import styles from "./styles.module.css";

export function TaskInput({
  onSubmit,
  value,
  onChange,
  tasks = [],
  deleteTasks,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        autoFocus
        value={value ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a new task..."
        className={styles.input}
      />
      <button className={styles.addButton} onClick={onSubmit}>
        +
      </button>
      <button
        className={styles.deleteButton}
        onClick={deleteTasks}
        disabled={
          !Array.isArray(tasks) || tasks.every((task) => !task.completed)
        }
      >
        🗑️
      </button>
    </div>
  );
}
