"use client";

// Same Same, Different (node g04, ages 3-6): reworked to GDD 04 v2 (mechanic-embodying). The gender-root
// game runs on the shared v2 engine: its researched typed library + config (content/games/same-same.ts)
// render the seven play actions (reflect · role-play · strike-rewrite · branch · sort · match · build),
// led by erasing silly gender rules ("anyone can"). gameId "same-same".
import { V2Game } from "@/components/games/v2-engine";
import { SAME_SAME } from "@/content/games/same-same";

export function SameSameGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={SAME_SAME} onExit={onExit} />;
}
