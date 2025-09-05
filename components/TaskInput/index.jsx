import { useState, useRef } from "react";
import { TrashIcon, PlusIcon, MicrophoneIcon } from "../Icons/icons";
import styles from "./styles.module.css";
import { useTaskInput } from "../../hooks/useTaskInput";

export function TaskInput({ tasks, userId, onChangeTasks }) {
  const { value, hasCompletedTasks, onChange, onSubmit, deleteCompletedTasks } =
    useTaskInput({ tasks, userId, onChangeTasks });

  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      recorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm; codecs=opus",
        });

        const wavBlob = await convertToWav(blob, 16000);

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
        className={styles.button}
        style={{
          backgroundColor: recording ? "white" : "black",
          color: recording ? "black" : "white",
        }}
        onClick={handleRecord}
      >
        <MicrophoneIcon
          size={32}
          color={recording ? "#000000" : "#ffffff"}
        />
      </button>
    </div>
  );
}

async function convertToWav(blob, targetSampleRate = 16000) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const offlineCtx = new OfflineAudioContext(
    1,
    Math.ceil((audioBuffer.length * targetSampleRate) / audioBuffer.sampleRate),
    targetSampleRate
  );

  const source = offlineCtx.createBufferSource();

  const monoBuffer = offlineCtx.createBuffer(
    1,
    audioBuffer.length,
    audioBuffer.sampleRate
  );
  const channelData = monoBuffer.getChannelData(0);
  const numChannels = audioBuffer.numberOfChannels;
  for (let i = 0; i < audioBuffer.length; i++) {
    let sum = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      sum += audioBuffer.getChannelData(ch)[i];
    }
    channelData[i] = sum / numChannels;
  }
  source.buffer = monoBuffer;

  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();

  const numFrames = renderedBuffer.length;
  const buffer = new ArrayBuffer(44 + numFrames * 2);
  const view = new DataView(buffer);

  let offset = 0;
  const writeString = (str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  };

  writeString("RIFF");
  view.setUint32(offset, 36 + numFrames * 2, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint32(offset, targetSampleRate, true);
  offset += 4;
  view.setUint32(offset, targetSampleRate * 2, true);
  offset += 4;
  view.setUint16(offset, 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, numFrames * 2, true);
  offset += 4;

  const samples = renderedBuffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}
