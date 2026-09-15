"use client";

// Reality Check (node g28, ages 12-15, Chapter 4): NEW v2 build to GDD 28 (mechanic-embodying). The teen
// media-literacy peak (Thread G · Values, Rights & Media), run on the shared v2 engine: its researched typed
// library + config (content/games/reality-check.ts) render the play actions (spot · strike-rewrite · swipe ·
// branch · reflect · sort · role-play · match), led by spot (catch the trick), strike-rewrite (bust the claim)
// and swipe (real or reel?). See the curation (filters, highlight reels, ads), the manipulation toolkit, a
// GATED non-explicit media-&-sexuality module (films ≠ real love; porn is staged, not sex-ed; bodies vary;
// curiosity is normal, no shame), deepfakes & your rights (a fake nude of a minor is illegal CSAM, never the
// target's fault, reportable), and the four critical questions. Calm, critical, never explicit; POCSO/BNS/
// IT-Rules aware; routes to a trusted adult, cybercrime.gov.in / 1930, Childline 1098. Builds on g16 & g12/g17;
// sets up g36. gameId "reality-check".
import { V2Game } from "@/components/games/v2-engine";
import { REALITY_CHECK } from "@/content/games/reality-check";

export function RealityCheckGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={REALITY_CHECK} onExit={onExit} />;
}
