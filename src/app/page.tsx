"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { generateNumber } from "@/src/utils/generateNumber";
import { checkGuess } from "@/src/utils/checkGuess";
import { useTheme } from "@/src/contexts/ThemeContext";
import Board from "@/src/components/Board";
import Numpad from "@/src/components/Numpad";

const MAX_GUESSES = 8;
type GameState = "playing" | "won" | "lost";

function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#6366f1","#a855f7","#ec4899","#f59e0b","#10b981","#38bdf8","#f97316"];
  const particles = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.4 - 20,
    w: Math.random() * 11 + 5,
    h: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 5,
    vy: Math.random() * 4 + 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.22,
    opacity: 1,
  }));

  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.09;
      p.rot += p.rotSpeed;
      if (frame > 110) p.opacity = Math.max(0, p.opacity - 0.013);
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 250) requestAnimationFrame(animate);
    else canvas.remove();
  };
  animate();
}

const HOW_TO_PLAY = [
  { color: "bg-emerald-500", label: "Green — right digit, right position" },
  { color: "bg-amber-500",   label: "Yellow — right digit, wrong position" },
  { color: "bg-zinc-500",    label: "Grey — digit not in the number" },
];

const VALID_PREFIXES = [
  { prefix: "2x", desc: "Ooredoo" },
  { prefix: "3x", desc: "Ooredoo" },
  { prefix: "5x", desc: "Orange TN" },  
  { prefix: "71/72", desc: "Tunisie Télécom" },
  { prefix: "9x", desc: "Tunisie Télécom" },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      className="flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-200 active:scale-95"
      style={{
        backgroundColor: "var(--bg-stat)",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Page() {
  const { theme } = useTheme();
  const [secret, setSecret] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<string[][]>([]);
  const [input, setInput] = useState("");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0, best: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = () => {
    setSecret(generateNumber());
    setGuesses([]);
    setResults([]);
    setInput("");
    setGameState("playing");
    setErrorMsg("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    initGame();
    const saved = localStorage.getItem("tnwordle-stats");
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const saveStats = (won: boolean, guessCount: number) => {
    setStats((prev) => {
      const next = {
        played: prev.played + 1,
        won: prev.won + (won ? 1 : 0),
        streak: won ? prev.streak + 1 : 0,
        best: won ? Math.max(prev.best, guessCount) : prev.best,
      };
      localStorage.setItem("tnwordle-stats", JSON.stringify(next));
      return next;
    });
  };

  const focusInput = () => {
    if (gameState === "playing") inputRef.current?.focus();
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setErrorMsg(""), 2200);
  };

  const handleSubmit = useCallback(() => {
    if (gameState !== "playing") return;
    if (input.length !== 8) { showError("Need all 8 digits"); return; }

    const validStarts = ["2", "3", "5", "9"];
    if (!validStarts.includes(input[0]) && input[0] !== "7") {
      showError("Invalid Tunisian prefix"); return;
    }
    if (input[0] === "7" && input[1] !== "1" && input[1] !== "2") {
      showError("7x must be 71… or 72…"); return;
    }

    const res = checkGuess(secret, input);
    const newGuesses = [...guesses, input];
    const newResults = [...results, res];
    setGuesses(newGuesses);
    setResults(newResults);
    setInput("");

    if (input === secret) {
      setGameState("won");
      saveStats(true, newGuesses.length);
      setTimeout(launchConfetti, 300);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState("lost");
      saveStats(false, 0);
    }
  }, [gameState, input, secret, guesses, results]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
    },
    [handleSubmit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setInput(val);
  };

  const guessesLeft = MAX_GUESSES - guesses.length;
  const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  return (
    <div
      className="relative overflow-x-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      onClick={focusInput}
    >
      {/* Ambient orbs */}
      <div
        className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--orb1)" }}
      />
      <div
        className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--orb2)" }}
      />

      {/* Hidden keyboard input */}
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={gameState !== "playing"}
        inputMode="numeric"
        className="sr-only"
        aria-label="Enter your guess"
        autoFocus
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--header-border)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "20px" }}>📞</span>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-indigo-400">Numi</span>
            <span style={{ color: "var(--text-primary)" }}>X</span>
          </span>
        </div>
        <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
          Guess the Tunisian phone number
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            🔥 {stats.streak}
          </span>
          <span style={{ color: "var(--text-muted)" }} className="text-xs">|</span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {winRate}% win
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-6 items-start">

        {/* LEFT: How to play */}
        <aside className="hidden lg:flex flex-col gap-4">
          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              How to play
            </h2>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              Guess the 8-digit Tunisian phone number in 8 tries. After each guess, colours show how close you were.
            </p>
            <div className="flex flex-col gap-2">
              {HOW_TO_PLAY.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`inline-block w-4 h-4 rounded-md flex-shrink-0 ${color}`} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              Example
            </h2>
            <div className="flex gap-1.5 mb-2">
              {["5","3","_","_","_","_","_","_"].map((d, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-md border-2 flex items-center justify-center text-xs font-bold ${
                    d === "5" ? "bg-emerald-500 border-emerald-400 text-white" :
                    d === "3" ? "bg-amber-500 border-amber-400 text-white" : ""
                  }`}
                  style={d === "_" ? {
                    backgroundColor: "var(--bg-cell)",
                    borderColor: "var(--cell-border-empty)",
                    color: "var(--text-muted)"
                  } : undefined}
                >
                  {d !== "_" ? d : ""}
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              5 is in the right spot. 3 exists but wrong position.
            </p>
          </div>

          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              Valid prefixes
            </h2>
            <div className="flex flex-col gap-1.5">
              {VALID_PREFIXES.map(({ prefix, desc }) => (
                <div key={prefix} className="flex items-center justify-between">
                  <span className="font-mono text-indigo-400 text-xs">{prefix}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: Board */}
        <div className="flex flex-col items-center gap-4">
          {/* Mobile legend */}
          <div className="flex lg:hidden gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
            {HOW_TO_PLAY.map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`inline-block w-3 h-3 rounded ${color}`} />
                {label.split("—")[0].trim()}
              </span>
            ))}
          </div>

          <div className={shake ? "animate-[shake_0.45s_ease]" : ""} onClick={focusInput}>
            <Board
              guesses={guesses}
              results={results}
              maxRows={MAX_GUESSES}
              currentInput={gameState === "playing" ? input : ""}
            />
          </div>

          <div className="h-5 text-center">
            {errorMsg ? (
              <p className="text-red-400 text-sm font-medium animate-pulse">{errorMsg}</p>
            ) : gameState === "playing" ? (
              <p className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
                {guessesLeft} guess{guessesLeft !== 1 ? "es" : ""} left · press Enter to submit
              </p>
            ) : null}
          </div>

          {gameState === "won" && (
            <div className="w-full text-center py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold animate-[fadeIn_0.4s_ease]">
              🎉 Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
            </div>
          )}
          {gameState === "lost" && (
            <div className="w-full text-center py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold animate-[fadeIn_0.4s_ease]">
              💀 It was{" "}
              <span className="font-mono tracking-widest" style={{ color: "var(--text-primary)" }}>
                {secret}
              </span>
            </div>
          )}

          {gameState !== "playing" && (
            <button
              onClick={(e) => { e.stopPropagation(); initGame(); }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-150 active:scale-95"
            >
              Play Again
            </button>
          )}

          {/* Mobile numpad */}
          <div className="flex lg:hidden mt-2" onClick={(e) => e.stopPropagation()}>
            <Numpad
              onDigit={(d) => setInput((p) => p.length < 8 ? p + d : p)}
              onDelete={() => setInput((p) => p.slice(0, -1))}
              onSubmit={handleSubmit}
              inputLength={input.length}
              disabled={gameState !== "playing"}
            />
          </div>
        </div>

        {/* RIGHT: Stats */}
        <aside className="hidden lg:flex flex-col gap-4">
          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              Your stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Played", value: stats.played },
                { label: "Won", value: stats.won },
                { label: "Win %", value: `${winRate}%` },
                { label: "Streak 🔥", value: stats.streak },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: "var(--bg-stat)" }}
                >
                  <div className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                    {value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              This game
            </h2>
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: MAX_GUESSES }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs w-3" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < guesses.length
                        ? guesses[i] === secret
                          ? "bg-emerald-500"
                          : "bg-zinc-500"
                        : i === guesses.length && gameState === "playing"
                        ? "bg-indigo-400/60 animate-pulse"
                        : ""
                    }`}
                    style={{
                      width:
                        i < guesses.length
                          ? "100%"
                          : i === guesses.length && gameState === "playing"
                          ? `${(input.length / 8) * 100}%`
                          : "20%",
                      backgroundColor:
                        i >= guesses.length && !(i === guesses.length && gameState === "playing")
                          ? "var(--bg-stat)"
                          : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              💡 Tip
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Start with a number containing many unique digits to eliminate possibilities quickly.
            </p>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-7px); }
          40%      { transform: translateX(7px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}