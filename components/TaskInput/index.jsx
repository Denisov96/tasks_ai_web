"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { TrashIcon, PlusIcon, MicrophoneIcon } from "../Icons/icons";
import { useTaskInput } from "../../hooks/useTaskInput";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

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

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        autoFocus
        value={displayedValue}
        onChange={(e) => {
          if (!processing) onChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !processing) onSubmit();
        }}
        placeholder="Enter a new task..."
        className={styles.input}
        disabled={processing}
        aria-busy={processing}
      />

      <button
        className={`${styles.button} ${styles.addButton}`}
        onClick={() => !processing && onSubmit()}
        disabled={processing}
      >
        <PlusIcon />
      </button>

      <button
        className={`${styles.button} ${styles.deleteButton}`}
        onClick={() => !processing && deleteCompletedTasks()}
        disabled={!hasCompletedTasks || processing}
      >
        <TrashIcon />
      </button>

      <button
        className={`${styles.button} ${recording ? styles.recording : ""}`}
        onClick={() => toggleRecording()}
        title={recording ? "Stop recording" : "Start recording"}
      >
        <MicrophoneIcon size={32} color="#ffffff" />
      </button>
    </div>
  );
}
