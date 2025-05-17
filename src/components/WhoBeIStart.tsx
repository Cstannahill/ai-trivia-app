"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setSessionId, setThreadId } from "@/store/slices/appSlice";

type WhoBeIStartProps = {
  onStart: (sessionId: string, profile: any, threadId: string) => void;
};

export default function WhoBeIStart({ onStart }: WhoBeIStartProps) {
  const [useGenerated, setUseGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const startGame = async () => {
    setLoading(true);
    const sessionId = uuidv4();

    const res = await fetch("/api/whoBeI/start", {
      method: "POST",
      body: JSON.stringify({ useGenerated }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    dispatch(setSessionId(sessionId));

    // Optional: only set threadId if your backend returns it
    if (data.threadId) {
      dispatch(setThreadId(data.threadId));
      onStart(sessionId, data.profile, data.threadId);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={useGenerated}
          onChange={(e) => setUseGenerated(e.target.checked)}
        />
        Generate a new character using AI
      </label>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={startGame}
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
}
