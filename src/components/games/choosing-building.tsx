"use client";

// Choosing & Building (node g53, ages 22+, Chapter 7): NEW v2 build to GDD 53 (mechanic-embodying), the OPENER
// of Chapter 7 (Building a Life), where the story turns from 'me' to 'us' (Thread D). Runs on the shared v2
// engine: its researched typed library + config (content/games/choosing-building.ts) render the play actions
// (branch · strike-rewrite · sort · reflect · role-play · match · spot), led by branch + strike-rewrite + sort.
// A wedding is a day; a partnership is the work: choosing well (values over sparks), what it takes (communication,
// trust, repair, build us without erasing me), commitment clearly (eyes-open not pressure), love & arranged (both
// paths, same skills, consent always), starting strong (equality day one). Every path respected, incl. not
// marrying; forced marriage routed to help (181/1091/112/1098). Builds on g46 & g31; sets up g55 & g57. gameId
// "choosing-building".
import { V2Game } from "@/components/games/v2-engine";
import { CHOOSING_BUILDING } from "@/content/games/choosing-building";

export function ChoosingBuildingGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={CHOOSING_BUILDING} onExit={onExit} />;
}
