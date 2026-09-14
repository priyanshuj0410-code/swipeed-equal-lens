"use client";

// Raising Gender-Diverse Kids (node g66, Parent Layer, Chapter 8) — NEW v2 build to GDD 66 (mechanic-embodying), a
// SENSITIVE Parent-Layer node handled with the care of Spectrum (g32): dignity-first, never-out, child-safety-
// centred. The evidence is the spine: an affirming parent is the single biggest protective factor — family
// acceptance roughly HALVES the odds of suicidal thoughts. Runs on the shared v2 engine: its researched typed
// library + config (content/games/raising-gender-diverse-kids.ts) render the play actions (strike-rewrite · branch
// · role-play · reflect · sort · match · spot), led by strike-rewrite + branch + role-play. Six modes: acceptance
// is protection (lead with love before full understanding), understand (orientation/identity/expression are 3
// different things; busts phase/choice/illness myths), if they come out (first reaction matters; gratitude &
// unconditional love; NEVER out the child), protect and affirm (safe harbour; name & pronouns; no pressure to
// label/mask), your own journey (meet your fears with a supportive ADULT, not your child), support & India (NEVER
// conversion 'cures'; Tele-MANAS 14416; NALSA & decriminalisation). Affirming, evidence-based,
// compassionate; child's safety & dignity non-negotiable; records no identity. Builds on g32 & g07. gameId
// "raising-gender-diverse-kids".
import { V2Game } from "@/components/games/v2-engine";
import { RAISING_GENDER_DIVERSE_KIDS } from "@/content/games/raising-gender-diverse-kids";

export function RaisingGenderDiverseKidsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={RAISING_GENDER_DIVERSE_KIDS} onExit={onExit} />;
}
