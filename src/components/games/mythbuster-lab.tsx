"use client";

// MythBuster: Gender (node g25, ages 12-15, Chapter 4), NEW v2 build to GDD 25 (mechanic-embodying). The
// gender-myth-busting node (Thread E) and a FLAGSHIP of the strike-and-rewrite signature, run on the shared v2
// engine: its researched typed library + config (content/games/mythbuster-lab.ts) render the play actions
// (strike-rewrite · sort · spot · branch · match · reflect · role-play), led by strike-rewrite (bust the myth),
// sort (fact vs myth) and spot (catch the myth). Busts gender myths teens hear constantly: ability/roles
// aren't gendered, emotion & leadership aren't male/female, the "it's just science" pseudo-science (naturalistic
// fallacy, averages-aren't-individuals, cherry-picking), and what equality really means. EVENHANDED, never
// anti-boy: equality lifts everyone, boys included; their struggles are validated AND equality championed.
// Builds on g18; prereq g24. gameId "mythbuster-lab" (the engine-host registry id; the GDD/library aspirational
// id is "mythbuster-gender").
import { V2Game } from "@/components/games/v2-engine";
import { MYTHBUSTER } from "@/content/games/mythbuster-lab";

export function MythBusterGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MYTHBUSTER} onExit={onExit} />;
}
