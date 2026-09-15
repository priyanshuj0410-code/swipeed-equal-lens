"use client";

// Know Your Rights (Adult) (node g51, ages 18-22, Chapter 6): NEW v2 build to GDD 51 (mechanic-embodying), the
// College node that closes the chapter (Thread G), reworking the old ModesEngine build onto the shared v2 engine:
// its researched typed library + config (content/games/know-your-rights.ts) render the play actions (branch ·
// strike-rewrite · sort · reflect · match · role-play · spot), led by branch + strike-rewrite + match. Turns
// Justice League (g35) rights work into adult arenas: rights at work (labour/contracts/pay/interns), harassment &
// POSH (Internal Committee), renting & consumer, cyber & data, claim it (redress & free legal aid), tools/help.
// EDUCATIONAL, not legal advice; all law content flagged for expert review/localisation/currency. India: POSH Act
// 2013 & ICs, Consumer Protection Act 2019, DPDP, NALSA legal aid 15100; helplines 181/1091/112/1930/1098. Builds
// on g35; pairs g50; precedes c6. gameId "know-your-rights".
import { V2Game } from "@/components/games/v2-engine";
import { KNOW_YOUR_RIGHTS } from "@/content/games/know-your-rights";

export function KnowYourRightsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={KNOW_YOUR_RIGHTS} onExit={onExit} />;
}
