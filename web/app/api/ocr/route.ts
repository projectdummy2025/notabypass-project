import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const ocrWorkerUrl = process.env.OCR_WORKER_URL || "http://localhost:8000";
    const ocrResponse = await fetch(`${ocrWorkerUrl}/process`, {
      method: "POST",
      body: formData,
    });

    if (!ocrResponse.ok) {
      const errorData = await ocrResponse.json();
      return NextResponse.json(
        { error: errorData.detail || "OCR processing failed" },
        { status: ocrResponse.status }
      );
    }

    const ocrData = await ocrResponse.json();
    return NextResponse.json(ocrData);
  } catch (error) {
    console.error("OCR API error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
};
