"use client";

import { useEffect, useState } from "react";

interface CellProps {
  value: string;
  status?: string;
  isActive?: boolean;
}

export default function Cell({ value, status, isActive }: CellProps) {
  const [flipped, setFlipped] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (status) {
      const t = setTimeout(() => setFlipped(true), 100);
      return () => clearTimeout(t);
    } else {
      setFlipped(false);
    }
  }, [status]);

  useEffect(() => {
    if (!isActive) { setBlink(true); return; }
    const iv = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(iv);
  }, [isActive]);

  const statusClasses: Record<string, string> = {
    correct: "bg-emerald-500 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.5)] text-white",
    present: "bg-amber-500 border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.5)] text-white",
    absent:  "bg-zinc-600 border-zinc-500 text-white",
  };

  let faceClass = "";
  let faceStyle: React.CSSProperties = {};

  if (status) {
    faceClass = statusClasses[status] || "";
  } else if (isActive) {
    faceClass = "border-indigo-400 shadow-[0_0_14px_rgba(99,102,241,0.4)]";
    faceStyle = { backgroundColor: "var(--bg-cell-filled)", color: "var(--text-primary)" };
  } else if (value) {
    faceClass = "scale-105";
    faceStyle = {
      backgroundColor: "var(--bg-cell-filled)",
      borderColor: "var(--cell-border-filled)",
      color: "var(--text-primary)",
    };
  } else {
    faceStyle = {
      backgroundColor: "var(--cell-empty)",
      borderColor: "var(--cell-border-empty)",
      color: "var(--text-primary)",
    };
  }

  return (
    <div className="w-10 h-10 [perspective:400px]">
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateX(360deg)]" : ""
        }`}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center text-base font-bold rounded-lg border-2 [backface-visibility:hidden] select-none transition-all duration-150 ${faceClass}`}
          style={faceStyle}
        >
          {isActive && !value ? (
            <span
              className="w-0.5 h-5 bg-indigo-400 rounded"
              style={{ opacity: blink ? 1 : 0, transition: "opacity 0.08s" }}
            />
          ) : (
            value || ""
          )}
        </div>
      </div>
    </div>
  );
}