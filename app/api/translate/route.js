import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { texts, targetLanguage } = body;

    // Validate input
    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLanguage) {
      return new Response(JSON.stringify({ error: "❌ Missing or invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Murf API config
    const options = {
      method: "POST",
      url: "https://api.murf.ai/v1/text/translate",
      headers: {
        "api-key": process.env.MURF_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        targetLanguage,
        texts,
      },
    };

    // Make request to Murf API
    const response = await axios.request(options);

    return new Response(JSON.stringify({ result: response.data }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Translate Error:", err?.response?.data || err.message);
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
