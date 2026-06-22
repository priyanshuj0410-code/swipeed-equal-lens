"use client";

// My Body, My Rules (node g02, ages 3–6) — reworked to GDD 02 v2 (mechanic-embodying). The game is its
// researched typed library + config (content/games/my-body.ts); the shared v2 engine renders the seven
// play actions (reflect · role-play · strike-rewrite · branch · sort · match · build). gameId "my-body".
import { V2Game } from "@/components/games/v2-engine";
import { MY_BODY } from "@/content/games/my-body";

export function MyBodyGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MY_BODY} onExit={onExit} />;
}
