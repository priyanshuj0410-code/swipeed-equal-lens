"use client";

// Smart Screen Heroes (node g12, ages 6–9, Chapter 2) — NEW v2 build to GDD 12 (mechanic-embodying). The
// early media-literacy game that opens the Values, Rights & Media thread and completes Chapter 2, run on the
// shared v2 engine: its researched typed library + config (content/games/smart-screen.ts) render the play
// actions (branch · reflect · strike-rewrite · sort · spot · role-play · build), led by smart-screen dilemmas
// (branch), the signature spot-the-ad / spot-the-fake scenes (spot), and the balanced-day / healthy-screen
// builders (build). Not anti-tech (savvy & balance); persuasion named; wellbeing as self-care; safety hand-off
// to a trusted grown-up / Safety Squad (Childline 1098). Builds on/prereq g11. gameId "smart-screen" (the
// GDD/library "smart-screen-heroes" is design-doc only).
import { V2Game } from "@/components/games/v2-engine";
import { SMART_SCREEN } from "@/content/games/smart-screen";

export function SmartScreenGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={SMART_SCREEN} onExit={onExit} />;
}
