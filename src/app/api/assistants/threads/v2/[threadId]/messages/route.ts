// …/threads/v2/[threadId]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { content, role = "user" } = await req.json();
  await openai.beta.threads.messages.create(params.threadId, { role, content });
  return NextResponse.json({ ok: true }, { status: 201 });
}
