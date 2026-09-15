"use client";

// Equalize (node g26, ages 12-15, Chapter 4): NEW v2 build to GDD 26 (mechanic-embodying). The gender-equality
// BALANCING-SIM node (Thread E), run on the shared v2 engine: its researched typed library + config
// (content/games/equalize.ts) render the play actions (branch · strike-rewrite · sort · reflect · match ·
// role-play · build), led by branch (rebalance choices), strike-rewrite (bust the myth) and sort (gap vs lived
// practice). Spot the gap between believing equality and living it, share the invisible unpaid-care load, see
// equality PAYS OFF for everyone (boys included: not zero-sum), and rebalance home/school/community. Child
// marriage is handled as a RIGHTS issue: respectful, non-graphic, legally accurate, never blaming the target,
// and it always routes an at-risk child to a trusted adult / Childline 1098. Builds on g10; prereq g25. gameId
// "equalize".
import { V2Game } from "@/components/games/v2-engine";
import { EQUALIZE } from "@/content/games/equalize";

export function EqualizeGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={EQUALIZE} onExit={onExit} />;
}
