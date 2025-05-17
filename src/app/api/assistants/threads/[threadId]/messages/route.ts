import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  console.log("Post");
  try {
    const { content } = await req.json();
    const { threadId } = await params;
    console.log("Thread ID:", threadId);
    console.log("Content:", content);
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid content." },
        { status: 400 }
      );
    }

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding message to thread:", err);
    return NextResponse.json(
      { error: "Failed to add message." },
      { status: 500 }
    );
  }
}
