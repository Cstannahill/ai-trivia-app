import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string; runId: string }> }
) {
  try {
    const { threadId, runId } = await params;

    // Retrieve the run status
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    return NextResponse.json(run);
  } catch (error) {
    console.error("Error retrieving run:", error);
    return NextResponse.json(
      { error: "Failed to retrieve run", details: error },
      { status: 500 }
    );
  }
}
