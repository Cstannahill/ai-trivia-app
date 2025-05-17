"use client";

import { useState } from "react";

export default function WhoBeIDebugPanel({ profile }: { profile: any }) {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-6 text-gray-800">
      <button
        onClick={() => setShow(!show)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        {show ? "Hide Character Debug Info" : "Show Character Debug Info"}
      </button>

      {show && (
        <div className="mt-4 p-4 bg-gray-100 border rounded overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
