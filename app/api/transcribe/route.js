export async function POST(req) {
  try {
    console.log("✅ POST /api/transcribe");

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const BASE_URL = "https://api.deepgram.com/v1/listen";

    async function transcribe(language) {
      const res = await fetch(
        `${BASE_URL}?model=nova-2-general&language=${language}&punctuate=true&smart_format=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
            "Content-Type": "audio/webm",
          },
          body: audioBuffer,
        },
      );

      return res.json();
    }

    let data = await transcribe("en");

    let transcript =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();

    let language = "en";

    console.log("🧠 EN result:", transcript);

    if (!transcript || transcript.length < 2) {
      console.log("🔄 Switching to Russian...");

      data = await transcribe("ru");

      transcript =
        data?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();

      language = "ru";
    }

    if (!transcript) {
      return Response.json(
        { error: "Speech not recognized", details: data },
        { status: 400 },
      );
    }

    return Response.json({
      success: true,
      transcript,
      language,
    });
  } catch (err) {
    console.error("❌ Error:", err);

    return Response.json(
      { error: "Internal server error", details: err.message },
      { status: 500 },
    );
  }
}
