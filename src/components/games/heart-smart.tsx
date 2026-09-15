"use client";

// Heart Smart (node g41, ages 6-9, Chapter 2): NEW v2 build to GDD 41 (mechanic-embodying). The deeper 6-9
// emotional-intelligence node that completes Chapter 2, run on the shared v2 engine: its researched typed
// library + config (content/games/heart-smart.ts) render the play actions (reflect · branch · role-play ·
// strike-rewrite · match · sort · build), led by feeling-moment dilemmas (branch), say-the-self-talk
// (role-play), and the heart-toolkit builder (build). All feelings valid; empathy for everyone (boys too);
// safe to be wrong; help-seeking normalised (a trusted grown-up / Childline 1098). Builds on g01, prereq g09.
// gameId "heart-smart".
import { V2Game } from "@/components/games/v2-engine";
import { HEART_SMART } from "@/content/games/heart-smart";

export function HeartSmartGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={HEART_SMART} onExit={onExit} />;
}
