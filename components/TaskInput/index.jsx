import styles from "./styles.module.css";
import { TrashIcon, PlusIcon, MicrophoneIcon } from "../Icons/icons";
import { useTaskInput } from "../../hooks/useTaskInput";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

export function TaskInput({ tasks, userId, onChangeTasks }) {
  const { value, hasCompletedTasks, onChange, onSubmit, deleteCompletedTasks } =
    useTaskInput({ tasks, userId, onChangeTasks });

  const { recording, toggleRecording } = useAudioRecorder({
    onTranscript: onChange,
    maxDuration: 10000, 
  });

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

      <button
        className={`${styles.button} ${recording ? styles.recording : ""}`}
        onClick={toggleRecording}
      >
        <MicrophoneIcon size={32} color="#ffffff" />
      </button>
    </div>
  );
}
