"use client";

// Green Light / Red Light (node g24, ages 12–15, Chapter 4) — NEW v2 build to GDD 24 (mechanic-embodying). THE
// TEEN FLAGSHIP and namesake swipe game (relationships & consent), run on the shared v2 engine: its researched
// typed library + config (content/games/glrl.ts) render the play actions — LED BY THE SIGNATURE SWIPE verb
// (read a relationship cue, swipe it green-flag / red-flag) — plus branch · strike-rewrite · role-play · sort ·
// reflect · spot. Green/red flag reading (One Love) + the FRIES consent model across friendships, family and
// romantic. Safeguarding: a crossed line is NEVER your fault; serious red flags / coercion route to a trusted
// adult or Childline 1098/112; leaving what harms you is strength. School-comfort, non-explicit. GATED at the
// path layer. Builds on g15; prereq g23. The swipe mechanic was added to the v2 engine for this flagship.
// gameId "glrl" (the engine-host registry id; the GDD/library aspirational id is "green-light-red-light").
import { V2Game } from "@/components/games/v2-engine";
import { GLRL } from "@/content/games/glrl";

export function GlrlGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={GLRL} onExit={onExit} />;
}
