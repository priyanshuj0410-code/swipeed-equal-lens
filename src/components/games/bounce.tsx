"use client";

// Bounce (node g39, ages 12–15, Chapter 4) — NEW v2 build to GDD 39 (mechanic-embodying). The resilience +
// stress + teen-mental-health node (Thread C), run on the shared v2 engine: its researched typed library + config
// (content/games/bounce.ts) render the play actions (branch · strike-rewrite · role-play · reflect · sort · build ·
// match), led by branch (choose the move that actually helps), strike-rewrite (bust the resilience myth) and
// role-play (say the brave words). Real resilience (not toxic positivity or tough-it-out-alone), reframing,
// a real coping toolkit, exam pressure, being there for a friend, and when to reach out. WELLBEING-SAFE: no toxic
// positivity / pain-based coping; persistent distress + dark thoughts route firmly to a trusted adult, Tele-MANAS
// 14416, or Childline 1098/112 (crisis-routing first, never therapy). Builds on g38; prereq g21. gameId "bounce".
import { V2Game } from "@/components/games/v2-engine";
import { BOUNCE } from "@/content/games/bounce";

export function BounceGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={BOUNCE} onExit={onExit} />;
}
