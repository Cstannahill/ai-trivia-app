"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const logo = "/shadyt.png";

export default function Navbar() {
  const [showDebug, setShowDebug] = useState(false);

  const threadId = useSelector((state: RootState) => state.app.threadId);
  const sessionId = useSelector((state: RootState) => state.app.sessionId);
  const runStatus = useSelector((state: RootState) => state.app.runStatus);

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white border-b border-gray-700 shadow-md">
      {/* Left - Logo and Links */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            src={logo}
            alt="ShadyT Logo"
            width={40}
            height={40}
            className="rounded-lg border border-gray-400"
          />
        </Link>

        {[
          { href: "/trivia", label: "Trivia" },
          { href: "/archive", label: "Archive" },
          { href: "/whoBeI", label: "Who Be I" },
          { href: "/logicGrid", label: "Logic Grid" },
          { href: "/riddles", label: "Riddles" },
          { href: "/patterns", label: "Patterns" },
          { href: "/chat", label: "Chat" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm px-3 py-1 rounded-md border border-gray-500 hover:bg-gray-700 transition"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right - Debug Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowDebug((prev) => !prev)}
          className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 transition"
        >
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>

        {showDebug && (
          <div className="text-xs bg-gray-900 px-3 py-2 rounded border border-gray-600">
            <div>
              <strong>Session ID:</strong>{" "}
              <span className="text-green-300">{sessionId || "–"}</span>
            </div>
            <div>
              <strong>Thread ID:</strong>{" "}
              <span className="text-blue-300">{threadId || "–"}</span>
            </div>
            <div>
              <strong>Run Status:</strong>{" "}
              <span className="text-yellow-300">{runStatus || "–"}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
