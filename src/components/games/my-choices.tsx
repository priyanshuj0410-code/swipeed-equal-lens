"use client";

// My Choices, My Future (node g29, ages 15–18, Chapter 5 opener) — NEW v2 build to GDD 29 (mechanic-embodying).
// The contraception / family-planning / services node (Thread F · SRH), run on the shared v2 engine: its
// researched typed library + config (content/games/my-choices.ts) render the play actions (branch ·
// strike-rewrite · reflect · sort · role-play · spot · match), led by branch (decide it), strike-rewrite (bust
// the myth) and sort. The full picture on methods/effectiveness/access, if-when-whether it's your call,
// values-based decisions, real access & rights, talking to a partner/doctor. AUTONOMY-FIRST, comprehensive but
// never explicit: no pressure in any direction — waiting is fully valid and the most certain option; being
// active isn't irresponsible (informed/consensual/protected is what matters). India: confidential AFHC/Ujala
// services; coercion of an under-18 is a child-protection matter → routes to a doctor / trusted adult /
// Childline 1098. Builds on g22; links g30/g31. gameId "my-choices" (the engine-host registry id; the
// GDD/library aspirational id is "my-choices-future").
import { V2Game } from "@/components/games/v2-engine";
import { MY_CHOICES } from "@/content/games/my-choices";

export function MyChoicesGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MY_CHOICES} onExit={onExit} />;
}
