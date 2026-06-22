"use client";

// Can-Do Kids (node g05, ages 3–6) — reworked to GDD 05 v2 (mechanic-embodying). The aspirations/careers
// game runs on the shared v2 engine: its researched typed library + config (content/games/can-do.ts) render
// the seven play actions (reflect · role-play · strike-rewrite · branch · sort · match · build), led by
// erasing occupational gender myths + the dress-up "I can be that" build. gameId "can-do".
import { V2Game } from "@/components/games/v2-engine";
import { CAN_DO } from "@/content/games/can-do";

export function CanDoGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={CAN_DO} onExit={onExit} />;
}
