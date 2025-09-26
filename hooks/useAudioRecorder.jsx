import { useState, useRef, useEffect } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

async function tryCatch(fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    console.error("❌ Error:", err);
    return fallback;
  }
}

export function useAudioRecorder({
  onTranscript,
  maxDuration = 10000,
  initialLang = "ru",
}) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const langRef = useRef(initialLang);
  useEffect(() => {
    tryCatch(async () => {
      await register(await connect());
      console.log("🎤 WAV encoder ready");
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        tryCatch(() => recorderRef.current.stop());
      }
    };
  }, []);

  const setLang = (newLang) => {
    langRef.current = newLang;
  };

  const toggleRecording = async () => {
    if (!recording) {
      const stream = await tryCatch(
        () => navigator.mediaDevices.getUserMedia({ audio: true }),
        null
      );
      if (!stream) return;

      const mimeType = MediaRecorder.isTypeSupported("audio/wav")
        ? "audio/wav"
        : "audio/webm";

      recorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorderRef.current.onstop = async () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setProcessing(true);

        const blob = new Blob(chunksRef.current, { type: mimeType });
        const formData = new FormData();
        formData.append("file", blob, "recording.wav");
        formData.append("lang", langRef.current);

        const data = await tryCatch(async () => {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          return res.json();
        }, {});

        if (data.transcript) {
          let transcriptText;
          try {
            const parsed =
              typeof data.transcript === "string"
                ? JSON.parse(data.transcript)
                : data.transcript;
            transcriptText = Array.isArray(parsed.sentences)
              ? parsed.sentences.map((s) => s.s).join(" ")
              : data.transcript;
          } catch {
            transcriptText = data.transcript;
          }
          onTranscript?.(transcriptText);
        }

        setProcessing(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorderRef.current.start();
      setRecording(true);

      timerRef.current = setTimeout(() => {
        tryCatch(() => recorderRef.current.stop());
        setRecording(false);
      }, maxDuration);
    } else {
      clearTimeout(timerRef.current);
      tryCatch(() => recorderRef.current.stop());
      setRecording(false);
    }
  };

  return { recording, processing, toggleRecording, setLang };
}
