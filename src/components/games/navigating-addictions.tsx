"use client";

// Navigating Addictions (node g68, Parent Layer, Chapter 8): NEW v2 build to GDD 68 (mechanic-embodying), a
// HIGH-CARE Parent-Layer pillar. Core insight: shame and punishment drive addiction underground, while calm,
// connection and the right help bring it into the light. Runs on the shared v2 engine: its researched typed
// library + config (content/games/navigating-addictions.ts) render the play actions (strike-rewrite · branch ·
// role-play · sort · match · reflect · spot), led by strike-rewrite + branch + role-play. Six modes: spot the
// signs (calm noticing not snooping; gaming disorder is recognised), respond don't rupture (connection over
// control; firm about the behaviour, unconditionally there for the child), it's a health issue (treatable
// condition: brain/genes/environment, not weak willpower or moral failing; recovery is real), get the right help
// (counselling & de-addiction early; family involvement helps; Tele-MANAS 14416, Childline 1098), screens and
// modelling (whole-family limits; tend your OWN habits), tools and safety (acute risk = emergency -> 112/hospital).
// High-care, firmly non-shaming of child AND parent; never any how-to for substances; not medical advice. Builds
// on Bounce (g39); connects to Reality Check (g28) & Decoded (g36). gameId "navigating-addictions".
import { V2Game } from "@/components/games/v2-engine";
import { NAVIGATING_ADDICTIONS } from "@/content/games/navigating-addictions";

export function NavigatingAddictionsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={NAVIGATING_ADDICTIONS} onExit={onExit} />;
}
