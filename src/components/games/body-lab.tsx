"use client";

// Body Lab Juniors (node g06, ages 6-9, Chapter 2): reworked to GDD 06 v2 (mechanic-embodying). The
// body-science game runs on the shared v2 engine: its researched typed library + config
// (content/games/body-lab.ts) render the eight play actions (reflect · role-play · strike-rewrite · branch ·
// sort · match · build · explore-label), led by the signature explore-label body-lab tap. gameId "body-lab".
import { V2Game } from "@/components/games/v2-engine";
import { BODY_LAB } from "@/content/games/body-lab";

export function BodyLabGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={BODY_LAB} onExit={onExit} />;
}
