"use client";

// Game-feel layer for GLRL 2.0 runs: short Web-Audio SFX + haptics + a screenshake/pulse hook.
// Dependency-light (no asset files), and honours prefers-reduced-motion + a mute toggle. Audio is
// lazily created on first use (autoplay policy: the first sound follows a user gesture — a swipe).
type Kind = "green" | "red" | "toxic" | "combo" | "win";

let ctx: AudioContext | null = null;
let muted = false;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

function audio(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// a quick plucked tone (or a short two-note motif for combo/win)
function tone(freqs: number[], opts: { type?: OscillatorType; dur?: number; gain?: number; stepMs?: number } = {}) {
  const ac = audio();
  if (!ac) return;
  const { type = "sine", dur = 0.16, gain = 0.06, stepMs = 70 } = opts;
  freqs.forEach((f, i) => {
    const t0 = ac.currentTime + (i * stepMs) / 1000;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  });
}

/** Distinct, pleasant cues per read. `combo` rises in pitch with the streak. */
export function sfx(kind: Kind, combo = 0) {
  switch (kind) {
    case "green":
      tone([660, 880], { type: "triangle", dur: 0.14 });
      break;
    case "red":
      tone([300, 220], { type: "sine", dur: 0.18 });
      break;
    case "toxic": // a genuinely toxic / boss red — heavier
      tone([180, 120], { type: "sawtooth", dur: 0.26, gain: 0.05 });
      break;
    case "combo": // ascending chime, climbs with the combo
      tone([523 + combo * 30, 784 + combo * 30], { type: "triangle", dur: 0.12, stepMs: 60 });
      break;
    case "win":
      tone([523, 659, 784, 1047], { type: "triangle", dur: 0.2, stepMs: 110, gain: 0.07 });
      break;
  }
}

export function haptic(kind: "tap" | "serious" = "tap") {
  try {
    navigator.vibrate?.(kind === "serious" ? [12, 40, 12] : 12);
  } catch {
    /* unsupported */
  }
}

/** Briefly add a shake/pulse class to an element (no-op under reduced-motion). */
export function shake(el: HTMLElement | null, kind: "shake" | "pulse" = "shake") {
  if (!el || reducedMotion()) return;
  const cls = kind === "shake" ? "juice-shake" : "juice-pulse";
  el.classList.remove(cls);
  void el.offsetWidth; // restart the animation
  el.classList.add(cls);
  window.setTimeout(() => el.classList.remove(cls), kind === "shake" ? 360 : 500);
}
