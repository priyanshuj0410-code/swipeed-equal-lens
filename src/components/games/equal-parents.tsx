"use client";

// Equal Parents (node g62, Parenthood, Chapter 8) — NEW v2 build to GDD 62 (mechanic-embodying), taking the
// equal-home work of Equal Partners (g55) into raising children — the stage where gendered defaults snap back
// hardest. Parenting isn't mum's job with dad 'helping'. Runs on the shared v2 engine: its researched typed
// library + config (content/games/equal-parents.ts) render the play actions (strike-rewrite · branch · sort ·
// reflect · match · role-play · spot), led by strike-rewrite + branch + sort. Six modes: share the care (owned
// shares; only breastfeeding is mother-specific), the parental mental load (own the noticing, not tasks on
// request), involved dads (busts 'fathers help / providing is enough / nurturing isn't a man's role'; pro-men),
// kids are watching (model equality), everyone gains (better for kids, mothers AND fathers), tools/help (burnout →
// Looking After You g63). Even-handed; engages fathers as equal owners; never anti-men; never shames any
// arrangement. Builds on g55 & g26; beside g61. gameId "equal-parents".
import { V2Game } from "@/components/games/v2-engine";
import { EQUAL_PARENTS } from "@/content/games/equal-parents";

export function EqualParentsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={EQUAL_PARENTS} onExit={onExit} />;
}
