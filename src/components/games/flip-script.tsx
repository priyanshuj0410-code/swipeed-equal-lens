"use client";

// Flip the Script (node g17, ages 9–12, Chapter 3) — NEW v2 build to GDD 17 (mechanic-embodying). The
// gender-stereotype node (Thread E) and the strike-and-rewrite flagship, run on the shared v2 engine: its
// researched typed library + config (content/games/flip-script.ts) render the play actions (strike-rewrite ·
// spot · reflect · branch · role-play · sort · match), led by the strike-and-rewrite card (the signature flip)
// and spot-the-stereotype media frames — the reference flip+spot renderers the gender thread (g25/g26/g12/g18)
// reuses. Spot it → flip it → call it out. Question-don't-preach; respectful of culture; no-one's-the-villain;
// all genders freed; safe to call out. Builds on g10; prereq g16. gameId "flip-script" (the GDD/library
// "flip-the-script" is design-doc only).
import { V2Game } from "@/components/games/v2-engine";
import { FLIP_SCRIPT } from "@/content/games/flip-script";

export function FlipScriptGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FLIP_SCRIPT} onExit={onExit} />;
}
