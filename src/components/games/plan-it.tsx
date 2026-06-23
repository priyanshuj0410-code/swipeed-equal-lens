"use client";

// Plan It (node g22, ages 12–15, Chapter 4) — NEW v2 build to GDD 22 (mechanic-embodying). The fertility +
// pregnancy + contraception node (Thread F · SRH), run on the shared v2 engine: its researched typed library +
// config (content/games/plan-it.ts) render the play actions (strike-rewrite · sort · branch · build · reflect ·
// role-play · match), led by strike-rewrite (bust the dangerous myth), sort (fact vs myth) and branch (your own
// pace). Plain biology of how pregnancy begins; busts the dangerous myths (first time, withdrawal, douching,
// 'safe days', orgasm); age-appropriate prevention overview (abstinence fully reliable & respected; condoms;
// ask a doctor); DELAYING IS FULLY VALID; plan your future; facts from a doctor/trusted adult, not rumours.
// School-comfort: matter-of-fact, NON-EXPLICIT, values-first. GATED at the path layer. Builds on g14; prereq g39.
// gameId "plan-it".
import { V2Game } from "@/components/games/v2-engine";
import { PLAN_IT } from "@/content/games/plan-it";

export function PlanItGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={PLAN_IT} onExit={onExit} />;
}
