import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    const prompt = `Summarize this study material into bullet points:\n\n${text.slice(0, 3000)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes PDFs into study notes." },
        { role: "user", content: prompt },
      ],
    });

    const summary = completion.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Summarization Error:", err);
    return new Response(JSON.stringify({ error: "Failed to summarize" }), {
      status: 500,
    });
  }
}
