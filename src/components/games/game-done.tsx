"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, RotateCcw, Map } from "lucide-react";
import { useProfile } from "@/lib/store";
import { toolsUnlockedBy } from "@/lib/toolkit";
import { ToolkitReflection } from "@/components/toolkit/toolkit-reflection";
import { celebrate } from "@/lib/confetti";

/**
 * Shared "you did it" card for every game — swipe and engine alike. Records completion
 * (stars + coins + best streak) into the profile once on mount, so the matching path node
 * turns to "completed". `onExit` returns to the path (in place when hosted there).
 */
export function GameDone({
  gameId,
  stars = 3,
  coins = 15,
  bestStreak = 0,
  title = "Great job!",
  blurb,
  onReplay,
  onExit,
}: {
  gameId: string;
  stars?: number;
  coins?: number;
  bestStreak?: number;
  title?: string;
  blurb?: string;
  onReplay?: () => void;
  onExit?: () => void;
}) {
  const { finishDeck, unlockTool } = useProfile();
  const router = useRouter();
  const exit = onExit ?? (() => router.push("/path"));
  // Capstones close a chapter with a Thread-C reflection ("skills you've grown"). c8 is the final
  // look-back — the catalog runs to Ch.8 (parenthood); it ended at c5 back when it stopped at 18.
  // The toolkit is deliberately a 5-level model (Thread-C games span Ch.1–5), so capstones 6–8 show
  // the fully-grown level-5 toolkit: that clamp is correct, only the finale flag was left behind.
  const capstoneLevel = gameId.startsWith("capstone-") ? Number(gameId.slice("capstone-".length)) : 0;
  const FINAL_CAPSTONE = 8;

  useEffect(() => {
    finishDeck(gameId, stars, coins, bestStreak);
    // Thread-C games grow the Life-Skills Toolkit (no-op for every other game).
    for (const { id, level } of toolsUnlockedBy(gameId)) unlockTool(id, level);
    celebrate("big");
    // record once on completion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const card = (
    <div
      className="glass-card w-full max-w-xs px-6 py-7 text-center backdrop-blur-[14px] backdrop-saturate-150"
      style={{ color: "var(--color-ink)" }}
    >
      <div className="text-6xl" aria-hidden>
        🎉
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold">{title}</h2>
      {blurb && <p className="mt-1 text-sm text-foreground/85">{blurb}</p>}
      <div className="mt-4 flex justify-center gap-1.5" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            className="size-8"
            style={{ color: i < stars ? "var(--accent-amber)" : "var(--prx-dim)" }}
            fill={i < stars ? "currentColor" : "none"}
            aria-hidden
          />
        ))}
      </div>
      <p className="mt-3 text-sm font-bold" style={{ color: "var(--accent-amber)" }}>
        +{coins} coins
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="glass-pill flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
          >
            <RotateCcw className="size-4" aria-hidden /> Play again
          </button>
        )}
        <button
          type="button"
          onClick={exit}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-sm font-bold text-slate-900 transition-transform active:scale-95"
        >
          <Map className="size-4" aria-hidden /> Back to the path
        </button>
      </div>
    </div>
  );

  if (capstoneLevel) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <ToolkitReflection chapterLevel={capstoneLevel} final={capstoneLevel === FINAL_CAPSTONE} />
        {card}
      </div>
    );
  }
  return card;
}
