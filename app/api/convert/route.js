export async function POST(req) {
  const { text, voiceId, style } = await req.json();

  if (!text || !voiceId) {
    return new Response(
      JSON.stringify({ error: "Missing text or voiceId" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  console.log("📤 Sending to Murf:", { text, voiceId, style });

  try {
    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.MURF_API_KEY,
      },
      body: JSON.stringify({ text, voiceId, style }),
    });

    const data = await response.json();
    console.log("📥 Murf Response:", data);

    // ✅ fixed the key name here
    if (!response.ok || !data.audioFile) {
      return new Response(
        JSON.stringify({ error: "Murf API failed", details: data }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ audioUrl: data.audioFile }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error calling Murf API:", err);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
