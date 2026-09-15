"use client";

// Find Your Feet (node g52, ages 18-22, Chapter 6): NEW v2 build to GDD 52 (mechanic-embodying), completing the
// College wellbeing cluster (Thread C), reworking the old ModesEngine build onto the shared v2 engine: its
// researched typed library + config (content/games/find-your-feet.ts) render the play actions (branch ·
// strike-rewrite · sort · reflect · role-play · match · spot), led by branch + strike-rewrite + sort. No one has
// it figured out: the comparison trap, you don't need it all sorted, bounce from setbacks (failure is
// information), your path (worth beyond CV), tools & crisis routing. Wellbeing-sensitive: healthy coping only,
// never reinforces hopelessness; crisis routing with warmth (Tele-MANAS 14416); not
// careers-counselling or therapy. India: placement seasons, JEE/NEET/UPSC, 'settled job' ideal, peer comparison.
// Builds on g42 & g39; pairs g48/g49. gameId "find-your-feet".
import { V2Game } from "@/components/games/v2-engine";
import { FIND_YOUR_FEET } from "@/content/games/find-your-feet";

export function FindYourFeetGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FIND_YOUR_FEET} onExit={onExit} />;
}
