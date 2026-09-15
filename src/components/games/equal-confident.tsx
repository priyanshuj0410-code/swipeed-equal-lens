"use client";

// Equal & Confident (node g50, ages 18-22, Chapter 6): NEW v2 build to GDD 50 (mechanic-embodying), taking
// gender-equality & allyship into adult arenas (Thread E), reworking the old ModesEngine build onto the shared v2
// engine: its researched typed library + config (content/games/equal-confident.ts) render the play actions
// (branch · strike-rewrite · sort · reflect · role-play · spot · match), led by branch + strike-rewrite +
// role-play. Claim your voice, lead the room (leadership without a title), spot & counter bias (interruptions,
// the 'bossy' double-bind, office housework), be the ally, equality lifts everyone (not zero-sum). Evenhanded,
// never anti-boy. Harassment routes to POSH Internal Committees / 181 (rights & redress in g51). India: women
// under-represented in workforce/leadership; campus/workplace bias real. Builds on g33 & g26; pairs g51; feeds
// Chapters 7-8. gameId "equal-confident".
import { V2Game } from "@/components/games/v2-engine";
import { EQUAL_CONFIDENT } from "@/content/games/equal-confident";

export function EqualConfidentGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={EQUAL_CONFIDENT} onExit={onExit} />;
}
