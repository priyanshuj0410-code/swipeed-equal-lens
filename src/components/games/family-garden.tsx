"use client";

// My Family Garden (node g03, ages 3-6): reworked to GDD 03 v2 (mechanic-embodying). The game is its
// researched typed library + config (content/games/family-garden.ts); the shared v2 engine renders the
// seven play actions (reflect · role-play · strike-rewrite · branch · sort · match · build), led by the
// signature grow-your-garden build. gameId "family-garden".
import { V2Game } from "@/components/games/v2-engine";
import { FAMILY_GARDEN } from "@/content/games/family-garden";

export function FamilyGardenGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FAMILY_GARDEN} onExit={onExit} />;
}
