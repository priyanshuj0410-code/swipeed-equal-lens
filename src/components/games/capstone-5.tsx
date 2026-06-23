"use client";

// Capstone 5 — Ready for the World (node c5, Chapter 5 graduation, ages 15–18) AND the close of the whole 4–18
// journey. NEW rich build to GDD c5 ("Capstone format v1"), following the c1 reference, replacing the old
// nine-star tap build. Runs on the shared rich capstone engine: its Landing config (content/games/capstone-5.ts)
// drives arrive → look back (the Ready-for-the-World constellation gallery) → play back (victory laps, each a
// chapter truth re-cued through a different mechanic: gallery · swipe · spot · branch · sort · match · branch ·
// strike-rewrite · swipe) → reflect → celebrate (constellation + sunrise + whole-journey certificate). Closes
// Chapter 5 (g29–g36, g42) and the entire 4–18 path. No score, no fail. gameId "capstone-5".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_5 } from "@/content/games/capstone-5";

export function CapstoneFiveGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_5} onExit={onExit} />;
}
