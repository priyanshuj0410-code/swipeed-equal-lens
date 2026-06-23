"use client";

// Consent, For Real (node g44, ages 18–22, Chapter 6) — NEW v2 build to GDD 44 (mechanic-embodying), the first
// node of Chapter 6 (College) and the adult completion of the consent thread (Thread B). Reworks the old
// ModesEngine build onto the shared v2 engine: its researched typed library + config (content/games/consent-real.ts)
// render the play actions (branch · strike-rewrite · sort · reflect · role-play · spot · match), led by branch +
// strike-rewrite + role-play. Consent = enthusiastic/ongoing/freely-given/revocable/sober-enough yes between
// equals, in real adult life (parties, drinks, apps, hostel rooms). Survivor-centred (believe, never blame,
// respect their choices, signpost help); even-handed across genders; trauma-aware and strictly non-graphic.
// India: campus/hostel reality, Internal Committee (POSH/UGC); helplines 181/1091/112. Builds on g31 (Mutual).
// gameId "consent-real" (the library's "consent-for-real" is aspirational; registry id is "consent-real").
import { V2Game } from "@/components/games/v2-engine";
import { CONSENT_REAL } from "@/content/games/consent-real";

export function ConsentRealGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={CONSENT_REAL} onExit={onExit} />;
}
