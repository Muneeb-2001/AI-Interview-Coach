$file = "src\app\api\anam-session\route.ts"

$content = @"
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = process.env.ANAM_API_KEY;
    const personaId = process.env.ANAM_PERSONA_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANAM_API_KEY is not configured." },
        { status: 500 }
      );
    }

    if (!personaId) {
      return NextResponse.json(
        { error: "ANAM_PERSONA_ID is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.anam.ai/v1/auth/session-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          personaConfig: {
            personaId,
          },
        }),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Anam API error:", responseText);

      return NextResponse.json(
        {
          error: "Failed to create Anam session.",
          details: responseText,
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);

    return NextResponse.json({
      sessionToken: data.sessionToken,
    });
  } catch (error) {
    console.error("Anam session error:", error);

    return NextResponse.json(
      { error: "Failed to connect to Anam." },
      { status: 500 }
    );
  }
}
"@

Set-Content $file $content -Encoding UTF8

Write-Host "SUCCESS: Anam session route updated for persona-based sessions." -ForegroundColor Green
