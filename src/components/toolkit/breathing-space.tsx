"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Breathing space — a calm full-screen reset, part of Cool-Down and reachable on its own from the Toolkit
// drawer. Paced breathing taught with the classic kid-friendly metaphor: SMELL THE FLOWERS (breathe in, the
// bloom grows) → BLOW THE CANDLE (breathe out, it shrinks). Light in-game backdrop (matches the rest of the
// app). Reduced-motion gets a still bloom + the same text cue. No fail, no timer.
const IN_MS = 4000;
const OUT_MS = 6000;

export function BreathingSpace({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const reduce =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    let stop = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = (p: "in" | "out") => {
      if (stop) return;
      setPhase(p);
      t = setTimeout(() => tick(p === "in" ? "out" : "in"), p === "in" ? IN_MS : OUT_MS);
    };
    tick("in");
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, []);

  const big = phase === "in"; // in = smell the flowers (grow); out = blow the candle (shrink)
  const tint = big ? "236,72,153" : "251,146,60"; // flower pink / candle warm
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-10 px-6" style={{ backgroundColor: "var(--color-paper)", backgroundImage: "var(--app-bg)" }}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close breathing space"
        className="glass-pill absolute right-4 top-4 flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-95"
      >
        <X className="size-5" aria-hidden />
      </button>

      <p className="text-center text-2xl font-extrabold text-foreground" aria-live="polite">
        {big ? "Smell the flowers 🌸" : "Blow the candle 🕯️"}
      </p>

      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 220,
          height: 220,
          background: `radial-gradient(circle, rgba(${tint},0.45), rgba(${tint},0.10))`,
          transform: `scale(${reduce ? 0.85 : big ? 1 : 0.5})`,
          transition: reduce ? "none" : `transform ${big ? IN_MS : OUT_MS}ms ease-in-out`,
          boxShadow: `0 0 55px rgba(${tint},0.32)`,
        }}
      >
        <span className="text-6xl" aria-hidden>{big ? "🌸" : "🕯️"}</span>
      </div>

      <p className="max-w-xs text-center text-sm text-foreground/70">
        {big ? "Breathe in slowly through your nose — like smelling a flower." : "Now breathe out slowly — like gently blowing out a candle."}
      </p>
    </div>
  );
}
