"use client";

// Capstone 7: A Life, Built (node c7, Chapter 7 graduation, ages 22+, Building a Life). NEW rich build to GDD c7
// ("Capstone format v1"), matching c1, c6. Runs on the shared rich capstone engine: its Landing config
// (content/games/capstone-7.ts) drives arrive → look back (the A-Life-Built constellation gallery, eight Chapter-7
// stickers) → play back (seven victory laps: gallery · sort · strike-rewrite · branch · match · swipe · role-play)
// → reflect (five prompts) → celebrate. Closes Chapter 7 (g53, g60): the adult "Building a Life" journey. No
// score, no fail. gameId "capstone-7".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_7 } from "@/content/games/capstone-7";

export function CapstoneSevenGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_7} onExit={onExit} />;
}
