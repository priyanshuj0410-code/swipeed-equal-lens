"use client";

// Capstone 2: Fair & Safe Explorer (node c2, Chapter 2 graduation, ages 6-9). NEW rich build to GDD c2
// ("Capstone format v1"), following the c1 template. Runs on the shared rich capstone engine: its Landing
// config (content/games/capstone-2.ts) drives arrive → look back (the explorer's map / sticker gallery) →
// play back (eight victory laps, each a Chapter 2 truth re-cued through a different mechanic) → reflect →
// celebrate (golden compass + certificate). No score, no fail. gameId "capstone-2".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_2 } from "@/content/games/capstone-2";

export function CapstoneTwoGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_2} onExit={onExit} />;
}
