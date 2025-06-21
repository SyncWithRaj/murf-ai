// app/api/summarize/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { text } = await req.json();

    // Use Gemini 1.5 or latest version
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-latest" });

    // Request content as a plain string
    const result = await model.generateContent(`Summarize this:\n\n${text}`);

    // Extract the summary from the response
    const summary = result.response.text();

    if (!summary) {
      throw new Error("No summary returned.");
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("❌ AI Summarization Error:", error);
    return NextResponse.json({ error: "Failed to summarize." }, { status: 500 });
  }
}
