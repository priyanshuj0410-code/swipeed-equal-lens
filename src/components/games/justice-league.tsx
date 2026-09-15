"use client";

// Justice League: Rights Edition (node g35, ages 15-18, Chapter 5), NEW v2 build to GDD 35 (mechanic-embodying).
// The rights-&-redress node (Thread G · Values, Rights & Media), run on the shared v2 engine: its researched
// typed library + config (content/games/justice-league.ts) render the play actions (branch · reflect · sort ·
// match · strike-rewrite · spot · role-play), led by branch + match + strike-rewrite. You have rights, laws
// protect you, and there are real routes to help and justice: knowing them is your superpower. EDUCATIONAL, not
// legal advice: plain-language law, demystified redress, real authorities + free legal aid; never promises
// outcomes. India: constitutional rights, POCSO (18), POSH IC, child-marriage law, DV Act, cyber-law; routes to a
// trusted adult, police/FIR (Zero FIR), Internal Committees, Child Welfare Committees, NALSA legal aid (15100),
// helplines 1098/181/1091/112/1930. Builds on g20; pairs g34; underwrites g31. gameId "justice-league".
import { V2Game } from "@/components/games/v2-engine";
import { JUSTICE_LEAGUE } from "@/content/games/justice-league";

export function JusticeLeagueGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={JUSTICE_LEAGUE} onExit={onExit} />;
}
