import { useState, useRef, useEffect } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

export function useAudioRecorder({ onTranscript, maxDuration = 10000 }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        await register(await connect());
        console.log("🎤 WAV encoder registered once");
      } catch (err) {
        if (
          err.message &&
          err.message.includes("There is already an encoder stored")
        ) {
          console.log("ℹ️ Encoder already registered, skipping");
        } else {
          console.error("❌ Encoder register error:", err);
        }
      }
    })();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        try {
          recorderRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        const mimeType = MediaRecorder.isTypeSupported("audio/wav")
          ? "audio/wav"
          : "audio/webm";

        console.log("🎧 Using format:", mimeType);

        recorderRef.current = new MediaRecorder(stream, { mimeType });
        chunksRef.current = [];

        recorderRef.current.ondataavailable = (event) => {
          if (event.data && event.data.size > 0)
            chunksRef.current.push(event.data);
        };

        recorderRef.current.onstop = async () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }

          const rawBlob = new Blob(chunksRef.current, {
            type: recorderRef.current.mimeType,
          });

          setProcessing(true);

          let sendBlob = rawBlob;
          if (rawBlob.type !== "audio/wav") {
            try {
              sendBlob = await convertToWav(rawBlob, 16000);
            } catch (err) {
              console.warn("⚠️ convertToWav failed, sending raw blob:", err);
            }
          }

          const formData = new FormData();
          formData.append("file", sendBlob, "recording.wav");
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
                transcriptText = Array.isArray(parsed.sentences)
                  ? parsed.sentences.map((s) => s.s).join(" ")
                  : data.transcript;
              } catch (err) {
                transcriptText = data.transcript;
              }

              if (onTranscript && transcriptText) onTranscript(transcriptText);
            } else {
              console.error("❌ Transcribe error:", data);
            }
          } catch (err) {
            console.error("❌ Fetch error:", err);
          } finally {
            setProcessing(false);

            try {
              stream.getTracks().forEach((track) => track.stop());
            } catch (_) {}
          }
        };

        recorderRef.current.start();
        setRecording(true);

        timerRef.current = setTimeout(() => {
          if (recorderRef.current && recorderRef.current.state !== "inactive") {
            try {
              recorderRef.current.stop();
            } catch (_) {}
          }
          setRecording(false);
        }, maxDuration);
      } catch (err) {
        console.error("❌ Recording start error:", err);
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        try {
          recorderRef.current.stop();
        } catch (_) {}
      }
      setRecording(false);
    }
  };

  return { recording, processing, toggleRecording };
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
  for (let i = 0; i < audioBuffer.length; i++) {
    let sum = 0;
    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      sum += audioBuffer.getChannelData(ch)[i];
    }
    channelData[i] = sum / audioBuffer.numberOfChannels;
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
