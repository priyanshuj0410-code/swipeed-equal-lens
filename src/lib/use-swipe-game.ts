"use client";

import { useCallback, useRef, useState } from "react";
import type { Card, DeckId, Flag } from "@/lib/types";
import type { GameView, GameLabels } from "@/components/path-scene";
import { cardPoints, POINTS, starsFor } from "@/lib/scoring";
import { celebrate } from "@/lib/confetti";
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
};

/** All swipe-game logic, deck-agnostic, so the path scene can play a deck in place. */
export function useSwipeGame() {
  const { recordCard, finishDeck } = useProfile();
  const [g, setG] = useState<GState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback((deckId: DeckId, cards: Card[], labels?: GameLabels) => {
    if (!cards.length) return;
    setG({
      deckId,
      cards,
      labels: labels ?? { left: "Red flag", right: "Green flag" },
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
    });
  }, []);

  const quit = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setG(null);
  }, []);

  const commit = useCallback(
    (flag: Flag) => {
      setG((prev) => {
        if (!prev || prev.phase !== "play" || prev.exiting) return prev;
        const card = prev.cards[prev.index];
        const isCorrect = flag === card.correct_flag;
        try {
          navigator.vibrate?.(card.is_safeguarding ? [12, 40, 12] : 12);
        } catch {
          /* unsupported */
        }
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
        if (isCorrect && !card.is_safeguarding && (card.is_disguised || streak === 5 || streak === 10)) celebrate("small");
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setG((p) => (p ? { ...p, exiting: null, phase: "reveal", revealAt: Date.now() } : p)), EXIT_MS);
        return { ...prev, chosen: flag, exiting: flag, score: prev.score + pts, streak, best, correct, last: pts, missed };
      });
    },
    [recordCard]
  );

  const next = useCallback(() => {
    setG((prev) => {
      if (!prev) return prev;
      const card = prev.cards[prev.index];
      let score = prev.score;
      if (!card.is_safeguarding && Date.now() - prev.revealAt > THOUGHTFUL_MS) score += POINTS.thoughtful;
      if (prev.index + 1 >= prev.cards.length) {
        const scored = prev.cards.filter((c) => !c.is_safeguarding).length;
        finishDeck(prev.deckId, starsFor(prev.correct, scored), score + POINTS.deckComplete, prev.best);
        celebrate("big");
        return null;
      }
      return { ...prev, index: prev.index + 1, chosen: null, phase: "play", score };
    });
  }, [finishDeck]);

  const view: GameView | null = g
    ? {
        card: g.cards[g.index],
        phase: g.phase,
        correct: g.chosen !== null && g.chosen === g.cards[g.index].correct_flag,
        points: g.last,
        exiting: g.exiting,
        labels: g.labels,
      }
    : null;

  const hud = g
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

  return { active: !!g, view, hud, start, quit, commit, next };
}
