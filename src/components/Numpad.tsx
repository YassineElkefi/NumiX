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
    if (disabled && key !== "del") return;
    if (key === "del") onDelete();
    else if (key === "enter") onSubmit();
    else onDigit(key);
  };

  return (
    <div className="w-full grid gap-2.5 px-1" style={{ gridTemplateRows: "repeat(4, 1fr)" }}>
      {ROWS.map((row, ri) => (
        <div key={ri} className="grid grid-cols-3 gap-2.5">
          {row.map((key) => {
            const isEnter = key === "enter";
            const isDel = key === "del";
            const enterReady = isEnter && inputLength === 8 && !disabled;
            const isDisabled = disabled && !isDel;

            return (
              <button
                key={key}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (!isDisabled) handleKey(key);
                }}
                aria-label={key === "del" ? "Delete" : key === "enter" ? "Submit" : key}
                className={`
                  relative h-16 rounded-2xl text-lg font-extrabold
                  border-2 select-none touch-none
                  transition-all duration-100 active:scale-95 active:brightness-90
                  ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                `}
                style={
                  isEnter
                    ? enterReady
                      ? {
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          borderColor: "#818cf8",
                          color: "#fff",
                          boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
                        }
                      : {
                          backgroundColor: "var(--bg-stat)",
                          borderColor: "var(--border)",
                          color: "var(--text-muted)",
                        }
                    : isDel
                    ? {
                        backgroundColor: "var(--bg-stat)",
                        borderColor: "var(--border)",
                        color: "#f87171",
                        fontSize: "22px",
                      }
                    : {
                        backgroundColor: "var(--bg-stat)",
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                      }
                }
              >
                {/* Inner highlight for depth */}
                <span
                  className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-30"
                  style={{ background: "linear-gradient(90deg, transparent, #fff, transparent)" }}
                />
                {key === "del" ? "⌫" : key === "enter" ? "↵" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}