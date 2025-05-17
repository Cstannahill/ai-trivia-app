import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { handleFunctionCall } from "@/lib/assistant/utils";
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";

const ASSISTANT_ID = "asst_Leq2DBlCte1LbQTiYfDBAlPL";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: { threadId: string } } // ← keep the promise wrapper out
) {
  try {
    const { threadId } = context.params; // ✅ no Next.js warning now

    /* 1️⃣ find active run */
    const runs = await openai.beta.threads.runs.list(threadId, { limit: 20 });
    let run = runs.data.find((r) =>
      ["in_progress", "queued"].includes(r.status)
    );

    /* 2️⃣ create one if none */
    if (!run) {
      run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID,
      });
    }

    /* 3️⃣ open stream for this run (run.id is guaranteed) */
    const oaStream = await openai.beta.threads.runs.stream(threadId, run.id);

    oaStream.on("error", (err) => console.error("Stream error ▶", err));

    oaStream.on("event", async (evt: AssistantStreamEvent) => {
      if (evt.event !== "thread.run.requires_action") return;

      const outputs = await Promise.all(
        evt.data.required_action.submit_tool_outputs.tool_calls.map(
          async (tc) => ({
            tool_call_id: tc.id,
            output: await handleFunctionCall(tc),
          })
        )
      );

      await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
        tool_outputs: outputs,
      });
    });

    return new NextResponse(oaStream.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Fatal assistant stream error ▶", err);
    return NextResponse.json(
      { error: "Failed to initialise assistant stream" },
      { status: 500 }
    );
  }
}
