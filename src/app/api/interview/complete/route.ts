import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  "https://n8n.domingogarcia.info/webhook/interview-submit";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const transcript = String(formData.get("transcript") || "");
    const questionCount = String(formData.get("questionCount") || "0");
    const timeTaken = String(formData.get("timeTaken") || "0");
    const timeExceeded = String(formData.get("timeExceeded") || "false");
    const overtimeSeconds = String(formData.get("overtimeSeconds") || "0");
    const videoFile = formData.get("video") as File | null;

    if (!name || !email || !transcript.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const n8nFormData = new FormData();
    n8nFormData.append("name", name);
    n8nFormData.append("email", email);
    n8nFormData.append("transcript", transcript.trim());
    n8nFormData.append("questionCount", questionCount);
    n8nFormData.append("timeTaken", timeTaken);
    n8nFormData.append("timeExceeded", timeExceeded);
    n8nFormData.append("overtimeSeconds", overtimeSeconds);
    n8nFormData.append("submittedAt", new Date().toISOString());

    if (videoFile) {
      n8nFormData.append("video", videoFile, videoFile.name || "interview.webm");
    }

    console.log("Forwarding direct multipart interview data to n8n:", {
      name,
      email,
      hasVideo: Boolean(videoFile),
      videoSize: videoFile ? videoFile.size : 0,
    });

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      body: n8nFormData,
      cache: "no-store",
    });

    const n8nText = await n8nResponse.text();

    if (!n8nResponse.ok) {
      console.error("n8n webhook failed:", n8nResponse.status, n8nText);
      return NextResponse.json(
        {
          success: false,
          error: "n8n webhook failed",
          status: n8nResponse.status,
          details: n8nText,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview and raw video submitted directly to n8n",
    });
  } catch (error) {
    console.error("Error submitting interview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit interview" },
      { status: 500 }
    );
  }
}