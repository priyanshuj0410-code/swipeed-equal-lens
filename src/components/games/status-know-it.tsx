"use client";

// Status: Know It (node g30, ages 15-18, Chapter 5), NEW v2 build to GDD 30 (mechanic-embodying). The STI/HIV
// testing-&-treatment node (Thread F · SRH), run on the shared v2 engine: its researched typed library + config
// (content/games/status-know-it.ts) render the play actions (strike-rewrite · branch · reflect · sort · match ·
// role-play · spot), led by strike-rewrite + branch + sort. Owning your sexual health: testing is power not
// shame; build a prevention stack; talk to a partner; treatment works (HIV manageable, U=U; STIs treatable/
// curable); dignity for all, zero stigma. Comprehensive but never explicit; delaying respected. India: NACO ICTC
// free confidential testing, RKSK, PrEP; POCSO-aware; routes coercion/distress to help. Builds on g23; pairs
// g29; links g31. gameId "status-know-it".
import { V2Game } from "@/components/games/v2-engine";
import { STATUS_KNOW_IT } from "@/content/games/status-know-it";

export function StatusKnowItGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={STATUS_KNOW_IT} onExit={onExit} />;
}
