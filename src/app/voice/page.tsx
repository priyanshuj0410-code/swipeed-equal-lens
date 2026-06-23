"use client";

// Voice lab — audition + tune the narration voice live, then save it for the games. Two engines: the device's
// Web Speech voices (pick a specific voice + rate/pitch) and the in-browser neural Kokoro voices (pick a voice +
// speed; first preview triggers the one-time ~80 MB download). "Save" writes the localStorage prefs that
// lib/speak.ts reads, so whatever you pick here is what every lesson and capstone will speak.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Square, Check, Loader2 } from "lucide-react";
import { applyVoicePrefs, stopSpeaking } from "@/lib/speak";
import { KOKORO_VOICES, kokoroSpeak, kokoroStop, onKokoroProgress, kokoroReady, kokoroFailed } from "@/lib/tts-kokoro";

const SAMPLES = [
  "Hey, I’m Lensy. Let’s play and learn together!",
  "Knowing your status is power, not shame. Testing is self-care.",
  "Consent is a free, enthusiastic yes from both — every time, and you can change your mind.",
  "You did it! That’s the strong, brave choice.",
  "If anything ever feels wrong, it’s not your fault. You can always get help — call Childline ten ninety-eight.",
];

function pickDefaultVoice(vs: SpeechSynthesisVoice[]): string {
  const by = (re: RegExp) => vs.find((v) => re.test(v.lang) || re.test(v.name));
  return (by(/en[-_]IN/i) ?? by(/en[-_]GB/i) ?? by(/en[-_]US/i) ?? by(/^en/i) ?? vs[0])?.voiceURI ?? "";
}

const card = "rounded-2xl border-2 p-4";
const ls = (k: string, d = "") => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between font-semibold text-foreground"><span>{label}</span><span className="tabular-nums text-foreground/60">{value.toFixed(2)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="accent-[var(--color-brand,#553286)]" />
    </label>
  );
}

