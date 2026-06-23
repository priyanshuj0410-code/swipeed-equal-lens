"use client";

// Lead the Way (node g33, ages 15–18, Chapter 5) — NEW v2 build to GDD 33 (mechanic-embodying). The structural-
// equality → leadership node (Thread E · Gender & Respect), run on the shared v2 engine: its researched typed
// library + config (content/games/lead-the-way.ts) render the play actions (reflect · branch · strike-rewrite ·
// sort · role-play · match · spot), led by branch + strike-rewrite + reflect. You don’t need a title to lead: be
// the ally, set the example, lift others, change the room — whatever your gender. Allyship is everyone’s job and
// men leading on gender equality is strength, not betrayal (key India reframe). Real gaps (pay ~34%, leadership,
// unpaid care) turned into quiet everyday leadership: lead by example, lift as you climb, call in over call out.
// India: engage boys/men as allies; persuasion over confrontation; Women’s Reservation Act 2023. Safety first:
// 181/112/Childline 1098. Builds on g26 & g27; sets up g34. gameId "lead-the-way".
import { V2Game } from "@/components/games/v2-engine";
import { LEAD_THE_WAY } from "@/content/games/lead-the-way";

export function LeadTheWayGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={LEAD_THE_WAY} onExit={onExit} />;
}
