"use client";

// Capstone 3 — Growing Up Smart (node c3, Chapter 3 graduation, ages 9–12). NEW rich build to GDD c3 ("Capstone
// format v1"), following the c1 reference, replacing the old eight-star tap build. Runs on the shared rich
// capstone engine: its Landing config (content/games/capstone-3.ts) drives arrive → look back (the Growing-Up
// constellation gallery) → play back (victory laps, each a chapter truth re-cued through a different mechanic:
// match · swipe · sort · branch · spot · build) → reflect → celebrate (constellation lights up + certificate).
// Closes Chapter 3 (#g13–g20). No score, no fail. gameId "capstone-3".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_3 } from "@/content/games/capstone-3";

export function CapstoneThreeGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_3} onExit={onExit} />;
}
