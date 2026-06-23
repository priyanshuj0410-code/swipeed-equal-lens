"use client";

// Real Relationships (node g46, ages 18–22, Chapter 6) — NEW v2 build to GDD 46 (mechanic-embodying), the
// relationship heart of College (Thread D), reworking the old ModesEngine build onto the shared v2 engine: its
// researched typed library + config (content/games/real-relationships.ts) render the play actions (branch · sort
// · strike-rewrite · reflect · role-play · spot · match), led by branch + sort + strike-rewrite. Good
// relationships are built, not found: what healthy looks like, fight right (Four Horsemen + repair), red flags
// grown up (coercive control, jealousy-as-love, isolation, gaslighting), leaving safely & breakups. Abuse-aware
// (coercive control named; leaving valid/brave/never the target's fault; exit can escalate); breakup wellbeing-
// safe; non-graphic; even-handed. India: family scrutiny, caring-vs-controlling romanticised; helplines
// 181/1091/112. Builds on g24/g31/g09; between g45 and g47. gameId "real-relationships".
import { V2Game } from "@/components/games/v2-engine";
import { REAL_RELATIONSHIPS } from "@/content/games/real-relationships";

export function RealRelationshipsGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={REAL_RELATIONSHIPS} onExit={onExit} />;
}
