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
  webVoiceURI?: string;       // a SPECIFIC device voice (set in the lab) — only resolves where that voice exists
  webVoicePrefer?: string[];  // PORTABLE preference: pick the first available voice whose name/lang matches one of these
  rate?: number;
  pitch?: number;
  kokoroVoice?: string;
  kokoroSpeed?: number;
};

export const VOICES_KEY = "swipeed.voices"; // localStorage JSON: per-device OVERRIDES of BUILTIN { "1"…"8" | "default": VoiceCfg }

// — APP-WIDE DEFAULTS (shipped in code → every user/device gets these unless they override in /voice) —
// Device voices differ per device, so the default expresses a PORTABLE preference (best Indian/UK/US English
// voice available on that device) plus age-tuned rate/pitch, rather than one fixed voice that wouldn't exist
// everywhere. For a single identical voice on every device, switch a chapter's engine to "kokoro" here (costs
// the one-time model download) or move to pre-generated clips.
const PREFER = ["en-IN", "india", "rishi", "veena", "heera", "en-GB", "google uk english female", "serena", "daniel", "en-US", "google us english", "samantha"];
const web = (rate: number, pitch: number): VoiceCfg => ({ engine: "web", rate, pitch, webVoicePrefer: PREFER, kokoroVoice: "af_heart", kokoroSpeed: 1 });
export const BUILTIN: Record<string, VoiceCfg> = {
  default: web(0.97, 1.05),
  "1": web(0.9, 1.15),  // littlest learners — slower, brighter
  "2": web(0.92, 1.12),
  "3": web(0.95, 1.08),
  "4": web(0.97, 1.06),
  "5": web(1.0, 1.04),
  "6": web(1.0, 1.02),  // college / young adult — natural
  "7": web(1.0, 1.0),
  "8": web(1.0, 1.0),
};

/** The user's per-device OVERRIDES from /voice (empty if they've never saved on this device). */
export function readVoiceMap(): Record<string, VoiceCfg> {
  try {
    const raw = localStorage.getItem(VOICES_KEY);
    if (raw) return JSON.parse(raw) as Record<string, VoiceCfg>;
  } catch { /* ignore */ }
  return {};
}

/** The effective config for a chapter: a saved per-device override wins, else the app-wide BUILTIN default. */
export function cfgForChapter(map: Record<string, VoiceCfg>, ch: number | null): VoiceCfg {
  const k = ch != null ? String(ch) : "default";
  return map[k] || map.default || BUILTIN[k] || BUILTIN.default;
}
