"use client";

interface NumpadProps {
  onDigit: (d: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  inputLength: number;
  disabled?: boolean;
}

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["del", "0", "enter"],
];

export default function Numpad({ onDigit, onDelete, onSubmit, inputLength, disabled }: NumpadProps) {
  const handleKey = (key: string) => {
    if (key === "del") onDelete();
    else if (key === "enter") onSubmit();
    else onDigit(key);
  };

  return (
    <div className="grid grid-rows-4 gap-2 w-full max-w-[280px]">
      {ROWS.map((row, ri) => (
        <div key={ri} className="grid grid-cols-3 gap-2">
          {row.map((key) => {
            const isEnter = key === "enter";
            const isDel = key === "del";
            const enterReady = isEnter && inputLength === 8 && !disabled;

            return (
              <button
                key={key}
                onPointerDown={(e) => { e.preventDefault(); handleKey(key); }}
                disabled={disabled && !isDel}
                className="h-14 rounded-xl text-sm font-bold border-2 transition-all duration-100 active:scale-95 select-none touch-none"
                style={
                  isEnter
                    ? enterReady
                      ? { background: "#4f46e5", borderColor: "#818cf8", color: "#fff" }
                      : { backgroundColor: "var(--bg-stat)", borderColor: "var(--border)", color: "var(--text-muted)", cursor: "not-allowed" }
                    : isDel
                    ? { backgroundColor: "var(--bg-stat)", borderColor: "var(--border)", color: "#f87171" }
                    : { backgroundColor: "var(--bg-stat)", borderColor: "var(--border)", color: "var(--text-primary)" }
                }
              >
                {key === "del" ? "⌫" : key === "enter" ? "↵" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}