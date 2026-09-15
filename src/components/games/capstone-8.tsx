"use client";

// Capstone 8: Full Circle (node c8, Chapter 8 graduation, Parenthood). NEW rich build to GDD c8 ("Capstone
// format v1"), matching c1-c7: the FINAL capstone of the whole 3 → parenthood catalog. Runs on the shared rich
// capstone engine: its Landing config (content/games/capstone-8.ts) drives arrive → look back (the Full-Circle
// constellation gallery, nine Chapter-8 stickers) → play back (eight victory laps: gallery · strike-rewrite ·
// branch · role-play · match · swipe · strike-rewrite · sort) → reflect (five prompts) → celebrate. Closes
// Chapter 8 (g61, g69) (the Parenthood + Parent Layer journey) and the entire catalog. No score, no fail. gameId
// "capstone-8".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_8 } from "@/content/games/capstone-8";

export function CapstoneEightGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_8} onExit={onExit} />;
}
