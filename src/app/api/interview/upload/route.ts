import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["video/webm"],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Interview recording uploaded:", blob.url);
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Interview upload token error:", error);

    return NextResponse.json(
      { error: "Unable to prepare recording upload." },
      { status: 500 }
    );
  }
}
