export async function POST(req) {
  try {
    console.log("✅ POST /api/transcribe (Deepgram auto language)");

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const response = await fetch(
      "https://api.deepgram.com/v1/listen?detect_language=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": file.type || "audio/webm",
        },
        body: Buffer.from(arrayBuffer),
      }
    );

    const data = await response.json();
    console.log("📩 Deepgram response:", data);

    const transcript =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    const detectedLanguage =
      data?.results?.channels?.[0]?.detected_language;

    if (!transcript) {
      return new Response(
        JSON.stringify({
          error: "No transcript returned",
          details: data,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        transcript,
        language: detectedLanguage || "unknown",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Server error:", err);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}