import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const cv = formData.get("cv");

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!token || !baseId) {
      return NextResponse.json(
        { error: "Airtable configuration is missing." },
        { status: 500 }
      );
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const createResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent("AI Interview Coach")}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
          },
        }),
      }
    );

    const recordData = await createResponse.json();

    if (!createResponse.ok) {
      return NextResponse.json(
        {
          error:
            recordData?.error?.message ||
            "Failed to create Airtable record.",
        },
        { status: 500 }
      );
    }

    if (cv instanceof File && cv.size > 0) {
      const bytes = await cv.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      const uploadResponse = await fetch(
        `https://content.airtable.com/v0/${baseId}/${recordData.id}/${encodeURIComponent("Attachments")}/uploadAttachment`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            contentType: cv.type || "application/octet-stream",
            filename: cv.name,
            file: base64,
          }),
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        return NextResponse.json(
          {
            error:
              uploadData?.error?.message ||
              "Airtable record was created, but the CV upload failed.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      recordId: recordData.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Airtable submission failed.",
      },
      { status: 500 }
    );
  }
}
