"use client";

// Firewall (node g40, ages 12–15, Chapter 4) — NEW v2 build to GDD 40 (mechanic-embodying). The teen
// online-safety node (Thread B · Safety, Consent & Boundaries) — high-stakes safeguarding handled calm, never
// fear-mongering — run on the shared v2 engine: its researched typed library + config (content/games/firewall.ts)
// render the play actions (branch · strike-rewrite · spot · sort · role-play · reflect · match), led by the
// safe-move chooser (branch), spot (grooming red flags) and role-play. Spot grooming & fakes, think before you
// share, and the signature SEXTORTION PLAN: don't panic, don't pay, don't send more, it's NOT your fault, save
// the evidence (block but don't delete), tell a trusted adult, report. Non-explicit, never victim-blaming,
// never how-to-harm; POCSO/IT-Act aware (a minor is a protected victim, never in trouble); real routes (trusted
// adult, cybercrime.gov.in / 1930, Childline 1098). Builds on g15; prereq g27. gameId "firewall".
import { V2Game } from "@/components/games/v2-engine";
import { FIREWALL } from "@/content/games/firewall";

export function FirewallGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FIREWALL} onExit={onExit} />;
}
