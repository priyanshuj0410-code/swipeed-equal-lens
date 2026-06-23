"use client";

// Outbreak: Stop the Spread (node g23, ages 12–15, Chapter 4) — NEW v2 build to GDD 23 (mechanic-embodying).
// The STI + HIV public-health + anti-stigma node (Thread F · SRH), run on the shared v2 engine: its researched
// typed library + config (content/games/outbreak.ts) render the play actions (branch · sort · strike-rewrite ·
// build · reflect · match · role-play), led by branch (make the public-health move), strike-rewrite (bust the STI
// myth) and sort (real route vs myth). How STIs spread (and don't); many are SILENT so testing is the only way to
// know; the real toolkit (waiting, condoms, vaccines incl. HPV — free for 14-yr-old girls in India, testing,
// treatment); all STIs treatable/most curable; STIGMA is the real harm — care, not shame. School-comfort,
// NON-EXPLICIT; routes to a clinic/doctor. GATED at the path layer. Builds on g20; prereq g22. gameId "outbreak"
// (the engine-host registry id; the GDD/library aspirational id is "outbreak-stop-the-spread").
import { V2Game } from "@/components/games/v2-engine";
import { OUTBREAK } from "@/content/games/outbreak";

export function OutbreakGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={OUTBREAK} onExit={onExit} />;
}
