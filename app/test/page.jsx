"use client";
import { useState } from "react";

export default function TestPage() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendFile() {
    try {
      setTranscript("");
      setLoading(true);

      const fileResponse = await fetch("http://localhost:3000/buy-milk.wav");
      const fileBlob = await fileResponse.blob();

      const formData = new FormData();
      formData.append("lang", "en");
      formData.append("file", fileBlob, "buy-milk.wav");

      const createRequest = await fetch(
        "https://api.speechflow.io/asr/file/v1/create",
        {
          method: "POST",
          headers: {
            keyId: process.env.SPEECHFLOW_KEY_ID,
            keySecret: process.env.SPEECHFLOW_KEY_SECRET,
          },
          body: formData,
        }
      );

      const createResult = await createRequest.json();
      console.log("✅ Task created:", createResult);

      if (!createResult.taskId) {
        throw new Error("No taskId returned from API");
      }

      async function pollResult(taskId) {
        let finished = false;
        while (!finished) {
          console.log("⏳ Waiting for result...");

          const queryRequest = await fetch(
            `https://api.speechflow.io/asr/file/v1/query?taskId=${taskId}`,
            {
              method: "GET",
              headers: {
                keyId: process.env.SPEECHFLOW_KEY_ID,
                keySecret: process.env.SPEECHFLOW_KEY_SECRET,
              },
            }
          );

          const queryResult = await queryRequest.json();
          console.log("📩 API response:", queryResult);

          if (queryResult.status === "finished") {
            console.log("🎉 Transcription ready:", queryResult.result);
            setTranscript(queryResult.result);
            finished = true;
            setLoading(false);
          } else {
            await new Promise((res) => setTimeout(res, 3000));
          }
        }
      }

      pollResult(createResult.taskId);
    } catch (error) {
      console.error("❌ Error:", error);
      setTranscript("Something went wrong. Check console logs.");
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={sendFile}
        className="p-2 rounded bg-blue-600 text-white hover:bg-blue-800"
      >
        Send file
      </button>

      {loading && <p className="text-gray-500">Processing... please wait.</p>}
      {transcript && (
        <div className="p-4 rounded bg-gray-100">
          <h2 className="font-bold mb-2">Transcription result:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
