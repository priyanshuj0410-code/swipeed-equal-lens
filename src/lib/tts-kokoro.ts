// In-browser neural TTS (Kokoro-82M) via onnxruntime-web — an OPT-IN alternative to the device's Web Speech
// voice (see lib/speak.ts). It gives ONE consistent, warm "Lensy" voice on every device, runs fully on-device
// (no network after the one-time model download, no per-play cost, nothing leaves the device), and is gated so it
// never forces the ~80 MB model on users who didn't ask for it. WebGPU is used when available (fast, ~real-time);
// otherwise it falls back to WASM/CPU (slower to generate — fine for a prototype, but pre-generated clips are the
// production path for low-end devices). The model + voices are American/British English (eSpeak phonemizer a/b) —
// there's no native Indian-English voice, so this is a quality-vs-accent trade to judge by ear.
//
// Everything is lazy + dynamically imported so kokoro-js / transformers never touch the server bundle or the
// initial client bundle; it loads only when the Kokoro voice is actually turned on.

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const DEFAULT_VOICE = "af_heart"; // warm grade-A American-English female; override via ?v=<voice>

type KokoroModel = { generate: (text: string, opts: { voice?: string; speed?: number }) => Promise<{ toBlob: () => Blob }> };

let modelPromise: Promise<KokoroModel | null> | null = null;
let model: KokoroModel | null = null;
let loadFailed = false;
let voice = DEFAULT_VOICE;
let onProgress: ((pct: number) => void) | null = null;

export function setKokoroVoice(v: string) { if (v) voice = v; }
export function onKokoroProgress(cb: (pct: number) => void) { onProgress = cb; }
/** true once the model is loaded and generation can run without a wait for the download. */
export function kokoroReady(): boolean { return !!model; }
export function kokoroFailed(): boolean { return loadFailed; }

async function pickBackend(): Promise<{ device: "webgpu" | "wasm"; dtype: "fp32" | "q8" }> {
  try {
    const gpu = (navigator as unknown as { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
    if (gpu && (await gpu.requestAdapter())) return { device: "webgpu", dtype: "fp32" };
  } catch { /* no webgpu */ }
  return { device: "wasm", dtype: "q8" }; // CPU: q8 keeps the download ~80 MB and generation feasible
}

/** Kick off (idempotent) the one-time model download + init. Resolves to the model, or null if it can't load. */
export function warmKokoro(): Promise<KokoroModel | null> {
  if (model) return Promise.resolve(model);
  if (loadFailed) return Promise.resolve(null);
  if (!modelPromise) {
    modelPromise = (async () => {
      try {
        const { KokoroTTS } = await import("kokoro-js");
        const { device, dtype } = await pickBackend();
        const m = (await KokoroTTS.from_pretrained(MODEL_ID, {
          device, dtype,
          progress_callback: (p: { status?: string; progress?: number }) => {
            if (p?.status === "progress" && typeof p.progress === "number") onProgress?.(Math.round(p.progress));
          },
        })) as unknown as KokoroModel;
        model = m;
        onProgress?.(100);
        return m;
      } catch (e) {
        loadFailed = true;
        console.warn("[kokoro] failed to load — falling back to the device voice.", e);
        return null;
      }
    })();
  }
  return modelPromise;
}

// One playback at a time; generated clips are cached by text so repeats (and replay) are instant.
let currentAudio: HTMLAudioElement | null = null;
const cache = new Map<string, string>(); // text -> object URL

export function kokoroStop() {
  if (currentAudio) {
    currentAudio.onended = null; currentAudio.onerror = null;
    try { currentAudio.pause(); } catch { /* ignore */ }
    currentAudio = null;
  }
}

/**
 * Speak `text` with Kokoro. Returns true if it actually played (or will), false if it couldn't (caller should
 * then fall back to the device voice). `isCurrent` lets a stale line (superseded before generation finished)
 * cancel itself. `onEnd` fires when playback finishes (or immediately if cancelled/failed).
 */
export async function kokoroSpeak(text: string, opts: { onEnd?: () => void; isCurrent?: () => boolean } = {}): Promise<boolean> {
  const m = model ?? (await warmKokoro());
  if (!m) { opts.onEnd?.(); return false; }
  if (opts.isCurrent && !opts.isCurrent()) { opts.onEnd?.(); return true; } // superseded while the model warmed

  let url = cache.get(text);
  if (!url) {
    try {
      const audio = await m.generate(text, { voice, speed: 1 });
      url = URL.createObjectURL(audio.toBlob());
      cache.set(text, url);
    } catch (e) {
      console.warn("[kokoro] generate failed", e);
      opts.onEnd?.();
      return false;
    }
  }
  if (opts.isCurrent && !opts.isCurrent()) { opts.onEnd?.(); return true; } // a newer line started mid-generation

  kokoroStop();
  const el = new Audio(url);
  currentAudio = el;
  const done = () => { if (currentAudio === el) currentAudio = null; opts.onEnd?.(); };
  el.onended = done;
  el.onerror = done;
  el.play().catch(() => done()); // autoplay blocked etc. → don't hang the pacing
  return true;
}
