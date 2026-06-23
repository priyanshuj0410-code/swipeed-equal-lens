"use client";

// Respect at Home (node g56, ages 22+, Chapter 7) — NEW v2 build to GDD 56 (mechanic-embodying), the CHAPTER'S
// HIGHEST-SAFEGUARDING node: it carries the consent thread into marriage — the place consent is most often assumed
// away. Marriage doesn't cancel consent, and love is never control. Runs on the shared v2 engine: its researched
// typed library + config (content/games/respect-at-home.ts) render the play actions (strike-rewrite · branch ·
// role-play · sort · reflect · spot · match), led by strike-rewrite + branch + role-play. Modes: respect daily,
// consent inside (married is NOT standing consent), spot abuse & control (emotional/financial/sexual/physical +
// coercive control), safety & help (recognise danger, safety-planning, where to get help), never-your-fault,
// tools/help. Survivor-centred, never victim-blaming, even-handed across genders, non-graphic; DV Act 2005 civil
// framing (marital-consent criminal law is contested/evolving — educational, not legal advice); urgent routing
// 181/1091/112. Builds on g31 & g44; the protective backbone of Chapter 7. gameId "respect-at-home".
import { V2Game } from "@/components/games/v2-engine";
import { RESPECT_AT_HOME } from "@/content/games/respect-at-home";

export function RespectAtHomeGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={RESPECT_AT_HOME} onExit={onExit} />;
}
