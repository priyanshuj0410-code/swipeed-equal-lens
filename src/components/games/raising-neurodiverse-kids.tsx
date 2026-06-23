"use client";

// Raising Neurodiverse Kids (node g67, Parent Layer, Chapter 8) — NEW v2 build to GDD 67 (mechanic-embodying), a
// Parent-Layer pillar and a warm callback to Same Same, Different (g04): difference is wonderful, grown up for
// parents. Reframes neurodivergence as DIFFERENCE, not deficiency — strengths-first, never deficit-shaming. Runs
// on the shared v2 engine: its researched typed library + config (content/games/raising-neurodiverse-kids.ts)
// render the play actions (strike-rewrite · branch · sort · reflect · match · role-play · spot), led by
// strike-rewrite + branch + sort. Six modes: understand your child (different not less; brains vary), accommodate
// (adjust the environment, not the child; accommodations are fair access like glasses), advocate (key advocate;
// rights under the RPwD Act 2016; seek assessment without shame), drop the shame and blame (no one's fault — not
// parenting/screens/vaccines; meltdowns are overwhelm not naughtiness), strengths and wellbeing (build on
// strengths; calm co-regulation not punishment; the whole wonderful child not a label), support and you (it's
// demanding; lean on peers & professionals; burnout → Looking After You g63). Strengths-based, never
// deficit-shaming, never blaming; NOT a diagnostic tool — points to professionals. Builds on g04; a pillar
// alongside g65 & g66. gameId "raising-neurodiverse-kids".
import { V2Game } from "@/components/games/v2-engine";
import { RAISING_NEURODIVERSE_KIDS } from "@/content/games/raising-neurodiverse-kids";

export function RaisingNeurodiverseKidsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={RAISING_NEURODIVERSE_KIDS} onExit={onExit} />;
}
