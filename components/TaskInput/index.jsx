import { useState, useRef, useEffect } from "react";
import { TrashIcon, PlusIcon, MicrophoneIcon } from "../Icons/icons";
import styles from "./styles.module.css";
import { useTaskInput } from "../../hooks/useTaskInput";

import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

export function TaskInput({ tasks, userId, onChangeTasks }) {
  const { value, hasCompletedTasks, onChange, onSubmit, deleteCompletedTasks } =
    useTaskInput({ tasks, userId, onChangeTasks });

  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    (async () => {
      try {
        await register(await connect());
        console.log("🎤 WAV encoder registered once");
      } catch (err) {
        if (err.message.includes("There is already an encoder stored")) {
          console.log("ℹ️ Encoder already registered, skipping");
        } else {
          console.error("❌ Encoder register error:", err);
        }
      }
    })();
  }, []);

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      const sourceNode = new MediaStreamAudioSourceNode(audioContext, {
        mediaStream: stream,
      });
      const destNode = new MediaStreamAudioDestinationNode(audioContext);
      sourceNode.connect(destNode);

      recorderRef.current = new MediaRecorder(destNode.stream, {
        mimeType: "audio/wav",
      });
      chunksRef.current = [];

      recorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorderRef.current.onstop = async () => {
        const wavBlob = new Blob(chunksRef.current, { type: "audio/wav" });

        const formData = new FormData();
        formData.append("file", wavBlob, "recording.wav");
        formData.append("lang", "en");

        try {
          const res = await fetch(`/api/transcribe`, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.transcript) {
            let transcriptText;
            try {
              const parsed =
                typeof data.transcript === "string"
                  ? JSON.parse(data.transcript)
                  : data.transcript;
              transcriptText = parsed.sentences.map((s) => s.s).join(" ");
            } catch (err) {
              console.error("❌ Failed to parse transcript:", err);
              transcriptText = data.transcript;
            }

            onChange(transcriptText);
          } else {
            console.error("❌ Transcribe error:", data);
          }
        } catch (err) {
          console.error("❌ Fetch error:", err);
        }
      };

      recorderRef.current.start();
      setRecording(true);
    } else {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

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
        onClick={handleRecord}
      >
        <MicrophoneIcon size={32} color={recording ? "#ffffff" : "#ffffff"} />
      </button>
    </div>
  );
}
