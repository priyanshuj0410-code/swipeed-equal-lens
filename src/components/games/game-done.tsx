"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, RotateCcw, Map } from "lucide-react";
import { useProfile } from "@/lib/store";
import { celebrate } from "@/lib/confetti";

/**
 * Shared "you did it" card for the engine games. Records completion (stars + coins)
 * into the profile once on mount, so the matching path node turns to "completed".
 */
export function GameDone({
  gameId,
  stars = 3,
  coins = 15,
  title = "Great job!",
  blurb,
  onReplay,
}: {
  gameId: string;
  stars?: number;
  coins?: number;
  title?: string;
  blurb?: string;
  onReplay?: () => void;
}) {
  const { finishDeck } = useProfile();
  const router = useRouter();

  useEffect(() => {
    finishDeck(gameId, stars, coins, 0);
    celebrate("big");
    // record once on completion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="glass-card w-full max-w-xs px-6 py-7 text-center backdrop-blur-[14px] backdrop-saturate-150"
      style={{ color: "#eef1f7" }}
    >
      <div className="text-6xl" aria-hidden>
        🎉
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold">{title}</h2>
      {blurb && <p className="mt-1 text-sm text-white/85">{blurb}</p>}
      <div className="mt-4 flex justify-center gap-1.5" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            className="size-8"
            style={{ color: i < stars ? "var(--accent-amber)" : "rgba(255,255,255,0.28)" }}
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
          onClick={() => router.push("/path")}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-slate-900 transition-transform active:scale-95"
        >
          <Map className="size-4" aria-hidden /> Back to the path
        </button>
      </div>
    </div>
  );
}
