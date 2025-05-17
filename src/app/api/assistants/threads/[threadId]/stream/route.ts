import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { handleFunctionCall } from "@/lib/assistant/utils";
import type { RunCreateParamsBaseStream } from "openai/lib/AssistantStream.mjs";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = await params;

    // Create a new run on that thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });
    const body: RunCreateParamsBaseStream = {
      stream: true,
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    };
    // Stream that run's output
    const stream = await openai.beta.threads.runs.stream(threadId, body);

    // Add error handling for events
    stream.on("error", (error) => {
      console.error("Stream error:", error);
    });

    stream.on("event", async (event) => {
      console.log(`Event received: ${event.event}`);

      if (event.event === "thread.run.requires_action") {
        try {
          const toolCalls =
            event.data.required_action.submit_tool_outputs.tool_calls;

          console.log(`Processing ${toolCalls.length} tool calls`);

          const toolCallOutputs = await Promise.all(
            toolCalls.map(async (toolCall) => {
              const result = await handleFunctionCall(toolCall);
              return { output: result, tool_call_id: toolCall.id };
            })
          );

          await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
            tool_outputs: toolCallOutputs,
          });

          console.log("Tool outputs submitted successfully");
        } catch (error) {
          console.error("Error handling tool calls:", error);
        }
      }
    });

    return new NextResponse(stream.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Error streaming assistant run:", err);
    return NextResponse.json(
      { error: "Failed to stream assistant run." },
      { status: 500 }
    );
  }
}
