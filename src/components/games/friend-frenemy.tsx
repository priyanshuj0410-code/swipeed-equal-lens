"use client";

// Friend or Frenemy? (node g09, ages 6–9, Chapter 2) — reworked to GDD 09 v2 (mechanic-embodying). The
// healthy-friendship game runs on the shared v2 engine: its researched typed library + config
// (content/games/friend-frenemy.ts) render the play actions (reflect · role-play · strike-rewrite · branch ·
// sort · match · build · spot), led by friendship dilemmas (branch), say-the-line comebacks (role-play), and
// frenemy-flag spot scenes. Autonomy over verdicts; safe to be wrong; name behaviours not "bad kids";
// bullying/safety routes to a trusted adult (Childline 1098). gameId "friend-frenemy".
import { V2Game } from "@/components/games/v2-engine";
import { FRIEND_FRENEMY } from "@/content/games/friend-frenemy";

export function FriendFrenemyGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FRIEND_FRENEMY} onExit={onExit} />;
}
