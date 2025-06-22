import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const language = formData.get("language") || "fr_FR"; // fallback

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const form = new FormData();
    form.append("file", buffer, {
      filename: "uploaded_video.mp4",
      contentType: "video/mp4",
    });
    form.append("file_name", "uploaded_video.mp4");
    form.append("priority", "LOW");
    form.append("target_locales", language); // dynamically passed locale

    const response = await axios.post(
      "https://api.murf.ai/v1/murfdub/jobs/create",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "api-key": process.env.MURF_DUB_API_KEY,
        },
      }
    );

    return NextResponse.json({ job_id: response.data.job_id });
  } catch (error) {
    console.error("Murf Dubbing Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_message || "Dubbing failed." },
      { status: 500 }
    );
  }
}
