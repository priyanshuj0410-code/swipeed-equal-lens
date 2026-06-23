// Chapter ↔ runtime-gameId mapping + the per-chapter narration-voice contract. The 8 chapters each target a
// different persona/age band, so the narration voice can be set per chapter (a gentle voice for the littlest
// learners, a peer voice for teens, a grounded adult voice for the college+ chapters). The voice prefs are
// stored as ONE JSON object keyed by chapter number (+ "default"), read by lib/speak.ts and written by /voice.

import { NODES } from "@/content/path";

// runtime gameId (e.g. "feelings", "capstone-6") → chapter number, derived from the canonical path table.
const GAME_TO_CH = new Map<string, number>();
for (const n of NODES) {
  if (!n.game) continue;
  const m = n.chapter.match(/Ch\.(\d+)/);
  if (m) GAME_TO_CH.set(n.game, parseInt(m[1], 10));
}
export function chapterOf(gameId: string): number | null {
  return GAME_TO_CH.get(gameId) ?? null;
}

// The 8 chapters and their personas (Ch.7–8 aren't built yet but the personas exist in the master plan).
export const CHAPTERS: { ch: number; ages: string; persona: string; emoji: string }[] = [
  { ch: 1, ages: "Ages 3–6", persona: "Little learners", emoji: "🧸" },
  { ch: 2, ages: "Ages 6–9", persona: "Curious kids", emoji: "🎨" },
  { ch: 3, ages: "Ages 9–12", persona: "Tweens", emoji: "🛹" },
  { ch: 4, ages: "Ages 12–15", persona: "Early teens", emoji: "🎧" },
  { ch: 5, ages: "Ages 15–18", persona: "Teens", emoji: "🎓" },
  { ch: 6, ages: "Ages 18–22", persona: "College / young adults", emoji: "🎒" },
  { ch: 7, ages: "22 → first child", persona: "Early adults & partners", emoji: "💞" },
  { ch: 8, ages: "Parenthood", persona: "Parents", emoji: "👶" },
];

export type VoiceCfg = {
  engine: "web" | "kokoro";
  webVoiceURI?: string;
  rate?: number;
  pitch?: number;
  kokoroVoice?: string;
  kokoroSpeed?: number;
};

export const VOICES_KEY = "swipeed.voices"; // localStorage JSON: { "1": VoiceCfg, …, "8": VoiceCfg, "default": VoiceCfg }

export function readVoiceMap(): Record<string, VoiceCfg> {
  try {
    const raw = localStorage.getItem(VOICES_KEY);
    if (raw) return JSON.parse(raw) as Record<string, VoiceCfg>;
  } catch { /* ignore */ }
  // legacy: a single global voice saved before per-chapter existed → use it as the default.
  try {
    const legacy: VoiceCfg = {
      engine: localStorage.getItem("swipeed.voice") === "kokoro" ? "kokoro" : "web",
      webVoiceURI: localStorage.getItem("swipeed.webVoiceURI") || undefined,
      rate: numOr(localStorage.getItem("swipeed.rate")),
      pitch: numOr(localStorage.getItem("swipeed.pitch")),
      kokoroVoice: localStorage.getItem("swipeed.voiceName") || undefined,
      kokoroSpeed: numOr(localStorage.getItem("swipeed.kokoroSpeed")),
    };
    return { default: legacy };
  } catch { return {}; }
}

export function cfgForChapter(map: Record<string, VoiceCfg>, ch: number | null): VoiceCfg {
  return (ch != null && map[String(ch)]) || map.default || { engine: "web" };
}

function numOr(v: string | null): number | undefined {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n : undefined;
}
