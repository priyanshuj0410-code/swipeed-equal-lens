"use client";

// Defenders of the Body (node g20, ages 9–12, Chapter 3) — NEW v2 build to GDD 20 (mechanic-embodying). The
// immune-system + infection-myth-busting + HIV anti-stigma node (Thread F · SRH) that CLOSES Chapter 3, run on
// the shared v2 engine: its researched typed library + config (content/games/defenders.ts) render the play
// actions (strike-rewrite · sort · branch · role-play · spot · match · reflect), led by strike-rewrite (myth-bust)
// and sort (true/false & spreads-or-not). Teaches: the body's defence team, how germs really spread, everyday
// prevention, HIV explained simply, what spreads HIV vs what NEVER does — and the biggest lesson, KINDNESS NOT
// FEAR: people living with HIV belong fully, HIV is a virus (never a punishment), health is private, defend
// others' dignity. HIV facts kept age-right (sexual transmission waits for Outbreak g23). Builds on g12; prereq
// g19. gameId "defenders" (the engine-host registry id; the GDD/library aspirational id is "defenders-of-the-body").
import { V2Game } from "@/components/games/v2-engine";
import { DEFENDERS } from "@/content/games/defenders";

export function DefendersGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={DEFENDERS} onExit={onExit} />;
}
