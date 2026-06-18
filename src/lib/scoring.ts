import type { Card } from "@/lib/types";

// The scoring system has one job: reward careful, accurate reading — never speed,
// guessing, or spending. No hard fail-state.
export const POINTS = {
  correct: 10,
  disguised: 20, // disguised cards (†) are the hard, high-value ones
  deckComplete: 50,
  thoughtful: 5, // small bonus for reading the reveal before continuing
} as const;

/** Streak multiplier: ×1.5 / ×2 / ×3 at 3 / 5 / 10 correct in a row. */
export function streakMultiplier(streak: number): number {
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

/** Points for a single card. Safeguarding cards are never scored. Wrong = 0 (never negative). */
export function cardPoints(card: Card, correct: boolean, streakAfter: number): number {
  if (card.is_safeguarding || !correct) return 0;
  const base = card.is_disguised ? POINTS.disguised : POINTS.correct;
  return Math.round(base * streakMultiplier(streakAfter));
}

/** 3 stars at 90%+, 2 at 70%+, 1 at 50%+. */
export function starsFor(correct: number, total: number): number {
  if (total === 0) return 0;
  const pct = (correct / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
}
