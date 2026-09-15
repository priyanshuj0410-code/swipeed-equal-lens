"use client";

import type { RunResult } from "@/lib/use-run-game";

// The run's outcome beat: the character "sees clearly" (high Clarity) or a gentle, reflective
// "the signs were there: let's look again" (low Clarity). Never "you failed". Shown atop the debrief.
export function ResolutionBeat({ result }: { result: RunResult }) {
  const clear = result.outcome === "clear";
  return (
    <div className="text-center">
      <div className="text-5xl" aria-hidden>
        {clear ? "🌟" : "🫶"}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-2xl" aria-hidden>
        {result.character.avatar}
      </div>
      <h2 className="mt-1 font-display text-xl font-bold" style={{ color: clear ? "#62e08f" : "#b3c8ff" }}>
        {clear ? `${result.character.name} sees it clearly` : "The signs were there"}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{result.resolutionText}</p>
    </div>
  );
}
