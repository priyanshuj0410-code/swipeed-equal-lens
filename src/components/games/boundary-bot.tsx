"use client";

// Boundary Bot (node g15, ages 9–12, Chapter 3) — NEW v2 build to GDD 15 (mechanic-embodying). The
// consent-and-boundaries node (Thread B), run on the shared v2 engine: its researched typed library + config
// (content/games/boundary-bot.ts) render the play actions (branch · reflect · strike-rewrite · role-play ·
// sort · spot · build), led by boundary/pressure dilemmas (branch), the say-the-line rehearsal (role-play),
// the pressure-escape kit (build), and spot-the-red-flag scenes (spot). Empower never frighten; consent
// both-ways (mutual); safe to be wrong (crossed boundary never your fault); online red flags taught calmly;
// gender-inclusive consent; private/solo; routes to a trusted adult & Childline 1098. Builds on g08 & g02;
// prereq g14. gameId "boundary-bot".
import { V2Game } from "@/components/games/v2-engine";
import { BOUNDARY_BOT } from "@/content/games/boundary-bot";

export function BoundaryBotGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={BOUNDARY_BOT} onExit={onExit} />;
}
