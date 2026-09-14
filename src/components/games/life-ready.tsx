"use client";

// Life Ready (node g42, ages 15–18, Chapter 5) — NEW v2 build to GDD 42 (mechanic-embodying). The adult
// life-skills node (Thread C · Feelings & Life Skills), Chapter 5's penultimate lesson, run on the shared v2
// engine: its researched typed library + config (content/games/life-ready.ts) render the play actions (reflect ·
// branch · strike-rewrite · sort · match · role-play · spot), led by branch + reflect + strike-rewrite. The
// culmination of the feelings/life-skills thread (Feelings Friends -> Heart Smart -> Mind Matters -> Bounce ->
// Life Ready): know yourself, decide like an adult, handle the big stuff, people skills, build a support network.
// Healthy strategies only; pressure-free decisions; help-seeking is a lifelong strength; NOT therapy. India:
// board-exam pressure, family/career expectations, transition to college/work; routes distress to Tele-MANAS
// 14416, Manodarpan, a trusted adult/mentor. Builds on g39; draws on g16; precedes g36.
// gameId "life-ready".
import { V2Game } from "@/components/games/v2-engine";
import { LIFE_READY } from "@/content/games/life-ready";

export function LifeReadyGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={LIFE_READY} onExit={onExit} />;
}
