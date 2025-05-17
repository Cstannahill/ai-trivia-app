"use client";
import WhoBeIStart from "@/components/WhoBeIStart";
import WhoBeIChat from "@/components/WhoBeIChat";
import { useState } from "react";

export default function Page() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  return (
    <div className="p-6">
      {!threadId && (
        <WhoBeIStart
          onStart={(id, profile, threadId) => {
            setSessionId(id);
            setProfile(profile);
            setThreadId(threadId);
          }}
        />
      )}
      {threadId && (
        <WhoBeIChat
          sessionId={sessionId!}
          profile={profile}
          threadId={threadId}
        />
      )}
    </div>
  );
}
