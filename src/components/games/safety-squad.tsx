"use client";

// Safety Squad (node g08, ages 6-9, Chapter 2): reworked to GDD 08 v2 (mechanic-embodying). The
// personal-safety / child-protection game runs on the shared v2 engine: its researched typed library +
// config (content/games/safety-squad.ts) render the play actions (reflect · role-play · strike-rewrite ·
// branch · sort · build · SPOT: the new spot-the-trick verb), led by safety dilemmas (branch), "No, Go,
// Tell" (role-play), and spotting red flags/lures. Empower never frighten; safe/unsafe (never good/bad);
// never the child's fault; every unsafe drill ends on reassurance + Childline 1098. gameId "safety-squad".
import { V2Game } from "@/components/games/v2-engine";
import { SAFETY_SQUAD } from "@/content/games/safety-squad";

export function SafetySquadGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={SAFETY_SQUAD} onExit={onExit} />;
}