export default function VoiceLabPage() {
  const [engine, setEngine] = useState<"web" | "kokoro">("web");
  const [sample, setSample] = useState(SAMPLES[0]);

  const [webVoices, setWebVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [webVoiceURI, setWebVoiceURI] = useState("");
  const [rate, setRate] = useState(0.95);
  const [pitch, setPitch] = useState(1.08);

  const [kVoice, setKVoice] = useState("af_heart");
  const [kSpeed, setKSpeed] = useState(1);
  const [kProgress, setKProgress] = useState(0);
  const [kBusy, setKBusy] = useState(false);
  const [kReady, setKReady] = useState(false);

  const [saved, setSaved] = useState(false);
  const initialURI = useRef<string>("");

  const stopAll = useCallback(() => { try { window.speechSynthesis?.cancel(); } catch { /* ignore */ } kokoroStop(); }, []);

  // load saved prefs + the device voice list (voices arrive async → listen for voiceschanged)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration of UI prefs from localStorage */
    setEngine(ls("swipeed.voice") === "kokoro" ? "kokoro" : "web");
    initialURI.current = ls("swipeed.webVoiceURI");
    const r = parseFloat(ls("swipeed.rate")); if (Number.isFinite(r)) setRate(r);
    const p = parseFloat(ls("swipeed.pitch")); if (Number.isFinite(p)) setPitch(p);
    if (ls("swipeed.voiceName")) setKVoice(ls("swipeed.voiceName"));
    const s = parseFloat(ls("swipeed.kokoroSpeed")); if (Number.isFinite(s)) setKSpeed(s);
    /* eslint-enable react-hooks/set-state-in-effect */
    onKokoroProgress((pct) => { setKProgress(pct); if (pct >= 100) setKReady(true); });
    const load = () => {
      const vs = window.speechSynthesis?.getVoices() ?? [];
      if (!vs.length) return;
      setWebVoices(vs);
      setWebVoiceURI((cur) => cur || initialURI.current || pickDefaultVoice(vs));
    };
    load();
    try { window.speechSynthesis?.addEventListener("voiceschanged", load); } catch { /* ignore */ }
    return () => { try { window.speechSynthesis?.removeEventListener("voiceschanged", load); } catch { /* ignore */ } stopAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewWeb = () => {
    const synth = window.speechSynthesis; if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(sample);
    const v = webVoices.find((x) => x.voiceURI === webVoiceURI);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-IN";
    u.rate = rate; u.pitch = pitch;
    synth.speak(u);
  };
  const previewKokoro = async () => {
    setKBusy(true);
    await kokoroSpeak(sample, { voice: kVoice, speed: kSpeed });
    setKReady(kokoroReady());
    setKBusy(false);
  };
  const preview = () => (engine === "web" ? previewWeb() : previewKokoro());

  const save = () => {
    try {
      localStorage.setItem("swipeed.voice", engine);
      if (webVoiceURI) localStorage.setItem("swipeed.webVoiceURI", webVoiceURI);
      localStorage.setItem("swipeed.rate", String(rate));
      localStorage.setItem("swipeed.pitch", String(pitch));
      localStorage.setItem("swipeed.voiceName", kVoice);
      localStorage.setItem("swipeed.kokoroSpeed", String(kSpeed));
    } catch { /* ignore */ }
    stopSpeaking();
    applyVoicePrefs();
    setSaved(true); window.setTimeout(() => setSaved(false), 2500);
  };
  const resetToDefault = () => {
    ["swipeed.voice", "swipeed.webVoiceURI", "swipeed.rate", "swipeed.pitch", "swipeed.voiceName", "swipeed.kokoroSpeed"]
      .forEach((k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
    setEngine("web"); setWebVoiceURI(pickDefaultVoice(webVoices)); setRate(0.95); setPitch(1.08); setKVoice("af_heart"); setKSpeed(1);
    applyVoicePrefs();
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-5 py-6 pb-28 text-foreground">
      <header className="flex items-center gap-3">
        <Link href="/" aria-label="Back" className="grid size-9 place-items-center rounded-full border-2"><ArrowLeft className="size-5" aria-hidden /></Link>
        <h1 className="font-display text-xl font-bold">Voice lab</h1>
      </header>
      <p className="text-sm text-foreground/70">Audition a voice, tune it, and <b>Save</b> — every lesson and capstone will then speak with it. Nothing here changes the games until you save.</p>

      {/* sample line */}
      <section className={card} style={{ borderColor: "var(--color-mist)" }}>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-foreground/55">Sample line</p>
        <textarea value={sample} onChange={(e) => setSample(e.target.value)} rows={2} className="w-full resize-none rounded-xl border-2 bg-transparent p-2.5 text-sm" style={{ borderColor: "var(--color-mist)" }} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SAMPLES.map((s, i) => (
            <button key={i} type="button" onClick={() => setSample(s)} className={`rounded-full border px-2.5 py-1 text-xs ${s === sample ? "bg-[var(--color-mist)] font-bold" : "text-foreground/70"}`}>Line {i + 1}</button>
          ))}
        </div>
      </section>

      {/* engine toggle */}
      <div className="grid grid-cols-2 gap-2">
        {(["web", "kokoro"] as const).map((e) => (
          <button key={e} type="button" onClick={() => { stopAll(); setEngine(e); }} className={`rounded-2xl border-2 px-3 py-3 text-sm font-bold transition-colors ${engine === e ? "bg-[var(--color-sun,#F0C03B)] text-slate-900" : "text-foreground/70"}`} style={{ borderColor: engine === e ? "transparent" : "var(--color-mist)" }}>
            {e === "web" ? "📱 Device voice" : "🧠 Kokoro (neural)"}
          </button>
        ))}
      </div>

      {engine === "web" ? (
        <section className={`${card} flex flex-col gap-3`} style={{ borderColor: "var(--color-mist)" }}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Voice ({webVoices.length} available on this device)</span>
            <select value={webVoiceURI} onChange={(e) => setWebVoiceURI(e.target.value)} className="rounded-xl border-2 bg-transparent p-2.5 text-sm" style={{ borderColor: "var(--color-mist)" }}>
              {[...webVoices].sort((a, b) => Number(/^en/i.test(b.lang)) - Number(/^en/i.test(a.lang)) || a.name.localeCompare(b.name)).map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>{v.name} — {v.lang}{v.localService ? " · offline" : ""}</option>
              ))}
            </select>
          </label>
          <Slider label="Rate (speed)" value={rate} min={0.5} max={1.5} step={0.05} onChange={setRate} />
          <Slider label="Pitch" value={pitch} min={0} max={2} step={0.05} onChange={setPitch} />
          <p className="text-xs text-foreground/55">Tip: device voices vary a lot in quality. On Apple devices the “Siri”/“Enhanced” voices and an Indian-English voice (e.g. “Rishi”/“Veena”) sound far less robotic. “offline” voices work without a network.</p>
        </section>
      ) : (
        <section className={`${card} flex flex-col gap-3`} style={{ borderColor: "var(--color-mist)" }}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Kokoro voice</span>
            <select value={kVoice} onChange={(e) => setKVoice(e.target.value)} className="rounded-xl border-2 bg-transparent p-2.5 text-sm" style={{ borderColor: "var(--color-mist)" }}>
              {KOKORO_VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          <Slider label="Speed" value={kSpeed} min={0.5} max={1.5} step={0.05} onChange={setKSpeed} />
          <p className="text-xs text-foreground/55">
            {kReady ? "✅ Model loaded — generation is on-device." : kokoroFailed() ? "⚠️ Couldn’t load on this device (no WebGPU/WASM?). It falls back to the device voice." : kProgress > 0 ? `Downloading model… ${kProgress}% (one-time, ~80 MB).` : "First preview downloads the model once (~80 MB). US/UK English only — no Indian accent."}
          </p>
        </section>
      )}

      {/* preview / stop */}
      <div className="flex gap-2">
        <button type="button" onClick={preview} disabled={kBusy} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun,#F0C03B)] text-base font-extrabold text-slate-900 transition-transform active:scale-95 disabled:opacity-60">
          {kBusy ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Play className="size-5" aria-hidden />} {kBusy ? "Generating…" : "Play"}
        </button>
        <button type="button" onClick={stopAll} aria-label="Stop" className="grid size-12 place-items-center rounded-2xl border-2" style={{ borderColor: "var(--color-mist)" }}><Square className="size-5" aria-hidden /></button>
      </div>

      {/* save / reset */}
      <div className="flex gap-2">
        <button type="button" onClick={save} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 text-base font-bold transition-transform active:scale-95" style={{ borderColor: "var(--color-ink,#221436)" }}>
          {saved ? <><Check className="size-5" aria-hidden /> Saved!</> : "Use this in the games"}
        </button>
        <button type="button" onClick={resetToDefault} className="h-12 rounded-2xl px-4 text-sm font-semibold text-foreground/60">Reset</button>
      </div>
      <p className="text-center text-xs text-foreground/50">Saved to this device only. The games read your choice the next time Lensy speaks.</p>
    </div>
  );
}
