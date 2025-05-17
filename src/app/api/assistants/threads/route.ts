import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(_req: NextRequest) {
  try {
    const thread = await openai.beta.threads.create();
    console.log("Thread created:", thread.id);
    return NextResponse.json({ threadId: thread.id });
  } catch (err) {
    console.error("Failed to create thread:", err);
    return NextResponse.json(
      { error: "Failed to create assistant thread" },
      { status: 500 }
    );
  }
}
