import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No audio file received",
        },
        { status: 400 },
      );
    }

    // Temporary local storage for development.
    // We will replace this with permanent production storage
    // before deployment.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fs = await import("fs/promises");
    const path = await import("path");

    const recordingsDir = path.join(
      process.cwd(),
      "public",
      "recordings",
    );

    await fs.mkdir(recordingsDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const fileName = `${timestamp}-${safeName}`;
    const filePath = path.join(recordingsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const origin = request.headers.get("origin");

    const baseUrl =
      origin ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const audioUrl = `${baseUrl}/recordings/${fileName}`;

    console.log("Audio recording uploaded:", audioUrl);

    return NextResponse.json({
      success: true,
      audioUrl,
    });
  } catch (error) {
    console.error("Audio upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload audio",
      },
      { status: 500 },
    );
  }
}