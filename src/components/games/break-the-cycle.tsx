"use client";

// Break the Cycle (node g65, Parent Layer, Chapter 8) — NEW v2 build to GDD 65 (mechanic-embodying), the EMOTIONAL
// CORE of the Parent Layer and the deepest Unlearn->Relearn beat in the app: we parent the way we were parented,
// until we choose not to. FIRMLY NON-SHAMING — busts the practice, never the parent. Runs on the shared v2 engine:
// its researched typed library + config (content/games/break-the-cycle.ts) render the play actions (strike-rewrite
// · branch · reflect · role-play · sort · match · spot), led by strike-rewrite + branch + reflect. Six modes: how
// you were raised (keep the good, leave the harmful; inheritance isn't destiny), discipline differently (firm AND
// kind; busts 'a slap never hurt me'/'fear=respect'/'positive=permissive'/'shaming motivates'; physical punishment
// is harmful & ineffective), the repair (clean apology, repair beats perfection), calm yourself (self-regulation,
// triggers, step away safely), heal your own wounds (tend old pain; not therapy), tools/help. Care-sensitive &
// child-safety aware; never endorses hitting/shaming; deeper wounds -> Tele-MANAS 14416; patterns risking harm ->
// Be the Safe Adult g69. Builds on g38 & g39 + the UN->RE core. gameId "break-the-cycle".
import { V2Game } from "@/components/games/v2-engine";
import { BREAK_THE_CYCLE } from "@/content/games/break-the-cycle";

export function BreakTheCycleGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={BREAK_THE_CYCLE} onExit={onExit} />;
}
