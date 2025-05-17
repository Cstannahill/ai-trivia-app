// …/threads/v2/[threadId]/run/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { assistantId, toolChoice } = await req.json(); // assistantId **required**

  const run = await openai.beta.threads.runs.create(params.threadId, {
    assistant_id: assistantId,
    tool_choice: toolChoice ?? "auto",
  });

  return NextResponse.json(run, { status: 201 });
}
