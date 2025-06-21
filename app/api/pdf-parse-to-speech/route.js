import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const voiceId = formData.get("voiceId") || "en-US-natalie";
    const style = formData.get("style") || "Promo";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text.trim();

    if (!text) {
      return NextResponse.json({ error: "No text extracted from PDF" }, { status: 400 });
    }

    const murfRes = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.MURF_API_KEY,
      },
      body: JSON.stringify({ text, voiceId, style }),
    });

    const murfData = await murfRes.json();

    if (!murfRes.ok || !murfData.audioFile) {
      return NextResponse.json({ error: "Murf API failed", details: murfData }, { status: 500 });
    }

    return NextResponse.json({ audioUrl: murfData.audioFile, text });

  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error", message: err.message }, { status: 500 });
  }
}
