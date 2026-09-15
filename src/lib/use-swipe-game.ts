"use client";

import { useCallback, useRef, useState } from "react";
import type { Card, DeckId, Flag } from "@/lib/types";
import type { GameView, GameLabels } from "@/components/path-scene";
import { cardPoints, POINTS, starsFor } from "@/lib/scoring";
import { celebrate } from "@/lib/confetti";
import { sfx, haptic } from "@/lib/juice";
import { useProfile } from "@/lib/store";
import { DECK_BY_ID } from "@/content/decks";

const THOUGHTFUL_MS = 1200;
const EXIT_MS = 380;

type GState = {
  deckId: DeckId;
  cards: Card[];
  labels: GameLabels;
  index: number;
  phase: "play" | "reveal";
  chosen: Flag | null;
  exiting: Flag | null;
  score: number;
  streak: number;
  best: number;
  correct: number;
  last: number;
  missed: Card[];
  revealAt: number;
  done: boolean; // deck finished: show the shared completion card
};

const fresh = (deckId: DeckId, cards: Card[], labels: GameLabels): GState => ({
  deckId,
  cards,
  labels,
  index: 0,
  phase: "play",
  chosen: null,
  exiting: null,
  score: 0,
  streak: 0,
  best: 0,
  correct: 0,
  last: 0,
  missed: [],
  revealAt: 0,
  done: false,
});

/** All swipe-game logic, deck-agnostic, so the path scene can play a deck in place. */
export function useSwipeGame() {
  const { recordCard } = useProfile();
  const [g, setG] = useState<GState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback((deckId: DeckId, cards: Card[], labels?: GameLabels) => {
    if (!cards.length) return;
    setG(fresh(deckId, cards, labels ?? { left: "Red flag", right: "Green flag" }));
  }, []);

  const replay = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setG((prev) => (prev ? fresh(prev.deckId, prev.cards, prev.labels) : prev));
  }, []);

  const quit = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setG(null);
  }, []);

  const commit = useCallback(
    (flag: Flag) => {
      setG((prev) => {
        if (!prev || prev.done || prev.phase !== "play" || prev.exiting) return prev;
        const card = prev.cards[prev.index];
        const isCorrect = flag === card.correct_flag;
        let pts = 0;
        let streak = prev.streak;
        let best = prev.best;
        let correct = prev.correct;
        let missed = prev.missed;
        if (!card.is_safeguarding) {
          streak = isCorrect ? prev.streak + 1 : 0;
          best = Math.max(prev.best, streak);
          pts = cardPoints(card, isCorrect, streak);
          if (isCorrect) correct = prev.correct + 1;
          else missed = [...prev.missed, card];
          recordCard(card.signId, isCorrect);
        }
        // shared per-card sound + haptic (mute / reduced-motion handled in the juice layer)
        if (card.is_safeguarding) haptic("serious");
        else if (isCorrect) {
          sfx(card.is_disguised ? "shatter" : streak >= 2 ? "combo" : "green", streak);
          haptic("tap");
        } else {
          sfx("red");
          haptic("tap");
        }
        // confetti only here: the chime above already played (avoid double via { sound: false })
        if (isCorrect && !card.is_safeguarding && (card.is_disguised || streak === 5 || streak === 10)) celebrate("small", { sound: false });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setG((p) => (p ? { ...p, exiting: null, phase: "reveal", revealAt: Date.now() } : p)), EXIT_MS);
        return { ...prev, chosen: flag, exiting: flag, score: prev.score + pts, streak, best, correct, last: pts, missed };
      });
    },
    [recordCard]
  );

  const next = useCallback(() => {
    setG((prev) => {
      if (!prev || prev.done) return prev;
      const card = prev.cards[prev.index];
      let score = prev.score;
      if (!card.is_safeguarding && Date.now() - prev.revealAt > THOUGHTFUL_MS) score += POINTS.thoughtful;
      // finishing the deck flips into the shared completion card (which records & celebrates)
      if (prev.index + 1 >= prev.cards.length) {
        return { ...prev, score: score + POINTS.deckComplete, done: true };
      }
      return { ...prev, index: prev.index + 1, chosen: null, phase: "play", score };
    });
  }, []);

  const view: GameView | null =
    g && !g.done
      ? {
          card: g.cards[g.index],
          phase: g.phase,
          correct: g.chosen !== null && g.chosen === g.cards[g.index].correct_flag,
          points: g.last,
          exiting: g.exiting,
          labels: g.labels,
        }
      : null;

  const hud =
    g && !g.done
      ? {
          title: DECK_BY_ID[g.deckId]?.title ?? "Deck",
          index: g.index,
          total: g.cards.length,
          score: g.score,
          streak: g.streak,
          phase: g.phase,
          busy: g.phase !== "play" || g.exiting !== null,
          isLast: g.index + 1 >= g.cards.length,
          labels: g.labels,
        }
      : null;

  // completion summary: drives the shared GameDone card when a deck is finished
  const result =
    g && g.done
      ? (() => {
          const scored = g.cards.filter((c) => !c.is_safeguarding).length;
          return {
            deckId: g.deckId,
            title: DECK_BY_ID[g.deckId]?.title ?? "Deck",
            stars: starsFor(g.correct, scored),
            coins: g.score,
            best: g.best,
            correct: g.correct,
            total: scored,
          };
        })()
      : null;

  return { active: !!g, view, hud, result, start, quit, commit, next, replay };
}
