"use client";

// Not Fair, Not Funny (node g11, ages 6-9, Chapter 2): NEW v2 build to GDD 11 (mechanic-embodying). The
// gender-teasing & ally game in the Gender & Respect thread, run on the shared v2 engine: its researched typed
// library + config (content/games/not-funny.ts) render the play actions (branch · reflect · strike-rewrite ·
// role-play · sort · build · spot · match), led by teasing-moment dilemmas (branch), say-the-comeback / ally
// lines (role-play), and the ally-toolkit builder (build). Impact over intent; don't villainise the joker;
// protect the target; safe escalation (reporting not tattling: Childline 1098). Builds on g10, prereq g10.
// gameId "not-funny" (the GDD/library "not-fair-not-funny" is design-doc only).
import { V2Game } from "@/components/games/v2-engine";
import { NOT_FUNNY } from "@/content/games/not-funny";

export function NotFunnyGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={NOT_FUNNY} onExit={onExit} />;
}
