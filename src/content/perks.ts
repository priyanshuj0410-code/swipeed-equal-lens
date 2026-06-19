import type { Perk, PerkId } from "@/lib/types";

// Insight perks — equipped before a run (2–3). They aid reading, learning or comfort; none of
// them marks a card correct for you, and none is ever purchased. MVP ships the four "Start" perks;
// the wider catalogue (X-Ray, Streak Shield, Combo Master, …) unlocks by play in a later phase.
export const PERKS: Perk[] = [
  { id: "slow-mo", name: "Slow-Mo", emoji: "🐢", effect: "+50% time to read disguised cards this run.", tag: "read", unlock: "Start" },
  { id: "gut-check", name: "Gut Check", emoji: "🫀", effect: "A subtle hint pulses if you hesitate too long on a card.", tag: "read", unlock: "Start" },
  { id: "truth-serum", name: "Truth Serum", emoji: "🧪", effect: "After a wrong read, get an extra-clear explanation (a learning boost).", tag: "learn", unlock: "Start" },
  { id: "calm-mind", name: "Calm Mind", emoji: "🧘", effect: "Removes the timer for the run (trades the speed bonus) — accessibility-friendly.", tag: "comfort", unlock: "Start" },
];

export const PERK_BY_ID: Record<PerkId, Perk> = Object.fromEntries(
  PERKS.map((p) => [p.id, p])
) as Record<PerkId, Perk>;

/** MVP: all four perks are available from the start. */
export const STARTER_PERKS: PerkId[] = PERKS.map((p) => p.id);

/** Loadout rules: equip 2–3 perks before a run. */
export const LOADOUT = { min: 2, max: 3 } as const;

/** Lightweight synergy hints surfaced on the loadout screen (white-hat flavour, not balance). */
export const SYNERGIES: { perks: PerkId[]; label: string }[] = [
  { perks: ["slow-mo", "gut-check"], label: "Gentle Reading — a calm, beginner-friendly build" },
  { perks: ["truth-serum", "calm-mind"], label: "No-Pressure Learning — great if you're just here to learn" },
];
