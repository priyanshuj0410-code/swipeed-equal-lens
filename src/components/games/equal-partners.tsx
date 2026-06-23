"use client";

// Equal Partners (node g55, ages 22+, Chapter 7) — NEW v2 build to GDD 55 (mechanic-embodying), the EQUAL-HOME
// heart of Chapter 7: the most unequal place in most lives is the home. Runs on the shared v2 engine: its
// researched typed library + config (content/games/equal-partners.ts) render the play actions (branch ·
// strike-rewrite · sort · reflect · role-play · match · spot), led by branch + strike-rewrite + role-play. The
// signature move reframes a man's role from "helping" to OWNING an equal share — the planning and remembering
// (the invisible mental load), not just the chores. Themes: see the load, helping vs owning (the core reframe),
// share it fairly, two careers (whose job 'flexes' shouldn't default to gender), keep it equal, tools/help.
// Everyone gains; even-handed, engages men as equal owners, never shames any arrangement; coercive control named
// as abuse and routed to Respect at Home (g56) and help (181/1091/112). Builds on g26; sets up g62. gameId
// "equal-partners".
import { V2Game } from "@/components/games/v2-engine";
import { EQUAL_PARTNERS } from "@/content/games/equal-partners";

export function EqualPartnersGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={EQUAL_PARTNERS} onExit={onExit} />;
}
