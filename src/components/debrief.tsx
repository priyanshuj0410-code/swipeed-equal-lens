"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Star, RotateCcw, Home, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import type { DeckSummary } from "@/lib/types";
import { POINTS } from "@/lib/scoring";
import { celebrate } from "@/lib/confetti";

const CHEERS = ["💪 Good start", "👍 Nicely read", "🎉 Great read!", "🏆 Flag-spotting pro!"];

export function Debrief({
  summary,
  stars,
  deckTitle,
  nextDeck,
  onReview,
}: {
  summary: DeckSummary;
  stars: number;
  deckTitle: string;
  nextDeck?: { id: string; title: string; emoji: string };
  onReview: () => void;
}) {
  useEffect(() => {
    if (stars >= 3) celebrate("big");
    else if (stars >= 1) celebrate("small");
  }, [stars]);

  const accuracy = summary.total ? Math.round((summary.correct / summary.total) * 100) : 0;
  const totalScore = summary.score + POINTS.deckComplete;
  const missedSigns = Array.from(new Set(summary.missed.map((c) => c.sign)));

  return (
    <Card className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[1.75rem] p-7 text-center shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">{deckTitle}</span>
        <h2 className="text-2xl font-extrabold">{CHEERS[stars]}</h2>
      </div>

      <div className="flex justify-center gap-2 animate-in zoom-in-50 duration-500" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            className="size-10 drop-shadow-sm"
            aria-hidden
            style={{ color: "var(--flag-green)", animationDelay: `${i * 120}ms` }}
            fill={i < stars ? "currentColor" : "none"}
          />
        ))}
      </div>

      <div className="flex w-full justify-center gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{accuracy}% accuracy</span>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{totalScore} pts</span>
      </div>
      <p className="text-sm text-muted-foreground">
        You read {summary.correct} of {summary.total} right.
      </p>

      {missedSigns.length > 0 && (
        <div className="w-full rounded-xl bg-muted p-3 text-left text-xs">
          <p className="mb-1 font-semibold">Worth another look:</p>
          <p className="text-muted-foreground">{missedSigns.join(" · ")}</p>
        </div>
      )}

      <div className="flex w-full flex-col gap-2">
        {summary.missed.length > 0 && (
          <Button onClick={onReview} variant="outline" className="h-12 gap-1.5 rounded-2xl font-bold transition-transform active:scale-95">
            <RotateCcw className="size-4" aria-hidden /> Review missed ({summary.missed.length})
          </Button>
        )}
        {nextDeck ? (
          <Link href={`/play/${nextDeck.id}`} className={buttonVariants({ className: "h-12 gap-1.5 rounded-2xl font-bold" })}>
            Next: {nextDeck.emoji} {nextDeck.title} <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
        <Link
          href="/"
          className={buttonVariants({
            variant: nextDeck || summary.missed.length > 0 ? "outline" : "default",
            className: "h-12 gap-1.5 rounded-2xl font-bold",
          })}
        >
          <Home className="size-4" aria-hidden /> Back home
        </Link>
      </div>
    </Card>
  );
}
