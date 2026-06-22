"use client";

// Feelings Friends (node g01, ages 3–6) — reworked to GDD 01 v2 (mechanic-embodying). The very first node;
// its researched typed library + config (content/games/feelings-friends.ts) runs on the shared v2 engine,
// which renders the seven play actions (reflect · role-play · strike-rewrite · branch · sort · match · build).
// gameId "feelings".
import { V2Game } from "@/components/games/v2-engine";
import { FEELINGS } from "@/content/games/feelings-friends";

export function FeelingsFriendsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FEELINGS} onExit={onExit} />;
}
