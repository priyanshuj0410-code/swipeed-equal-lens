"use client";

// Body Confident (node g21, ages 12-15, Chapter 4): NEW v2 build to GDD 21 (mechanic-embodying). The
// puberty-depth + body-image + media-literacy node (Thread A) that OPENS Chapter 4, run on the shared v2 engine:
// its researched typed library + config (content/games/body-confident.ts) render the play actions (strike-rewrite ·
// spot · sort · reflect · branch · role-play · build), led by strike-rewrite (bust the beauty myth), spot
// (Fact-or-Filter) and sort (real vs filtered, care vs 'fix'). Body-neutral (worth untied from looks; never
// diet/ideal-body framing) + media literacy; names India's colourism as a harmful false standard; gender-inclusive.
// Wellbeing-safe: persistent body distress / disordered-eating signs route to a trusted adult, counsellor or
// doctor (Childline 1098). Builds on g13; prereq c3. gameId "body-confident".
import { V2Game } from "@/components/games/v2-engine";
import { BODY_CONFIDENT } from "@/content/games/body-confident";

export function BodyConfidentGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={BODY_CONFIDENT} onExit={onExit} />;
}
