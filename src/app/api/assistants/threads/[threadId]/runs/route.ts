import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const runs = await openai.beta.threads.runs.list(threadId);

    return NextResponse.json({ data: runs.data });
  } catch (err) {
    console.error("Failed to list assistant runs:", err);
    return NextResponse.json(
      { error: "Could not fetch run history." },
      { status: 500 }
    );
  }
}
