export async function POST(req) {
  try {
    console.log("✅ POST /api/transcribe called");

    const formData = await req.formData();
    const createResponse = await fetch(
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
    const createResult = await createResponse.json();
    console.log("📩 createResult:", createResult);

    if (!createResult.taskId) {
      return new Response(
        JSON.stringify({
          error: "Failed to create task",
          details: createResult,
        }),
        { status: 400 }
      );
    }

    const taskId = createResult.taskId;
    let result = null;
    let attempts = 0;
    const maxAttempts = 20;

    while (!result && attempts < maxAttempts) {
      attempts++;
      const queryResponse = await fetch(
        `https://api.speechflow.io/asr/file/v1/query?taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            keyId: process.env.SPEECHFLOW_KEY_ID,
            keySecret: process.env.SPEECHFLOW_KEY_SECRET,
          },
        }
      );

      const queryResult = await queryResponse.json();
      console.log("⏳ queryResult:", queryResult);

      if (queryResult.code === 11000 && queryResult.result) {
        result = queryResult.result;
        break;
      }

      if (queryResult.code === 11001) {
        await new Promise((res) => setTimeout(res, 3000));
        continue;
      }

      if (queryResult.code === 11405 || queryResult.code === 11499) {
        return new Response(
          JSON.stringify({
            error: "Audio read error or unknown error",
            details: queryResult,
          }),
          { status: 400 }
        );
      }

      await new Promise((res) => setTimeout(res, 3000));
    }

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Timeout or no result received" }),
        { status: 408 }
      );
    }

    return new Response(JSON.stringify({ transcript: result }), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500 }
    );
  }
}
