"use client";

// Crossroads (node g16, ages 9-12, Chapter 3): NEW v2 build to GDD 16 (mechanic-embodying). The
// decision-making node (Thread D) and the branching-dilemma flagship, run on the shared v2 engine: its
// researched typed library + config (content/games/crossroads.ts) render the play actions (branch · reflect ·
// strike-rewrite · role-play · sort · build · match), led by the branching dilemma card (branch): the
// reference branch engine later relationship/ethics nodes reuse. The reusable routine: stop & think, see
// options, weigh consequences, decide by values, own it. Decide-don't-dictate; real autonomy; safe to be wrong
// (change course); route big/risky calls to a trusted adult & Childline 1098. Builds on g09; prereq g15.
// gameId "crossroads".
import { V2Game } from "@/components/games/v2-engine";
import { CROSSROADS } from "@/content/games/crossroads";

export function CrossroadsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={CROSSROADS} onExit={onExit} />;
}
