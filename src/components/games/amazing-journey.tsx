"use client";

// The Amazing Journey (node g14, ages 9-12, Chapter 3): NEW v2 build to GDD 14 (mechanic-embodying). The
// reproduction node (Thread F · Sexual & Reproductive Health), run on the shared v2 engine: its researched
// typed library + config (content/games/amazing-journey.ts) render the play actions (reflect · strike-rewrite ·
// branch · match · sort · build · role-play), led by awe+facts (reflect), myth-busts (strike-rewrite), and the
// journey-builder (build sequence). Accurate & inclusive (egg+sperm, uterus, both births; adoption/IVF/
// surrogacy all real & loved); private/solo; never graphic; busts the "baby's sex is the mother's fault" myth.
// Builds on g06 & g13; prereq g38; family-diversity links g03. gameId "amazing-journey" (the GDD/library
// "the-amazing-journey" is design-doc only).
import { V2Game } from "@/components/games/v2-engine";
import { AMAZING_JOURNEY } from "@/content/games/amazing-journey";

export function AmazingJourneyGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={AMAZING_JOURNEY} onExit={onExit} />;
}
