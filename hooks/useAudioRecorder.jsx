import { useState, useRef, useEffect } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

export function useAudioRecorder({ onTranscript, maxDuration = 10000 }) {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const toggleRecording = async () => {
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
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

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
            onTranscript?.(transcriptText);
          } else {
            console.error("❌ Transcribe error:", data);
          }
        } catch (err) {
          console.error("❌ Fetch error:", err);
        }
      };

      recorderRef.current.start();
      setRecording(true);

      timerRef.current = setTimeout(() => {
        if (recorderRef.current) {
          recorderRef.current.stop();
          setRecording(false);
        }
      }, maxDuration);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  return { recording, toggleRecording };
}
