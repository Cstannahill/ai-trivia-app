// …/threads/v2/[threadId]/actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { runId, toolCallOutputs } = await req.json();

  const run = await openai.beta.threads.runs.submitToolOutputs(
    params.threadId,
    runId,
    { tool_outputs: toolCallOutputs }
  );

  return NextResponse.json(run);
}
