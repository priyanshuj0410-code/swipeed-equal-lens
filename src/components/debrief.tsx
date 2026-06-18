"use client";

import Link from "next/link";
import { Star, RotateCcw, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import type { DeckSummary } from "@/lib/types";
import { POINTS } from "@/lib/scoring";

export function Debrief({
  summary,
  stars,
  deckTitle,
  onReview,
}: {
  summary: DeckSummary;
  stars: number;
  deckTitle: string;
  onReview: () => void;
}) {
  const accuracy = summary.total ? Math.round((summary.correct / summary.total) * 100) : 0;
  const totalScore = summary.score + POINTS.deckComplete;
  const missedSigns = Array.from(new Set(summary.missed.map((c) => c.sign)));

  return (
    <Card className="flex w-full max-w-sm flex-col gap-4 p-6 text-center">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {deckTitle}
        </span>
        <h2 className="text-xl font-semibold">Deck complete</h2>
      </div>

      <div className="flex justify-center gap-1.5" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            className="size-8"
            aria-hidden
            style={{ color: "var(--flag-green)" }}
            fill={i < stars ? "currentColor" : "none"}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        You read <span className="font-semibold text-foreground">{summary.correct}</span> of{" "}
        {summary.total} — {accuracy}% accuracy · {totalScore} pts
      </p>

      {missedSigns.length > 0 && (
        <div className="rounded-lg bg-muted p-3 text-left text-xs">
          <p className="mb-1 font-medium">Worth another look:</p>
          <p className="text-muted-foreground">{missedSigns.join(" · ")}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {summary.missed.length > 0 && (
          <Button onClick={onReview} className="gap-1.5">
            <RotateCcw className="size-4" aria-hidden /> Review missed ({summary.missed.length})
          </Button>
        )}
        <Link
          href="/"
          className={buttonVariants({
            variant: summary.missed.length > 0 ? "outline" : "default",
            className: "gap-1.5",
          })}
        >
          <Home className="size-4" aria-hidden /> Back home
        </Link>
      </div>
    </Card>
  );
}
