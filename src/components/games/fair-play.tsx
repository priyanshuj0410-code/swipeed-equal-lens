"use client";

// Fair Play World (node g10, ages 6-9, Chapter 2): NEW v2 build to GDD 10 (mechanic-embodying). The fairness
// game in the Gender & Respect thread, run on the shared v2 engine: its researched typed library + config
// (content/games/fair-play.ts) render the play actions (branch · reflect · strike-rewrite · sort · role-play ·
// match · build · spot), led by fairness dilemmas (branch), the fair-chore-chart builder (build), and
// spot-the-unfair-rule scenes (spot). Fairness as gender equality (India chore-gap named plainly); decide not
// be told; both directions (girls toward chances, boys toward home help); safe to be wrong; family-safe.
// Builds on g07, prereq g41. gameId "fair-play" (the GDD/library "fair-play-world" is design-doc only).
import { V2Game } from "@/components/games/v2-engine";
import { FAIR_PLAY } from "@/content/games/fair-play";

export function FairPlayGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FAIR_PLAY} onExit={onExit} />;
}
