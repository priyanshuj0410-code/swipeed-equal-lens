// Audio narration for the games (audio-first by spec). The voice is PER CHAPTER: each of the 8 chapters targets
// a different persona/age band and can have its own voice, set in the /voice lab and stored as one JSON object
// (lib/chapters.ts · `swipeed.voices`). The host (engine-host) calls setNarrationChapter(n) when a game loads, so
// every line speaks in that chapter's voice. Each chapter picks an engine: the device SpeechSynthesis voice (a
// chosen voice + rate/pitch) or the opt-in in-browser neural voice (Kokoro, lib/tts-kokoro.ts — a chosen voice +
// speed). While Kokoro's ~80 MB model downloads, or where it can't run, that chapter falls back to the device
// voice and switches once ready. Other details: strip emoji before speaking (keep digits like "1098"); `onEnd`
// fires when a line finishes (length-based fallback when muted); `replay()` re-speaks the last line;
// `stopSpeaking()` cancels whichever engine is active.

import { kokoroReady, kokoroFailed, kokoroSpeak, kokoroStop, warmKokoro, setKokoroVoice, setKokoroSpeed } from "./tts-kokoro";
import { readVoiceMap, cfgForChapter, type VoiceCfg } from "./chapters";
import { clean, audioKey, audioFolder } from "./audio-key";

const LOCALE = "en-IN";

// — pre-generated clips (option C): if a line was rendered at build time, play that file (one consistent voice,
// instant, offline) instead of the live TTS engine. The manifest (a set of "<folder>/<hash>" keys) is fetched
// once; until it loads, the live engine covers us; any line not in the manifest also falls back. —
let manifest: Set<string> | null = null;
let manifestTried = false;
function ensureManifest() {
  if (manifestTried || typeof window === "undefined") return;
  manifestTried = true;
  fetch("/audio/manifest.json").then((r) => (r.ok ? r.json() : [])).then((arr: string[]) => { manifest = new Set(arr); }).catch(() => { manifest = new Set(); });
}
let clipAudio: HTMLAudioElement | null = null;
function stopClip() {
  if (clipAudio) { clipAudio.onended = null; clipAudio.onerror = null; try { clipAudio.pause(); } catch { /* ignore */ } clipAudio = null; }
}

// Rough spoken length, used as the fallback/safety timing (≈ words × 320ms, clamped).
function fallbackMs(t: string): number {
  return Math.min(7000, Math.max(900, t.split(/\s+/).filter(Boolean).length * 320));
}

// — the chapter currently being played (set by the game host); picks which voice config applies —
let currentChapter: number | null = null;
function activeCfg(): VoiceCfg {
  if (typeof window === "undefined") return { engine: "web" };
  return cfgForChapter(readVoiceMap(), currentChapter);
}
export function setNarrationChapter(ch: number | null) {
  currentChapter = ch;
  const cfg = activeCfg();
  if (cfg.engine === "kokoro") {
    if (cfg.kokoroVoice) setKokoroVoice(cfg.kokoroVoice);
    if (cfg.kokoroSpeed) setKokoroSpeed(cfg.kokoroSpeed);
    warmKokoro(); // start the one-time model download (the device voice covers this chapter until it's ready)
  }
}
/** Re-apply prefs after the /voice lab saves (re-warms Kokoro for the current chapter if needed). */
export function applyVoicePrefs() { setNarrationChapter(currentChapter); }

// — device-voice list (voices load async; refresh on voiceschanged) —
let cachedVoices: SpeechSynthesisVoice[] = [];
function refreshVoices() { try { cachedVoices = window.speechSynthesis?.getVoices() ?? cachedVoices; } catch { /* ignore */ } }
if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  try { window.speechSynthesis.addEventListener("voiceschanged", refreshVoices); } catch { /* ignore */ }
}
// Resolve a device voice for this config: a specific saved voice if it exists here, else the first available
// voice matching the PORTABLE preference list (so a shipped default lands on a good voice on every device),
// else null (browser default).
function pickWebVoice(cfg: VoiceCfg): SpeechSynthesisVoice | null {
  if (!cachedVoices.length) refreshVoices();
  if (cfg.webVoiceURI) {
    const exact = cachedVoices.find((v) => v.voiceURI === cfg.webVoiceURI);
    if (exact) return exact;
  }
  for (const pref of cfg.webVoicePrefer ?? []) {
    const p = pref.toLowerCase();
    const v = cachedVoices.find((x) => x.name.toLowerCase().includes(p) || x.lang.toLowerCase().includes(p));
    if (v) return v;
  }
  return null;
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

  // — Pre-generated clip (if this exact line was rendered for this chapter): play it instantly —
  ensureManifest();
  if (!muted && text && manifest) {
    const key = `${audioFolder(currentChapter)}/${audioKey(text)}`;
    if (manifest.has(key)) {
      stopClip();
      const el = new Audio(`/audio/${key}.mp3`);
      clipAudio = el;
      const done = () => { if (clipAudio === el) clipAudio = null; fire(); };
      el.onended = done;
      el.onerror = done; // manifest is authoritative, but never hang pacing on a missing file
      el.play().catch(done);
      return;
    }
  }

  const cfg = muted ? null : activeCfg();

  // — Kokoro (this chapter chose it): only when ready; otherwise warm it and use the device voice this line —
  if (cfg && text && cfg.engine === "kokoro" && !kokoroFailed()) {
    if (kokoroReady()) {
      kokoroSpeak(text, { voice: cfg.kokoroVoice, speed: cfg.kokoroSpeed, onEnd: fire, isCurrent: () => myGen === gen });
      return;
    }
    warmKokoro();
  }

  // — Web Speech path (also the muted / unavailable fallback) —
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (muted || !synth || !text) {
    if (onEnd) window.setTimeout(fire, fallbackMs(text));
    return;
  }
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    const v = cfg ? pickWebVoice(cfg) : null;
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = cfg?.rate ?? 0.95;
    u.pitch = cfg?.pitch ?? 1.08;
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
  try {
    kokoroStop();
  } catch {
    /* ignore */
  }
  stopClip();
}
