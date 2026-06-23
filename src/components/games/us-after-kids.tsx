"use client";

// Us, After Kids (node g61, Parenthood, Chapter 8) — NEW v2 build to GDD 61 (mechanic-embodying), OPENING Chapter 8
// (Parenthood) with the relationship parenting strains most: the couple's own, and the self within it. Runs on the
// shared v2 engine: its researched typed library + config (content/games/us-after-kids.ts) render the play actions
// (branch · strike-rewrite · role-play · sort · reflect · match · spot), led by branch + strike-rewrite +
// role-play. Six modes: the big shift (~2 in 3 couples feel the dip; not a verdict), talk through the tired (name
// the tiredness not each other), share don't resent (engages fathers — never 'babysitting' your own child; links
// g62), reconnecting (intimacy at both partners' pace, no deadline; postpartum discomfort → clinician), you still
// matter (you're a whole person; persistent low mood → Looking After You g63), tools/help. Even-handed; engages
// fathers as equal parents; no pressure on intimacy timing; NOT medical advice. Perinatal depression → Tele-MANAS
// 14416; strain→abuse → Respect at Home g56. Builds on g53 & g46; links g62/g63/g57/g56. gameId "us-after-kids".
import { V2Game } from "@/components/games/v2-engine";
import { US_AFTER_KIDS } from "@/content/games/us-after-kids";

export function UsAfterKidsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={US_AFTER_KIDS} onExit={onExit} />;
}
