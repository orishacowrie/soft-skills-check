import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("Content-Type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    // Same approach as candidate-routing: unpdf
    try {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });

      if (text && text.trim().length > 20) {
        return NextResponse.json({ text: text.trim() });
      }

      return NextResponse.json(
        { error: "Could not extract text from PDF. It may be image-based." },
        { status: 422 }
      );
    } catch (e) {
      console.error("[parse-pdf] unpdf failed:", e);
      return NextResponse.json(
        { error: "Failed to parse PDF" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[parse-pdf] error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
