"use client";

// Norm Storm (node g18, ages 9-12, Chapter 3): NEW v2 build to GDD 18 (mechanic-embodying). The social-norms
// node (Thread E), run on the shared v2 engine: its researched typed library + config
// (content/games/norm-storm.ts) render the play actions (sort · strike-rewrite · branch · reflect · role-play ·
// spot · match), led by the help/harm sorting board (sort) + the strike-and-rewrite flip. Norm-literacy: norms
// are made by people & changeable; sort helpful from harmful; the good-norm test (respects everyone / hurts no
// one / fair both ways: the reusable lens g19 inherits); question & change harmful norms respectfully.
// Question-with-respect; keep-the-good; heavy topics handled lightly; change-feels-possible. Builds on g17;
// prereq g17. gameId "norm-storm".
import { V2Game } from "@/components/games/v2-engine";
import { NORM_STORM } from "@/content/games/norm-storm";

export function NormStormGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={NORM_STORM} onExit={onExit} />;
}
