// app/api/assistants/threads/v2/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { metadata } = await req.json();
  const assistantId = "asst_Leq2DBlCte1LbQTiYfDBAlPL";

  // You can tie a thread to an assistant by saving assistantId as metadata
  const thread = await openai.beta.threads.create({
    metadata: { assistantId, ...metadata },
  });

  return NextResponse.json({ id: thread.id }, { status: 201 });
}
