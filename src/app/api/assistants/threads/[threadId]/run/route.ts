import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    // 🛑 Check for active runs
    const runs = await openai.beta.threads.runs.list(threadId);
    const isActive = runs.data.some((run) =>
      ["queued", "in_progress"].includes(run.status)
    );

    if (isActive) {
      return NextResponse.json(
        { error: "Thread already has an active run." },
        { status: 409 }
      );
    }

    // ✅ Safe to start a new run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    return NextResponse.json({ id: run.id, status: run.status });
  } catch (err) {
    console.error("Error starting assistant run:", err);
    return NextResponse.json({ error: "Failed to start run" }, { status: 500 });
  }
}
