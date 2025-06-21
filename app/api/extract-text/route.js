// app/api/extract-text/route.js
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

// 👇 This is critical — force Node.js runtime!
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("❌ PDF Parse Error:", error);
    return NextResponse.json({ error: "Failed to extract text from PDF." }, { status: 500 });
  }
}
