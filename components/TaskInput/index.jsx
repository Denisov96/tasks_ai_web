import styles from "./styles.module.css";



export function TaskInput({ onSubmit, value, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <input
      type="text"
      autoFocus
      value={value ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Enter a new task..."
      className={styles.input}
    />
  );
}
