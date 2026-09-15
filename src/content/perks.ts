import type { Perk, PerkId, Profile } from "@/lib/types";

// Powers (Insight perks): equipped before a run (2-3). They aid reading, learning or comfort; none
// marks a card correct for you, and none is ever purchased. The first four are available from the
// start; the next four unlock by play (white-hat progression: milestones, never money).
export const PERKS: Perk[] = [
  { id: "slow-mo", name: "Slow-Mo", emoji: "🐢", effect: "+50% time to read disguised cards this run.", tag: "read", unlock: "Start" },
  { id: "gut-check", name: "Gut Check", emoji: "🫀", effect: "A subtle hint pulses if you hesitate too long.", tag: "read", unlock: "Start" },
  { id: "truth-serum", name: "Truth Serum", emoji: "🧪", effect: "After a wrong read, get an extra-clear explanation.", tag: "learn", unlock: "Start" },
  { id: "calm-mind", name: "Calm Mind", emoji: "🧘", effect: "Removes the timer for the run: accessibility-friendly.", tag: "comfort", unlock: "Start" },
  { id: "x-ray", name: "X-Ray", emoji: "🔍", effect: "Reveals the hidden sign on the first disguised card (you still choose).", tag: "read", unlock: "Read 12 disguised cards" },
  { id: "streak-shield", name: "Streak Shield", emoji: "🛡️", effect: "Survive your first wrong read without losing Clarity.", tag: "comfort", unlock: "Finish 3 runs" },
  { id: "combo-master", name: "Combo Master", emoji: "🔥", effect: "Combos build Clarity faster: rewards reading streaks.", tag: "read", unlock: "Hit an 8-combo" },
  { id: "boss-bane", name: "Boss Bane", emoji: "🎯", effect: "Bonus Clarity for reading the boss card right.", tag: "learn", unlock: "Earn a 3-star run" },
];

export const PERK_BY_ID: Record<PerkId, Perk> = Object.fromEntries(
  PERKS.map((p) => [p.id, p])
) as Record<PerkId, Perk>;

/** The always-available "Start" powers (used as the default pair for one-tap Daily/Hard runs). */
export const STARTER_PERKS: PerkId[] = PERKS.filter((p) => p.unlock === "Start").map((p) => p.id);

/** Is a power unlocked yet? Start powers always; the rest gate on lifetime meta-progression. */
export function isPerkUnlocked(id: PerkId, profile: Profile): boolean {
  switch (id) {
    case "x-ray":
      return (profile.disgSeen ?? 0) >= 12;
    case "streak-shield":
      return (profile.runsCompleted ?? 0) >= 3;
    case "combo-master":
      return (profile.bestStreak ?? 0) >= 8;
    case "boss-bane":
      return Object.values(profile.deckStars ?? {}).some((s) => s >= 3);
    default:
      return true; // Start powers
  }
}

/** Loadout rules: equip 2-3 powers before a run. */
export const LOADOUT = { min: 2, max: 3 } as const;

/** Lightweight synergy hints surfaced on the loadout screen (white-hat flavour, not balance). */
export const SYNERGIES: { perks: PerkId[]; label: string }[] = [
  { perks: ["slow-mo", "gut-check"], label: "Gentle Reading: calm, beginner-friendly" },
  { perks: ["truth-serum", "calm-mind"], label: "No-Pressure Learning" },
  { perks: ["combo-master", "boss-bane"], label: "High Score: for the confident reader" },
];
