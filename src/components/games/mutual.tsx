"use client";

// Mutual (node g31, ages 15-18, Chapter 5): NEW v2 build to GDD 31 (mechanic-embodying). The sexual-consent /
// legal-age / relationships node (Thread B · Safety, Consent & Boundaries) at its adult peak, run on the shared
// v2 engine: its researched typed library + config (content/games/mutual.ts) render the play actions (reflect ·
// strike-rewrite · branch · role-play · sort · spot · match), led by branch + strike-rewrite + role-play.
// Consent = FRIES, a yes from both, presence of a yes not absence of a no, withdrawable anytime; pressure or
// incapacitation cancels it. Even-handed, never victim-blaming, never explicit. India: age of consent 18, POCSO
// for minors; routes assault/abuse/coercion to help (181 / 1091 / 112 / Childline 1098 / a trusted adult).
// Builds on g15 & g24; pairs g30; underwrites g32. gameId "mutual".
import { V2Game } from "@/components/games/v2-engine";
import { MUTUAL } from "@/content/games/mutual";

export function MutualGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MUTUAL} onExit={onExit} />;
}
