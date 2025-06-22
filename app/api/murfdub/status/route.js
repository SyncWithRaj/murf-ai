import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.murf.ai/v1/murfdub/jobs/${jobId}/status`,
      {
        headers: {
          "api-key": process.env.MURF_DUB_API_KEY, // ✅ Use correct key
        },
      }
    );

    // ✅ Log correct response
    console.log("✅ Murf Status for", jobId, "=>", response.data);

    return NextResponse.json(response.data);
  } catch (err) {
    console.error("❌ Dubbing Status Error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.error_message || "Failed to fetch status" },
      { status: 500 }
    );
  }
}
