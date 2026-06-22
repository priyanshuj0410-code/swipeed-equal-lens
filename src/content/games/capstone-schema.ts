// The shared "Capstone format v1" schema — the typed Landing config the rich chapter-graduation runs on
// (build bible · the per-capstone GDD cN · the Landing JSON design source). A capstone is NOT a lesson and
// never a test: it consolidates a chapter's big truths through spaced, VARIED, joyful retrieval (each truth
// re-cued through a different mechanic — the variable-cue boost) and crowns it with a celebration. One shared
// engine (components/games/capstone-rich.tsx) renders all lap types; each capstone ships its own Landing config
// (generated faithfully from its Landing JSON). c1 (My First Friends) is the reference; c2 (Fair & Safe
// Explorer) follows it; c3–c8 are next.

// A "victory lap" — one chapter truth replayed through one mechanic, no score, no fail, ending in `celebrate`.
export type CapGalleryLap = { id: string; from: string; type: "gallery"; frame: string; stickers: string[]; celebrate: string };
export type CapMatchLap = { id: string; from: string; type: "match"; frame: string; pairs: { left: string; right: string }[]; celebrate: string };
export type CapSortLap = { id: string; from: string; type: "sort"; frame: string; items: { id: string; text: string }[]; bins: { id: string; label: string }[]; key: Record<string, string>; celebrate: string };
export type CapBuildLap = { id: string; from: string; type: "build"; frame: string; pieces: string[]; mode: "assemble" | "sequence"; celebrate: string };
// spot — tap the on-theme items (every `trick:true` is a happy/correct answer; there may be several). A
// `trick:false` is a gentle distractor (no fail). `why` is spoken once all on-theme items are found.
export type CapSpotLap = { id: string; from: string; type: "spot"; frame: string; scene: { text: string; trick: boolean }[]; why: string; celebrate: string };
// swipe — cheer it on: a `cue` to celebrate, one happy "swipe up" (`up`) action, then `celebrate`.
export type CapSwipeLap = { id: string; from: string; type: "swipe"; frame: string; cue: string; up: string; celebrate: string };
export type CapLap = CapGalleryLap | CapMatchLap | CapSortLap | CapBuildLap | CapSpotLap | CapSwipeLap;

export type CapRecap = { node: string; game: string; thread: string; bigTruth: string; glyph: string };
export type CapReflect = { id: string; prompt: string; options: string[]; affirm: string };
export type CapCelebration = { glyph: string; certificate: string; stickerBook: string };

export type CapstoneConfig = {
  gameId: string; // === node.game === GameDone key === engine-host registry id (e.g. "capstone-1"). DO NOT RENAME.
  capstone: string; // display name, e.g. "My First Friends"
  node: string; // "c1"
  chapter: number;
  ages: string;
  arrival: string; // Lensy's "you did it!" opener
  canvasPayoff: string; // the chapter canvas blooming/filling in
  threadsRecapped: string[];
  recap: CapRecap[]; // one big truth per chapter game (the sticker-book flags)
  playback: CapLap[]; // the victory laps (lap[0] is the gallery "look back")
  reflect: CapReflect[]; // gentle, non-judged prompts
  celebration: CapCelebration; // certificate + graduation glyph + sticker book
  preview: string; // a peek at the next chapter
  share: string; // a no-surveillance grown-up bridge
  doneTitle: string; // GameDone heading, e.g. "🎓 Chapter One complete!"
  coins?: number;
};

// Each chapter glyph → a celebratory emoji (the sticker faces; colour is never the only cue). Fallback ⭐.
export const GLYPH_EMOJI: Record<string, string> = {
  // Chapter 1
  "feelings-faces": "😊", "body-shield": "🛡️", "family-heart": "💗", "rainbow-friends": "🌈",
  "can-do-star": "🌟", "bubble-clean": "🫧", "friendship-garden-bloom": "🌸",
  // Chapter 2
  "body-lab": "🧪", "unique-me": "🪞", "safety-badge": "🦺", "true-friend": "🤝", "heart-tool": "💗",
  "fair-play-cup": "⚖️", "ally-shield": "🦸", "screen-smart": "📱", "explorer-compass": "🧭",
};
export const glyphEmoji = (g: string): string => GLYPH_EMOJI[g] ?? "⭐";
