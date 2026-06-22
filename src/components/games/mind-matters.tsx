"use client";

// Mind Matters (node g38, ages 9–12, Chapter 3) — NEW v2 build to GDD 38 (mechanic-embodying). The
// mental-wellbeing game (Thread C), run on the shared v2 engine: its researched typed library + config
// (content/games/mind-matters.ts) render the play actions (branch · strike-rewrite · sort · reflect ·
// role-play · build · match), led by the coping chooser (branch), the build-your-toolkit board (build), and
// de-stigmatising myth-flips (strike-rewrite). Wellbeing-safe: healthy coping only; never diagnoses; no harsh
// self-talk; normalising; always routes big/lasting distress + dark thoughts to a trusted adult & Childline
// 1098/112. Builds on g01; prereq g13; pairs g39 & g41. gameId "mind-matters".
import { V2Game } from "@/components/games/v2-engine";
import { MIND_MATTERS } from "@/content/games/mind-matters";

export function MindMattersGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MIND_MATTERS} onExit={onExit} />;
}
