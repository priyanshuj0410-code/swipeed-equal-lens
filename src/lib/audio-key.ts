// Shared text-cleaning + stable hashing for PRE-GENERATED narration clips (option C). The generator
// (scripts/gen-audio.mts) and the player (lib/speak.ts) MUST agree on these byte-for-byte so a line maps to the
// same clip file. Keep this the single source of truth — both import it.

// Strip emoji / pictographs / modifiers (so "😄" isn't read aloud), collapse whitespace; keep digits ("1098").
export function clean(text: string): string {
  return text
    .replace(/[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Two 32-bit FNV-1a passes (different seed/salt) → 16 hex chars ≈ 64-bit. Stable, dependency-free, no BigInt
// (the tsconfig target predates BigInt literals), identical in Node + browser.
function fnv32(s: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
export function audioKey(text: string): string {
  const s = clean(text);
  const a = fnv32(s, 0x811c9dc5);
  const b = fnv32("~" + s, 0x9e3779b1); // independent second pass (different seed + salt prefix)
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}

// The clip folder for a chapter (per-chapter voice → per-chapter folder). null → "def" (path/menus).
export function audioFolder(chapter: number | null): string {
  return chapter != null ? `ch${chapter}` : "def";
}
