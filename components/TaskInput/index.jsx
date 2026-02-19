"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { TrashIcon, PlusIcon, MicrophoneIcon } from "../Icons/icons";
import { useTaskInput } from "../../hooks/useTaskInput";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { IconButton } from "./iconButton";

export function TaskInput({ tasks, userId, onChangeTasks }) {
  const { value, hasCompletedTasks, onChange, onSubmit, deleteCompletedTasks } =
    useTaskInput({ tasks, userId, onChangeTasks });

  const { recording, processing, toggleRecording } = useAudioRecorder({
    onTranscript: onChange,
    maxDuration: 10000,
  });

  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!processing) {
      setDots(0);
      return;
    }

    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [processing]);

  const displayedValue = processing ? `Waiting${".".repeat(dots)}` : value;
  const hasText = value.trim().length > 0 && !processing;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={displayedValue}
          onChange={(e) => !processing && onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && hasText && onSubmit()}
          placeholder="Enter a new task..."
          className={styles.input}
          disabled={processing}
        />

        <div className={styles.buttonsInside}>
          <IconButton
            className={`${styles["add-button"]} ${hasText ? styles.visible : ""}`}
            onClick={onSubmit}
            title="Add task"
          >
            <PlusIcon />
          </IconButton>

          <IconButton
            className={`${styles["mic-button"]} ${
              recording ? styles.recording : ""
            }`}
            onClick={toggleRecording}
            title={recording ? "Stop recording" : "Start recording"}
          >
            <MicrophoneIcon />
          </IconButton>
        </div>
      </div>

      <IconButton
        className={styles["delete-button"]}
        onClick={deleteCompletedTasks}
        disabled={!hasCompletedTasks || processing}
        title="Delete completed tasks"
      >
        <TrashIcon />
      </IconButton>
    </div>
  );
}

export default TaskInput;
