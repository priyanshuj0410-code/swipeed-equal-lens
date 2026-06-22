"use client";

// Capstone 1 — My First Friends (node c1, Chapter 1 graduation, ages 3–6). NEW rich build to GDD c1 ("Capstone
// format v1"), the reference the other capstones follow. Runs on the shared rich capstone engine: its Landing
// config (content/games/capstone-1.ts) drives arrive → look back (sticker gallery) → play back (victory laps,
// each a chapter truth re-cued through a different mechanic) → reflect → celebrate (Friendship Garden bloom +
// certificate). No score, no fail. gameId "capstone-1".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_1 } from "@/content/games/capstone-1";

export function CapstoneOneGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_1} onExit={onExit} />;
}
