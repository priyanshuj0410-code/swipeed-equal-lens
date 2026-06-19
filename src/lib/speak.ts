// Lightweight audio narration for the youngest, pre-literate games (audio-first by spec).
// Uses the browser SpeechSynthesis API; silently no-ops where unavailable or before a
// user gesture. Callers gate on their own mute state.

export function speak(text: string, locale = "en-IN") {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    u.rate = 0.95;
    u.pitch = 1.08;
    synth.speak(u);
  } catch {
    /* speech unsupported */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}
