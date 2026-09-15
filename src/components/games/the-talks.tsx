"use client";

// The Talks, Age by Age (node g64, Parent Layer, Chapter 8): NEW v2 build to GDD 64 (mechanic-embodying), the
// KEYSTONE of the Parent Layer and the hinge of the generational loop: a parent guided here becomes the trusted
// adult the kids' journey always assumed. Core reframe: not one dreaded 'talk', but many small, age-right
// conversations. Runs on the shared v2 engine: its researched typed library + config (content/games/the-talks.ts)
// render the play actions (role-play · strike-rewrite · branch · sort · reflect · match · spot), led by role-play
// + strike-rewrite + branch. Six modes: how to talk (the askable open door; 'I don't know' is fine), the early
// years (correct body names protect against abuse; consent basics), the middle years (puberty before it starts;
// online basics), the teen talks (consent, porn-literacy vs the manosphere, respect), facts and your values (both,
// not either/or: silence cedes the field to the algorithm), tools/help (routes child-safety to Be the Safe Adult
// g69). Protective & evidence-based; correct names make kids SAFER; never shames a parent for not knowing. Builds
// on / mirrors My Body, My Rules (g02). gameId "the-talks".
import { V2Game } from "@/components/games/v2-engine";
import { THE_TALKS } from "@/content/games/the-talks";

export function TheTalksGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={THE_TALKS} onExit={onExit} />;
}
