"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRunId, setRunStatus } from "@/store/slices/appSlice";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type WhoBeIChatProps = {
  sessionId: string;
  threadId: string;
  profile: any;
  onProfileUpdate?: (profile: any) => void;
};

export default function WhoBeIChat({
  profile,
  sessionId,
  threadId,
  onProfileUpdate,
}: WhoBeIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    setMessages([]);
    setInput("");
    setStatusMessage(null);
    setLoading(false);
  }, [sessionId, profile]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);
    setStatusMessage("Processing your question...");

    const res = await fetch("/api/whoBeI/question", {
      method: "POST",
      body: JSON.stringify({ sessionId, profile, input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: data.response },
    ]);
    setInput("");
    setLoading(false);
    setStatusMessage(null);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {!profile?.name && (
        <div className="text-center italic text-gray-600">
          Waiting for character profile...
        </div>
      )}

      <div className="bg-gray-400 rounded p-4 h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black border"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {statusMessage && (
        <div className="text-sm text-gray-600 italic text-center">
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSend} className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a yes/no question or guess the identity..."
            className="flex-grow p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
