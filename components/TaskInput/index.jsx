import { TrashIcon, PlusIcon } from "../Icons/icons";
import styles from "./styles.module.css";

export function TaskInput({
  onSubmit,
  value,
  onChange,
  tasks = [],
  deleteTasks,
  userId,
  onChangeTasks,
}) {
  const hasCompletedTasks = tasks.some((task) => task.completed);

  const deleteCompletedTasks = async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          userid: userId.toString(),
        },
        body: JSON.stringify({ ids: completedIds }),
      });

      if (!response.ok) throw new Error("Failed to delete completed tasks");
      
      const { data } = await response.json();
      onChangeTasks && onChangeTasks(data); 
    } catch (error) {
      console.error("Delete error:", error);
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
