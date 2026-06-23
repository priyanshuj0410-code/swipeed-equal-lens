"use client";

// Mind & Belonging (node g49, ages 18–22, Chapter 6) — NEW v2 build to GDD 49 (mechanic-embodying), the College
// wellbeing anchor (Thread C), reworking the old ModesEngine build onto the shared v2 engine: its researched
// typed library + config (content/games/mind-belonging.ts) render the play actions (branch · strike-rewrite ·
// sort · reflect · role-play · spot · match), led by branch + strike-rewrite + sort. Leaving home is exciting,
// lonely and hard: settling in (homesickness normalised), find your people (belonging is built), cope well
// (healthy coping ONLY, body image & self-worth), reach out (help = strength), tools & crisis routing. HIGH-CARE:
// distress met with warmth + immediate help route, never assessment questions; healthy coping only; anti-stigma,
// not therapy. India: hostel isolation, academic pressure, stigma (esp. young men); Tele-MANAS 14416, KIRAN
// 1800-599-0019, campus counsellors. Builds on g39, continues g42; pairs g48/g52. gameId "mind-belonging".
import { V2Game } from "@/components/games/v2-engine";
import { MIND_BELONGING } from "@/content/games/mind-belonging";

export function MindBelongingGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MIND_BELONGING} onExit={onExit} />;
}
