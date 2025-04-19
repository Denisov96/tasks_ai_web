import { TrashIcon, PlusIcon } from "../Icons/icons";
import styles from "./styles.module.css";

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
  
    const url = `http://localhost:3000/api/users/${userId}/tasks`;
    console.log("Sending DELETE request to:", url, "with IDs:", completedIds);
  
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: completedIds }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete completed tasks");
      }
  
      const { data } = await response.json();
      onChangeTasks && onChangeTasks(data);
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
