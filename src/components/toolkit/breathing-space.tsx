"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Breathing space — a calm full-screen reset, part of Cool-Down and reachable on its own from the
// Toolkit drawer (the wellbeing shell's "one tap from anywhere" calm screen). A slow expand/contract
// guides paced breathing; reduced-motion gets a still circle and the same text cue. No fail, no timer.
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

  const big = phase === "in";
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-10 bg-slate-950/85 px-6 backdrop-blur-xl">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close breathing space"
        className="glass-pill absolute right-4 top-4 flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-95"
      >
        <X className="size-5" aria-hidden />
      </button>

      <p className="text-center text-xl font-bold text-foreground/90" aria-live="polite">
        {big ? "Breathe in…" : "Breathe out…"}
      </p>

      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 220,
          height: 220,
          background: "radial-gradient(circle, rgba(120,180,255,0.55), rgba(120,180,255,0.12))",
          transform: `scale(${reduce ? 0.85 : big ? 1 : 0.55})`,
          transition: reduce ? "none" : `transform ${big ? IN_MS : OUT_MS}ms ease-in-out`,
          boxShadow: "0 0 60px rgba(120,180,255,0.4)",
        }}
      >
        <span className="text-5xl" aria-hidden>
          🫧
        </span>
      </div>

      <p className="max-w-xs text-center text-sm text-foreground/60">
        Slow and gentle — there's no rush. Stay as long as you like.
      </p>
    </div>
  );
}
