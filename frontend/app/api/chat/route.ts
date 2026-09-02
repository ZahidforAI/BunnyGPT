import { NextResponse } from "next/server";

import type { ChatRequest } from "@/lib/chat-types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const langchainApiUrl = (
      process.env.LANGCHAIN_API_URL?.trim() || "http://127.0.0.1:8000"
    ).replace(/\/$/, "");
    const body = (await request.json()) as Partial<ChatRequest>;
    const response = await fetch(`${langchainApiUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok || !response.body) {
      const detail = await response.text();
      console.error("LangChain API error", response.status, detail.slice(0, 280));
      return NextResponse.json(
        { error: "The BunnyGPT service could not process the request." },
        { status: response.status || 502 },
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("LangChain proxy error", error);
    return NextResponse.json(
      {
        error: "The BunnyGPT service is temporarily unavailable. Please try again shortly.",
      },
      { status: 502 },
    );
  }
}
