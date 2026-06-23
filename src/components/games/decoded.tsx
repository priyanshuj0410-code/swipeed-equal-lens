"use client";

// Decoded (node g36, ages 15–18, Chapter 5) — NEW v2 build to GDD 36 (mechanic-embodying). The media-literacy
// FINALE and summit of the 3–18 journey (Thread G · Values, Rights & Media), run on the shared v2 engine: its
// researched typed library + config (content/games/decoded.ts) render the play actions (branch · strike-rewrite ·
// reflect · sort · spot · match · role-play), led by strike-rewrite + branch + spot. The feed is engineered to use
// you — learn to read it and use it instead. Decode the machine (algorithms, attention economy, filter bubbles),
// the influence (misinfo, AI fakes/deepfakes, propaganda, scams, dark patterns), pornography (gated, non-explicit:
// staged performance, not real, not sex-ed, no shame), yourself (digital wellbeing), then decode anything, and
// Grow (URG, a digital-life charter). Critical not cynical; a game about manipulation that uses no dark patterns.
// India: deepfakes, scams, DPDP Act, cybercrime 1930. Non-explicit throughout. Builds on g28 & g12/g17; closes
// the journey before the c5 capstone. gameId "decoded".
import { V2Game } from "@/components/games/v2-engine";
import { DECODED } from "@/content/games/decoded";

export function DecodedGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={DECODED} onExit={onExit} />;
}
