// The Life-Skills Toolkit (Thread C spine) — the registry + progression helpers.
// Design-of-record: knowledge/games/life-skills-toolkit.md. The four tools are a persistent, on-device
// object a child builds and levels across the whole journey; the five Thread-C games own & deepen them,
// and other games only *reference* them (tool moments). Healthy-only, routes to real help, never therapy.

import type { Profile, ToolId, ToolState } from "@/lib/types";

export type Tool = {
  id: ToolId;
  name: string;
  emoji: string;
  tagline: string;
  unesco: string;
};

// The four tools, in carry order.
export const TOOLS: Tool[] = [
  { id: "cool-down", name: "Cool-Down", emoji: "🌬️", tagline: "Notice & handle big feelings, the healthy way.", unesco: "5.6 Emotions & wellbeing" },
  { id: "decision-steps", name: "Decision Steps", emoji: "🧭", tagline: "A clear way to make a good choice.", unesco: "5.2 Decision-making" },
  { id: "talk-it-out", name: "Talk-It-Out", emoji: "💬", tagline: "Say it and sort it — calmly.", unesco: "5.3 Communication & conflict" },
  { id: "help-map", name: "Help Map", emoji: "🆘", tagline: "Who to turn to, and how.", unesco: "5.5 Finding help & support" },
];

export const TOOL_IDS: ToolId[] = TOOLS.map((t) => t.id);
const TOOL_BY_ID: Record<ToolId, Tool> = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, Tool>;
export const toolById = (id: ToolId): Tool => TOOL_BY_ID[id];

export const MAX_LEVEL = 5;

// Which chapter-level each Thread-C game brings the whole toolkit to (one per chapter). Completing a
// Thread-C game raises every tool to at least its chapter level — the toolkit grows chapter by chapter.
// Keyed by engine-host game id (note: Feelings Friends' engine id is `feelings`).
export const THREAD_C_LEVEL: Record<string, number> = {
  feelings: 1, // Feelings Friends (3–6)
  "heart-smart": 2, // Heart Smart (6–9)
  "mind-matters": 3, // Mind Matters (9–12)
  bounce: 4, // Bounce (12–15)
  "life-ready": 5, // Life Ready (15–18)
};

// Which tools a finished game unlocks, and to what level. Thread-C games raise the whole toolkit to their
// chapter level (the toolkit grows a chapter at a time). All four tools are present from Ch.1 per the
// design doc's grow-table. Returns [] for non-Thread-C games (they only *reference* tools — tool moments).
export function toolsUnlockedBy(gameId: string): { id: ToolId; level: number }[] {
  const level = THREAD_C_LEVEL[gameId];
  if (!level) return [];
  return TOOL_IDS.map((id) => ({ id, level }));
}

/** The level a child has in a tool (0 = locked). */
export function toolLevel(profile: Profile, id: ToolId): number {
  return profile.toolkit?.[id]?.level ?? 0;
}

export function isUnlocked(profile: Profile, id: ToolId): boolean {
  return toolLevel(profile, id) >= 1;
}

/** Tools the child has unlocked, in carry order. Empty until the first Thread-C game is played. */
export function unlockedTools(profile: Profile): Tool[] {
  return TOOLS.filter((t) => isUnlocked(profile, t.id));
}

export function toolState(profile: Profile, id: ToolId): ToolState | undefined {
  return profile.toolkit?.[id];
}
