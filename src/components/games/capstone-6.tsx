"use client";

// Capstone 6 — Standing on My Own (node c6, Chapter 6 graduation, ages 18–22, College). NEW rich build to GDD c6
// ("Capstone format v1"), following the c1 reference, replacing the old nine-star tap build. Runs on the shared
// rich capstone engine: its Landing config (content/games/capstone-6.ts) drives arrive → look back (the
// Standing-on-My-Own constellation gallery) → play back (victory laps: gallery · swipe · branch · sort ·
// strike-rewrite · match · role-play · strike-rewrite · swipe) → reflect → celebrate. Closes Chapter 6
// (g44–g52) — the College adult journey. First capstone to use the role-play lap. No score, no fail. gameId
// "capstone-6".
import { RichCapstone } from "@/components/games/capstone-rich";
import { CAPSTONE_6 } from "@/content/games/capstone-6";

export function CapstoneSixGame({ onExit }: { onExit: () => void }) {
  return <RichCapstone config={CAPSTONE_6} onExit={onExit} />;
}
