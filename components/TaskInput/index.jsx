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
    let interval = null;
    if (processing) {
      setDots(0);
      interval = setInterval(() => {
        setDots((d) => (d + 1) % 4);
      }, 500);
    } else {
      setDots(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [processing]);

  const displayedValue = processing ? `Waiting${".".repeat(dots)}` : value;
  const hasText = !!value && value.trim().length > 0 && !processing;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          autoFocus
          value={displayedValue}
          onChange={(e) => {
            if (!processing) onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && hasText) onSubmit();
          }}
          placeholder="Enter a new task..."
          className={styles.input}
          disabled={processing}
          aria-busy={processing}
        />

        <div className={styles.buttonsInside}>
          <IconButton
            className={`${styles["add-button"]} ${
              hasText ? styles.visible : ""
            }`}
            onClick={onSubmit}
            title="Add task"
            style={{ color: "white" }}
          >
            <PlusIcon />
          </IconButton>

          <IconButton
            className={`${styles["mic-button"]} ${
              recording ? styles.recording : ""
            }`}
            onClick={toggleRecording}
            title={recording ? "Stop recording" : "Start recording"}
            style={{ color: "white" }}
          >
            <MicrophoneIcon size={20} />
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
