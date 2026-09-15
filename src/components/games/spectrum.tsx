"use client";

// Spectrum (node g32, ages 15-18, Chapter 5): NEW v2 build to GDD 32 (mechanic-embodying). The identity /
// orientation / respect node (Thread D · Relationships), run on the shared v2 engine: its researched typed
// library + config (content/games/spectrum.ts) render the play actions (reflect · branch · strike-rewrite ·
// sort · role-play · match · spot), led by strike-rewrite + branch + reflect. Respect is a value, not a debate;
// understanding without disparaging anyone’s family or beliefs; separates honest belief-differences (respected)
// from the dignity floor (upheld). Supports anyone questioning, no pressure to label, complete confidentiality;
// never outs anyone. Non-explicit. India: 2018 decriminalisation, NALSA, constitutional dignity; routes distress/
// family-conflict to a trusted adult, Tele-MANAS 14416, Childline 1098. Builds on g7 & g25;
// links g27 & g31. gameId "spectrum".
import { V2Game } from "@/components/games/v2-engine";
import { SPECTRUM } from "@/content/games/spectrum";

export function SpectrumGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={SPECTRUM} onExit={onExit} />;
}
