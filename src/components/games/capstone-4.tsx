"use client";

// Capstone 4: Reading Relationships (node c4, Chapter 4 graduation, ages 12-15). NEW rich build to GDD c4
// ("Capstone format v1"), following the c1 reference, replacing the old eight-star tap build. Runs on the shared
// rich capstone engine: its Landing config (content/games/capstone-4.ts) drives arrive → look back (the
// Reading-Relationships constellation gallery) → play back (victory laps, each a chapter truth re-cued through a
// different mechanic: branch · swipe · sort · strike-rewrite · build · spot · match) → reflect → celebrate
// (constellation lights up + certificate). Closes Chapter 4 (g21, g28, g39, g40, g43). No score, no fail.
// gameId "capstone-4".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_4 } from "@/content/games/capstone-4";

export function CapstoneFourGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_4} onExit={onExit} />;
}
