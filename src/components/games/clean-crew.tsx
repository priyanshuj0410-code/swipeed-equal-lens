"use client";

// Clean Crew (node g37, ages 3-6): reworked to GDD 37 v2 (mechanic-embodying). The game is its researched
// typed library + config (content/games/clean-crew.ts); the shared v2 engine renders the seven play actions
// (reflect · role-play · strike-rewrite · branch · sort · match · build), led by the signature step-sequencer
// build (wash/brush/bath/bedtime steps in order). gameId "clean-crew".
import { V2Game } from "@/components/games/v2-engine";
import { CLEAN_CREW } from "@/content/games/clean-crew";

export function CleanCrewGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={CLEAN_CREW} onExit={onExit} />;
}
