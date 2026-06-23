"use client";

// Change Makers (node g34, ages 15–18, Chapter 5) — NEW v2 build to GDD 34 (mechanic-embodying). The campaign /
// collective-change node (Thread E · Gender & Respect), run on the shared v2 engine: its researched typed library
// + config (content/games/change-makers.ts) render the play actions (branch · reflect · sort · strike-rewrite ·
// match · role-play · spot), led by branch + sort + strike-rewrite. Scales Lead the Way (g33) into organised
// change: find a cause, make a plan, build a movement, measure impact, take a real safe first step. Change is
// possible AND practical; start small; nothing meaningful alone; activism must be safe, lawful, non-violent,
// ethical, sustainable, and for sensitive causes backed by trusted adults/institutions. The law is a tool (DV Act
// 2005, POSH 2013, BNS 2023; 181/1098/112). India: student councils, panchayats, NGOs, Beti Bachao Beti Padhao.
// Builds on g26 & g33; pairs g35. gameId "change-makers".
import { V2Game } from "@/components/games/v2-engine";
import { CHANGE_MAKERS } from "@/content/games/change-makers";

export function ChangeMakersGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={CHANGE_MAKERS} onExit={onExit} />;
}
