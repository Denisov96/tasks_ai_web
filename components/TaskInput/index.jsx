import styles from "./styles.module.css";

export function TaskInput({ onAddTask, onSave, editTask, setEditTask }) {
  async function handleTask() {
    if (editTask.text.trim() === "") return;
    
    if (editTask.id) {
      onSave(editTask.text);
    } else {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        body: editTask.text,
      });

      if (!response.ok) {
        console.error(
          `Cannot create new task. Response status ${response.status}`
        );
        return;
      }

      const responseObject = await response.json();
      onAddTask(responseObject.data);
    }

    setEditTask(null);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTask();
    }
  };

  return (
    <input
      type="text"
      autoFocus
      value={editTask ? editTask.text : ""}
      onChange={(e) => setEditTask({ ...editTask, text: e.target.value })}
      onKeyDown={handleKeyDown}
      placeholder="Enter a new task..."
      className={styles.input}
    />
  );
}
