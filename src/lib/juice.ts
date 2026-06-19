"use client";

// Game-feel layer for GLRL 2.0 runs: short Web-Audio SFX + haptics + a screenshake/pulse hook.
// Dependency-light (no asset files), and honours prefers-reduced-motion + a mute toggle. Audio is
// lazily created on first use (autoplay policy: the first sound follows a user gesture — a swipe).
type Kind = "green" | "red" | "toxic" | "combo" | "win" | "shatter";

let ctx: AudioContext | null = null;
let muted = false;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function setMuted(v: boolean) {
  muted = v;
  applyMusic();
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
    case "shatter": // a disguised card correctly busted — a crisp, bright burst
      tone([880, 1245, 1760], { type: "triangle", dur: 0.13, stepMs: 45, gain: 0.07 });
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

// ---- ambient music bed: a soft, low pad that intensifies with tension (Clarity falling) and ducks
// out on serious cards. Very quiet, mute-aware, paused when the tab is hidden. Audio is not a motion
// concern, so reduced-motion doesn't silence it — the mute toggle does.
let musicNodes: { osc: OscillatorNode[]; lp: BiquadFilterNode; gain: GainNode } | null = null;
let musicTension = 0;
let musicActive = true;

function applyMusic() {
  if (!musicNodes || !ctx) return;
  const on = !muted && musicActive && !document.hidden;
  const gain = on ? 0.012 + musicTension * 0.038 : 0; // ~0.012 calm → ~0.05 tense
  const cutoff = 300 + musicTension * 700;
  const now = ctx.currentTime;
  musicNodes.gain.gain.setTargetAtTime(gain, now, 0.5);
  musicNodes.lp.frequency.setTargetAtTime(cutoff, now, 0.6);
}

export const music = {
  start() {
    const ac = audio();
    if (!ac || musicNodes) return;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 320;
    const gain = ac.createGain();
    gain.gain.value = 0;
    const o1 = ac.createOscillator(); // root (A2) + a fifth (E3), gently detuned
    const o2 = ac.createOscillator();
    o1.type = "sine"; o1.frequency.value = 110; o1.detune.value = -4;
    o2.type = "sine"; o2.frequency.value = 164.81; o2.detune.value = 5;
    o1.connect(lp); o2.connect(lp); lp.connect(gain); gain.connect(ac.destination);
    o1.start(); o2.start();
    musicNodes = { osc: [o1, o2], lp, gain };
    document.addEventListener("visibilitychange", applyMusic);
    applyMusic();
  },
  setTension(t: number) {
    musicTension = Math.max(0, Math.min(1, t));
    applyMusic();
  },
  setActive(a: boolean) {
    musicActive = a;
    applyMusic();
  },
  stop() {
    if (!musicNodes) return;
    document.removeEventListener("visibilitychange", applyMusic);
    try {
      musicNodes.osc.forEach((o) => o.stop());
    } catch {
      /* already stopped */
    }
    musicNodes = null;
    musicTension = 0;
    musicActive = true;
  },
};
