"use client";

// Many Ways to Family (node g60, ages 22+, Chapter 7) — NEW v2 build to GDD 60 (mechanic-embodying), the EQUITY
// NODE CLOSING Chapter 7 and the counterpart to If, When & Whether (g59): for everyone whose route to parenthood
// isn't the default biological one. Runs on the shared v2 engine: its researched typed library + config
// (content/games/many-ways-to-family.ts) render the play actions (strike-rewrite · match · sort · reflect · branch
// · role-play · spot), led by strike-rewrite + match + sort. Six modes: every route is real family (busts 'real
// family is only biological'), the routes (adoption, fostering, IVF/ART, surrogacy, single & LGBTQ+ parenthood),
// the real path (honest steps/costs/emotions; setbacks aren't a verdict), name the barriers (India's specific,
// gendered & legal barriers — CARA, Surrogacy/ART Acts, Supriyo 2023; told honestly), your family your way
// (dignity, chosen family), tools/help. Legal/eligibility content is GENERAL, DATED (2024-25) & EVOLVING — NOT
// legal advice; verify & localise. Every family form treated with full dignity; LGBTQ+ handled with Spectrum's
// care (no outing). Builds on g32 & g54. gameId "many-ways-to-family".
import { V2Game } from "@/components/games/v2-engine";
import { MANY_WAYS_TO_FAMILY } from "@/content/games/many-ways-to-family";

export function ManyWaysToFamilyGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MANY_WAYS_TO_FAMILY} onExit={onExit} />;
}
