"use client";

// Own Your Health (node g47, ages 18–22, Chapter 6) — NEW v2 build to GDD 47 (mechanic-embodying), the College
// SRH-ownership node (Thread F), reworking the old ModesEngine build onto the shared v2 engine: its researched
// typed library + config (content/games/own-your-health.ts) render the play actions (branch · strike-rewrite ·
// sort · reflect · spot · role-play · match), led by branch + strike-rewrite + sort. SRH becomes fully the young
// adult's own: protection sorted (dual protection), know your status (routine testing, U=U, confidential),
// pleasure & wellbeing (a normal part of health), the health talk, confidential access. Comprehensive and frank,
// never explicit-as-instruction, medically accurate, shame-free; confidentiality foregrounded; even-handed across
// genders/orientations. India: NACO ICTC, RKSK clinics, doctors/pharmacies. Builds on g30/g29/g22; pairs g44;
// feeds Chapter 7. gameId "own-your-health".
import { V2Game } from "@/components/games/v2-engine";
import { OWN_YOUR_HEALTH } from "@/content/games/own-your-health";

export function OwnYourHealthGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={OWN_YOUR_HEALTH} onExit={onExit} />;
}
