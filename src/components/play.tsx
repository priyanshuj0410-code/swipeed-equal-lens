"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SwipeDeck } from "@/components/swipe-deck";
import { Debrief } from "@/components/debrief";
import { useProfile } from "@/lib/store";
import { DECK_BY_ID, resolveDeckCards, availableDecks } from "@/content/decks";
import { POINTS, starsFor } from "@/lib/scoring";
import { GroundScenery } from "@/components/scenery";
import type { DeckId, DeckSummary } from "@/lib/types";

export function Play({ deckId }: { deckId: DeckId }) {
  const { profile, finishDeck } = useProfile();
  const deck = DECK_BY_ID[deckId];
  const standalone = !!deck?.standalone;
  const backHref = standalone ? "/" : "/decks";
  const backLabel = standalone ? "Back to path" : "Back to decks";
  const [cards] = useState(() => resolveDeckCards(deckId, profile.schoolComfort));
  const list = availableDecks(profile.schoolComfort);
  const here = list.findIndex((d) => d.id === deckId);
  const nextDeck = here >= 0 ? list[here + 1] : undefined;
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
        <Link href={backHref} aria-label="Back" className={buttonVariants({ variant: "ghost", size: "icon" })}>
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
            <Link href={backHref} className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              {backLabel}
            </Link>
          </div>
        ) : stage === "play" ? (
          <SwipeDeck key="main" cards={cards} deckId={deckId} mode="score" onComplete={handleComplete} labels={deck?.swipe} />
        ) : stage === "review" && summary ? (
          <SwipeDeck
            key="review"
            cards={summary.missed}
            deckId={deckId}
            mode="review"
            onComplete={() => setStage("debrief")}
            labels={deck?.swipe}
          />
        ) : summary ? (
          <Debrief
            summary={summary}
            stars={stars}
            deckTitle={deck!.title}
            nextDeck={nextDeck ? { id: nextDeck.id, title: nextDeck.title, emoji: nextDeck.emoji } : undefined}
            backHref={backHref}
            backLabel={backLabel}
            onReview={() => setStage("review")}
          />
        ) : null}
      </div>
      <GroundScenery className="-mx-5 mt-4" />
    </div>
  );
}
