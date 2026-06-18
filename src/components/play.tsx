"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SwipeDeck } from "@/components/swipe-deck";
import { Debrief } from "@/components/debrief";
import { useProfile } from "@/lib/store";
import { DECK_BY_ID, resolveDeckCards } from "@/content/decks";
import { POINTS, starsFor } from "@/lib/scoring";
import type { DeckId, DeckSummary } from "@/lib/types";

export function Play({ deckId }: { deckId: DeckId }) {
  const { profile, finishDeck } = useProfile();
  const deck = DECK_BY_ID[deckId];
  const [cards] = useState(() => resolveDeckCards(deckId, profile.schoolComfort));
  const [stage, setStage] = useState<"play" | "debrief" | "review">("play");
  const [summary, setSummary] = useState<DeckSummary | null>(null);
  const [stars, setStars] = useState(0);
  const [committed, setCommitted] = useState(false);

  function handleComplete(s: DeckSummary) {
    const st = starsFor(s.correct, s.total);
    setSummary(s);
    setStars(st);
    if (!committed) {
      finishDeck(deckId, st, s.score + POINTS.deckComplete, s.bestStreak);
      setCommitted(true);
    }
    setStage("debrief");
  }

  const invalid = !deck || cards.length === 0;

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <header className="mb-6 flex items-center gap-3">
        <Link href="/" aria-label="Back" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <h1 className="text-base font-semibold">{deck?.title ?? "Deck"}</h1>
      </header>

      <div className="flex flex-1 items-center justify-center">
        {invalid ? (
          <div className="max-w-sm text-center text-sm text-muted-foreground">
            <p>This deck isn&apos;t available right now.</p>
            {deck && !deck.schoolComfortSafe && profile.schoolComfort && (
              <p className="mt-2">It&apos;s hidden by School-Comfort Mode (see Settings).</p>
            )}
            <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Back home
            </Link>
          </div>
        ) : stage === "play" ? (
          <SwipeDeck key="main" cards={cards} deckId={deckId} mode="score" onComplete={handleComplete} />
        ) : stage === "review" && summary ? (
          <SwipeDeck
            key="review"
            cards={summary.missed}
            deckId={deckId}
            mode="review"
            onComplete={() => setStage("debrief")}
          />
        ) : summary ? (
          <Debrief
            summary={summary}
            stars={stars}
            deckTitle={deck!.title}
            onReview={() => setStage("review")}
          />
        ) : null}
      </div>
    </div>
  );
}
