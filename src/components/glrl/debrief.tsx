"use client";

import { useEffect } from "react";
import { RotateCcw, Repeat, Map, Sparkles } from "lucide-react";
import { useProfile } from "@/lib/store";
import { celebrate } from "@/lib/confetti";
import { sfx } from "@/lib/juice";
import { STORY_DECKS } from "@/content/runs";
import type { RunResult } from "@/lib/use-run-game";
import { ResolutionBeat } from "@/components/glrl/resolution";

/**
 * End-of-run debrief: the resolution beat, then a plain-terms summary (accuracy, the headline
 * disguised-card signal, missed signs), a "review the missed cards" button, XP, and back to the path.
 * Records completion (stars + XP) into the profile once on mount, so the GLRL node turns "completed".
 */
export function RunDebrief({
  result,
  onReplay,
  onReplayMissed,
  onExit,
}: {
  result: RunResult;
  onReplay: () => void;
  onReplayMissed: () => void;
  onExit: () => void;
}) {
  const { finishDeck, recordRun } = useProfile();

  useEffect(() => {
    finishDeck(result.deckId, result.stars, result.xp, result.bestCombo);
    recordRun({
      deckId: result.deckId,
      disgSeen: result.disgSeen,
      disgCorrect: result.disgCorrect,
      isStory: STORY_DECKS.some((d) => d.id === result.deckId),
    });
    if (result.outcome === "clear") {
      celebrate("big");
      sfx("win");
    }
    // record once on completion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missed = result.missed.filter((c) => !c.is_safeguarding);
  const missedNames = Array.from(new Set(missed.map((c) => c.sign)));

  return (
    <div className="glass-card w-full max-w-xs px-6 py-7 backdrop-blur-[14px] backdrop-saturate-150" style={{ color: "#eef1f7" }}>
      <ResolutionBeat result={result} />

      <dl className="mt-5 grid grid-cols-2 gap-2 text-center">
        <div className="glass-pill rounded-xl px-2 py-2 backdrop-blur-md">
          <dt className="text-[10px] uppercase tracking-wide text-white/65">Read right</dt>
          <dd className="font-display text-lg font-bold">{result.correct}/{result.total}</dd>
        </div>
        <div className="glass-pill rounded-xl px-2 py-2 backdrop-blur-md">
          <dt className="text-[10px] uppercase tracking-wide text-white/65">Disguised</dt>
          <dd className="font-display text-lg font-bold">{result.disgCorrect}/{result.disgSeen}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-center gap-3 text-sm">
        <span className="flex items-center gap-1 font-bold" style={{ color: "var(--accent-amber)" }}>
          <Sparkles className="size-4" aria-hidden /> +{result.xp} XP
        </span>
        {result.bestCombo >= 3 && <span className="text-white/75">best combo ×{result.bestCombo}</span>}
      </div>

      {missedNames.length > 0 && (
        <p className="mt-3 text-center text-xs text-white/70">
          To look again: {missedNames.slice(0, 4).join(" · ")}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        {missed.length > 0 && (
          <button
            type="button"
            onClick={onReplayMissed}
            className="glass-pill flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
          >
            <Repeat className="size-4" aria-hidden /> Review the {missed.length} you missed
          </button>
        )}
        <button
          type="button"
          onClick={onReplay}
          className="glass-pill flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
        >
          <RotateCcw className="size-4" aria-hidden /> Run it again
        </button>
        <button
          type="button"
          onClick={onExit}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-slate-900 transition-transform active:scale-95"
        >
          <Map className="size-4" aria-hidden /> Back to the path
        </button>
      </div>
    </div>
  );
}
