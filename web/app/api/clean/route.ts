import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { rawText } = await request.json();

    if (!rawText) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a transaction data cleaner. Your task is to extract and structure transaction information from raw OCR text.

Given the following raw OCR text from a receipt/transaction image, please:
1. Extract all relevant transaction information (store name, date, items, prices, total, etc.)
2. Clean up any OCR errors or garbled text
3. Format the output as a well-structured Markdown document
4. If certain information is unclear or missing, indicate it with "[Unclear]"

Here is the raw OCR text:

---
${rawText}
---

Please provide the cleaned and structured transaction data in Markdown format. Only return the Markdown content, no additional explanations.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Transaction OCR Cleaner",
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e2b-it:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "AI cleaning failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    let markdown = data.choices?.[0]?.message?.content || "";

    // Bersihkan pembungkus blok kode jika ada (kotak kayu)
    markdown = markdown.replace(/^```markdown\n?/i, "").replace(/\n?```$/i, "").trim();

    return NextResponse.json({ markdown });
  } catch (error) {
    console.error("Clean API error:", error);
    return NextResponse.json(
      { error: "Failed to clean data" },
      { status: 500 }
    );
  }
};
