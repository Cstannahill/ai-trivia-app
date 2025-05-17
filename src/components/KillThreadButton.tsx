"use client";
import { Toaster, toast } from "sonner";

export default function KillThreadButton() {
  const resetThread = () => {
    localStorage.removeItem("threadId");
    toast("Thread reset. You can now try again.");
  };

  return (
    <div className="text-center">
      <button
        className="px-3 py-1 text-xs bg-red-500 text-white rounded mb-2"
        onClick={() => {
          localStorage.removeItem("threadId");
          toast.success("Assistant thread has been reset.");
        }}
      >
        Reset Assistant Thread
      </button>
      <Toaster position="top-center" />
    </div>
  );
}
