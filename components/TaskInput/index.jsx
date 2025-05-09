import { TrashIcon, PlusIcon } from "../Icons/icons";
import styles from "./styles.module.css";
import { deleteTask, getTasks } from "../../lib/requests";

export function TaskInput({
  onSubmit,
  value,
  onChange,
  tasks = [],
  userId,
  onChangeTasks,
}) {
  const hasCompletedTasks = tasks.some((task) => task.completed);

  const deleteCompletedTasks = async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);

    if (!completedIds.length) {
      console.warn("No completed tasks to delete.");
      return;
    }

    try {
      for (const taskId of completedIds) {
        await deleteTask(taskId, userId);
      }

      const updatedTasks = await getTasks(userId);
      onChangeTasks && onChangeTasks(updatedTasks);
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        autoFocus
        value={value || ""}
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
