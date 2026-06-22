"use client";

// Puberty Quest (node g13, ages 9–12, Chapter 3) — NEW v2 build to GDD 13 (mechanic-embodying). The timely
// puberty node and the first Chapter 3 node (register: matter-of-fact, near-peer, private/solo), run on the
// shared v2 engine: its researched typed library + config (content/games/puberty-quest.ts) render the play
// actions (strike-rewrite · reflect · branch · match · sort · build · role-play), led by myth-busts
// (strike-rewrite), private reflections, and real-moment dilemmas (branch). Accurate & inclusive (girls AND
// boys); periods without shame (busting India's menstrual taboos, with dignity); private/solo; routes to
// trusted sources / support (Childline 1098). Builds on g06; feeds g14 & g38. gameId "puberty-quest".
import { V2Game } from "@/components/games/v2-engine";
import { PUBERTY_QUEST } from "@/content/games/puberty-quest";

export function PubertyQuestGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={PUBERTY_QUEST} onExit={onExit} />;
}
