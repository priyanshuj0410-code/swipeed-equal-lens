"use client";

// Stand Up (node g27, ages 12–15, Chapter 4) — NEW v2 build to GDD 27 (mechanic-embodying). The teen
// bystander-to-upstander node (Thread B · Safety, Consent & Boundaries) — the gender thread's call to action on
// GBV & harassment, run on the shared v2 engine: its researched typed library + config (content/games/stand-up.ts)
// render the play actions (branch · reflect · strike-rewrite · role-play · sort · spot · match), led by the
// five-moves chooser (branch — the 5 Ds, the same engine as Speak Up g19), role-play and spot. Safety-first,
// non-graphic: never confront danger alone ("can I help safely?"); the target is never to blame (freezing is
// normal; "it wasn't your fault"; "I believe you"); survivor-centred support; real routes (trusted adult, Women
// Helpline 181, ERSS 112, Childline 1098). Builds on g19; prereq g26. gameId "stand-up".
import { V2Game } from "@/components/games/v2-engine";
import { STAND_UP } from "@/content/games/stand-up";

export function StandUpGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={STAND_UP} onExit={onExit} />;
}
