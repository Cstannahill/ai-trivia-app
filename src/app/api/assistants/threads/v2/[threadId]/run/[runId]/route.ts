// …/threads/v2/[threadId]/run/[runId]/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function GET(
  _req: Request,
  { params }: { params: { threadId: string; runId: string } }
) {
  const run = await openai.beta.threads.runs.retrieve(
    params.threadId,
    params.runId
  );
  return NextResponse.json({ status: run.status });
}
