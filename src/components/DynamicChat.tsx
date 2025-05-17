"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
import { AssistantStream } from "openai/lib/AssistantStream";
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

type MessageProps = { role: "user" | "assistant" | "code"; text: string };

// ───────────────────────────────────────────────────────────
//  UI helpers
// ───────────────────────────────────────────────────────────
const Msg = ({ role, text }: MessageProps) => {
  if (role === "user") return <div className={styles.userMessage}>{text}</div>;
  if (role === "code")
    return (
      <div className={styles.codeMessage}>
        {text.split("\n").map((l, i) => (
          <div key={i}>
            <span>{i + 1}. </span>
            {l}
          </div>
        ))}
      </div>
    );
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  Component
// ───────────────────────────────────────────────────────────
type ChatProps = {
  assistantId: string;
  initialThreadId?: string | null;
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const defaultFunctionHandler = async (
  toolCall: RequiredActionFunctionToolCall
) => {
  const { name, arguments: argsString } = toolCall.function;
  if (name === "save_character_profile") {
    const { profile } = JSON.parse(argsString);
    const res = await fetch("/api/whoBeI/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    return JSON.stringify(await res.json());
  }
  return "Tool not supported.";
};

export default function DynamicChat({
  assistantId,
  initialThreadId = null,
  functionCallHandler = defaultFunctionHandler,
}: ChatProps) {
  // ─── local state ────────────────────────────────────────
  const [threadId, setThreadId] = useState<string | null>(initialThreadId);
  const [runId, setRunId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  // ─── refs for autoscroll ────────────────────────────────
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // ─────────────────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────────────────
  const appendMsg = (role: MessageProps["role"], text = "") =>
    setMessages((m) => [...m, { role, text }]);

  const appendToLast = (delta: string) =>
    setMessages((m) => {
      const last = m[m.length - 1];
      return [...m.slice(0, -1), { ...last, text: last.text + delta }];
    });

  // ─────────────────────────────────────────────────────────
  //  Backend orchestration
  // ─────────────────────────────────────────────────────────
  const ensureThread = useCallback(async (): Promise<string> => {
    if (threadId) return threadId;

    const res = await fetch("/api/assistants/threads/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantId }), // store assistant in metadata
    });

    const { id } = await res.json(); // backend returns { id }
    setThreadId(id);
    return id;
  }, [assistantId, threadId]);

  const startRun = async (tId: string): Promise<string> => {
    const res = await fetch(`/api/assistants/threads/v2/${tId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantId }),
    });
    const data = await res.json();
    setRunId(data.id);
    return data.id;
  };

  const pollRun = async (
    tId: string,
    rId: string
  ): Promise<"completed" | "failed"> => {
    let status = "queued";
    while (!["completed", "failed", "cancelled", "expired"].includes(status)) {
      const res = await fetch(`/api/assistants/threads/v2/${tId}/run/${rId}`);
      status = (await res.json()).status;
      if (status === "completed") return "completed";
      if (["failed", "cancelled", "expired"].includes(status)) return "failed";
      await new Promise((r) => setTimeout(r, 1000));
    }
    return "failed";
  };

  const streamAssistant = async (tId: string) => {
    const res = await fetch(
      `/api/assistants/threads/v2/${tId}/stream?assistantId=${assistantId}`
    );
    if (!res.body) throw new Error("No stream body");
    const stream = AssistantStream.fromReadableStream(res.body);

    // text
    stream.on("textCreated", () => appendMsg("assistant", ""));
    stream.on("textDelta", (d) => d.value && appendToLast(d.value));

    // images
    stream.on("imageFileDone", (img) =>
      appendToLast(`\n![${img.file_id}](/api/files/${img.file_id})\n`)
    );

    // code interpreter (simple echo)
    stream.on(
      "toolCallCreated",
      (tc) => tc.type === "code_interpreter" && appendMsg("code", "")
    );
    stream.on(
      "toolCallDelta",
      (d) =>
        d.type === "code_interpreter" &&
        d.code_interpreter?.input &&
        appendToLast(d.code_interpreter.input)
    );

    // function calls & run completion
    stream.on("event", async (e) => {
      if (e.event === "thread.run.requires_action") {
        const rc = e as AssistantStreamEvent.ThreadRunRequiresAction;
        const outputs = await Promise.all(
          rc.data.required_action.submit_tool_outputs.tool_calls.map(
            async (tc) => ({
              tool_call_id: tc.id,
              output: await functionCallHandler(tc),
            })
          )
        );

        // send action results & chain new stream
        const actRes = await fetch(
          `/api/assistants/threads/v2/${tId}/actions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              runId: rc.data.id,
              toolCallOutputs: outputs,
            }),
          }
        );
        const actStream = AssistantStream.fromReadableStream(actRes.body!);
        handleReadableStream(actStream); // recurse
      }
      if (e.event === "thread.run.completed") setInputDisabled(false);
    });
  };

  const handleReadableStream = (s: AssistantStream) => {
    s.on("textCreated", () => appendMsg("assistant", ""));
    s.on("textDelta", (d) => d.value && appendToLast(d.value));
  };

  // ─── Submit handler ──────────────────────────────────────
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    appendMsg("user", userInput);
    setInputDisabled(true);
    setUserInput("");

    try {
      const tId = await ensureThread();

      // 1. add message to thread
      await fetch(`/api/assistants/threads/v2/${tId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userInput }),
      });

      // 2. (re)use run or create new
      let rId = runId;
      let runStatus: "completed" | "failed" = "completed";
      if (rId) {
        runStatus = await pollRun(tId, rId);
      }
      if (!rId || runStatus !== "completed") {
        rId = await startRun(tId);
        await pollRun(tId, rId);
      }

      // 3. stream response
      await streamAssistant(tId);
    } catch (err) {
      console.error(err);
      setInputDisabled(false);
    }
  };

  // ─── Reset thread when assistantId changes ───────────────
  useEffect(() => {
    setThreadId(null);
    setMessages([]);
    setRunId(null);
  }, [assistantId]);

  // ─────────────────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <Msg key={i} {...m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={submit}
        className={`${styles.inputForm} ${styles.clearfix}`}
      >
        <input
          className={styles.input}
          placeholder="Enter your question"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={inputDisabled}
        />
        <button className={styles.button} disabled={inputDisabled}>
          Send
        </button>
      </form>
    </div>
  );
}
