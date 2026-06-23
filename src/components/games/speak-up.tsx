"use client";

// Speak Up (node g19, ages 9–12, Chapter 3) — NEW v2 build to GDD 19 (mechanic-embodying). The
// bystander-to-upstander node (Thread E), run on the shared v2 engine: its researched typed library + config
// (content/games/speak-up.ts) render the play actions (branch · role-play · sort · spot · reflect ·
// strike-rewrite · match), led by the five-moves chooser (branch — the 5 Ds: say something, distract, get
// help, check in, report; the reference engine g27 & g20 reuse). Safety over heroics (never confront danger
// alone); never blame the target; telling is not tattling; freezing is okay; real routes to help (Childline
// 1098/112). Builds on g11; prereq g18. gameId "speak-up".
import { V2Game } from "@/components/games/v2-engine";
import { SPEAK_UP } from "@/content/games/speak-up";

export function SpeakUpGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={SPEAK_UP} onExit={onExit} />;
}
