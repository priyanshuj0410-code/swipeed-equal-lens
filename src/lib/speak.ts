// Audio narration for the youngest, pre-literate games (audio-first by spec). Uses the browser
// SpeechSynthesis API; silently no-ops where unavailable. Two upgrades for the voice model:
//   • strips emoji before speaking, so "😄" isn't read aloud as "smiling face";
//   • `onEnd` fires when narration COMPLETES, so callers can hold a transition until the audio is done
//     (when muted/unavailable, onEnd still fires after a short length-based fallback, so pacing holds).
// `replay()` re-speaks the last line (and keeps any pending transition intact).

const LOCALE = "en-IN";

// Remove emoji / pictographs / skin-tone modifiers / ZWJ / regional indicators / variation selectors.
// Digits (e.g. "1098") are intentionally kept.
function clean(text: string): string {
  return text
    .replace(/[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Rough spoken length, used as the fallback/safety timing (≈ words × 320ms, clamped).
function fallbackMs(t: string): number {
  return Math.min(7000, Math.max(900, t.split(/\s+/).filter(Boolean).length * 320));
}

let gen = 0; // bumps on each new line so a stale utterance's callback can't fire
let lastText = "";
let pendingOnEnd: (() => void) | null = null;

type Opts = { onEnd?: () => void; muted?: boolean; locale?: string };

function run(text: string, opts: Opts) {
  const { onEnd, muted = false, locale = LOCALE } = opts;
  const myGen = ++gen;
  pendingOnEnd = onEnd ?? null;
  const fire = () => {
    if (myGen !== gen) return; // a newer line started; this callback is stale
    const cb = pendingOnEnd;
    pendingOnEnd = null;
    cb?.();
  };
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (muted || !synth || !text) {
    if (onEnd) window.setTimeout(fire, fallbackMs(text));
    return;
  }
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    u.rate = 0.95;
    u.pitch = 1.08;
    u.onend = fire;
    u.onerror = fire;
    window.setTimeout(fire, fallbackMs(text) + 2000); // safety: some browsers don't fire onend reliably
    synth.speak(u);
  } catch {
    if (onEnd) window.setTimeout(fire, fallbackMs(text));
  }
}

export function speak(text: string, opts: Opts = {}) {
  lastText = clean(text);
  run(lastText, opts);
}

/** Re-speak the last line. If a transition was waiting on it, that still fires when this finishes. */
export function replay(opts: Opts = {}) {
  if (!lastText) return;
  run(lastText, { ...opts, onEnd: pendingOnEnd ?? undefined });
}

export function stopSpeaking() {
  gen++; // invalidate any pending callback
  pendingOnEnd = null;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}
