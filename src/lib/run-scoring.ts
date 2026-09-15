import type { Card } from "@/lib/types";
import { cardPoints } from "@/lib/scoring";

// The Clarity meter is the *character's* stake (not player "lives"). Correct reads hold/raise it,
// misses lower it, and disguised / boss cards swing it more. Safeguarding cards NEVER move Clarity
// (and are never scored). There is no hard fail: Clarity just floors at 0 and the final value picks
// a gentle resolution. XP reuses the v1 coin scoring (combo plays the role of the streak multiplier).
export const CLARITY = { start: 60, min: 0, max: 100, clearThreshold: 55 } as const;

const SWING = {
  clear: { up: 6, down: 8 },
  disguised: { up: 12, down: 14 },
  boss: { up: 18, down: 20 },
} as const;

/** How much a read moves Clarity. Safeguarding cards return 0 (never affect the meter). */
export function clarityDelta(card: Card, correct: boolean, isBoss: boolean): number {
  if (card.is_safeguarding) return 0;
  const s = isBoss ? SWING.boss : card.is_disguised ? SWING.disguised : SWING.clear;
  return correct ? s.up : -s.down;
}

export function clampClarity(v: number): number {
  return Math.max(CLARITY.min, Math.min(CLARITY.max, v));
}

export type RunOutcome = "clear" | "reflect";
/** High Clarity → the character sees clearly; low → a reflective "let's look again" (never "you failed"). */
export function runOutcome(finalClarity: number): RunOutcome {
  return finalClarity >= CLARITY.clearThreshold ? "clear" : "reflect";
}

/** XP for one card: reuses `cardPoints` (safeguarding & wrong reads score 0; combo ≈ streak). */
export function cardXp(card: Card, correct: boolean, comboAfter: number): number {
  return cardPoints(card, correct, comboAfter);
}

export const RUN_XP = { complete: 40, bossBonus: 25 } as const;
