"use client";

// Voice lab — audition + tune the narration voice PER CHAPTER (each of the 8 chapters targets a different
// persona/age band, so each can have its own voice). Pick a chapter, pick the engine (device Web Speech voice or
// neural Kokoro), choose a voice, tune rate/pitch (web) or speed (kokoro), preview against real Lensy lines, then
// Save — which writes the per-chapter prefs (lib/chapters.ts · swipeed.voices) that lib/speak.ts reads, so each
// chapter's games speak in its voice.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Square, Check, Loader2, Copy } from "lucide-react";
import { applyVoicePrefs, stopSpeaking } from "@/lib/speak";
import { CHAPTERS, VOICES_KEY, type VoiceCfg } from "@/lib/chapters";
import { KOKORO_VOICES, kokoroSpeak, kokoroStop, onKokoroProgress, kokoroReady, kokoroFailed } from "@/lib/tts-kokoro";

const SAMPLES = [
  "Hey, I’m Lensy. Let’s play and learn together!",
  "Knowing your status is power, not shame. Testing is self-care.",
  "Consent is a free, enthusiastic yes from both — every time, and you can change your mind.",
  "You did it! That’s the strong, brave choice.",
  "If anything ever feels wrong, it’s not your fault. You can always get help — call Childline ten ninety-eight.",
];

const BASE: VoiceCfg = { engine: "web", rate: 0.95, pitch: 1.08, kokoroVoice: "af_heart", kokoroSpeed: 1 };
const KEYS = ["default", "1", "2", "3", "4", "5", "6", "7", "8"];

function pickDefaultVoice(vs: SpeechSynthesisVoice[]): string {
  const by = (re: RegExp) => vs.find((v) => re.test(v.lang) || re.test(v.name));
  return (by(/en[-_]IN/i) ?? by(/en[-_]GB/i) ?? by(/en[-_]US/i) ?? by(/^en/i) ?? vs[0])?.voiceURI ?? "";
}
const card = "rounded-2xl border-2 p-4";

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between font-semibold text-foreground"><span>{label}</span><span className="tabular-nums text-foreground/60">{value.toFixed(2)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="accent-[var(--color-brand,#553286)]" />
    </label>
  );
}

function chapterLabel(k: string): string {
  if (k === "default") return "Default (everything else)";
  const c = CHAPTERS.find((x) => String(x.ch) === k);
  return c ? `${c.emoji} Ch.${c.ch} · ${c.ages} · ${c.persona}` : `Chapter ${k}`;
}

export default function VoiceLabPage() {
  const [cfgs, setCfgs] = useState<Record<string, VoiceCfg>>(() => Object.fromEntries(KEYS.map((k) => [k, { ...BASE }])));
  const [selCh, setSelCh] = useState("1");
  const [sample, setSample] = useState(SAMPLES[0]);
  const [webVoices, setWebVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [kProgress, setKProgress] = useState(0);
  const [kBusy, setKBusy] = useState(false);
  const [kReady, setKReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const loaded = useRef(false);

  const stopAll = useCallback(() => { try { window.speechSynthesis?.cancel(); } catch { /* ignore */ } kokoroStop(); }, []);

  useEffect(() => {
    // hydrate the working copy from saved prefs (each chapter inherits Default unless it has its own)
    let map: Record<string, VoiceCfg> = {};
    try { const raw = localStorage.getItem(VOICES_KEY); if (raw) map = JSON.parse(raw); } catch { /* ignore */ }
    const def = { ...BASE, ...(map.default ?? {}) };
    const next: Record<string, VoiceCfg> = { default: def };
    for (const k of KEYS) if (k !== "default") next[k] = { ...def, ...(map[k] ?? {}) };
    if (!loaded.current) { loaded.current = true; setCfgs(next); }
    onKokoroProgress((pct) => { setKProgress(pct); if (pct >= 100) setKReady(true); });
    const load = () => {
      const vs = window.speechSynthesis?.getVoices() ?? [];
      if (vs.length) setWebVoices(vs);
    };
    load();
    try { window.speechSynthesis?.addEventListener("voiceschanged", load); } catch { /* ignore */ }
    return () => { try { window.speechSynthesis?.removeEventListener("voiceschanged", load); } catch { /* ignore */ } stopAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cur = cfgs[selCh] ?? BASE;
  const setCfg = (patch: Partial<VoiceCfg>) => setCfgs((prev) => ({ ...prev, [selCh]: { ...prev[selCh], ...patch } }));
  const webURI = cur.webVoiceURI || (webVoices.length ? pickDefaultVoice(webVoices) : "");

  const preview = async () => {
    stopAll();
    if (cur.engine === "web") {
      const synth = window.speechSynthesis; if (!synth) return;
      const u = new SpeechSynthesisUtterance(sample);
      const v = webVoices.find((x) => x.voiceURI === webURI);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-IN";
      u.rate = cur.rate ?? 0.95; u.pitch = cur.pitch ?? 1.08;
      synth.speak(u);
    } else {
      setKBusy(true);
      await kokoroSpeak(sample, { voice: cur.kokoroVoice, speed: cur.kokoroSpeed });
      setKReady(kokoroReady()); setKBusy(false);
    }
  };

  const copyToAll = () => setCfgs((prev) => { const c = prev[selCh]; const n: Record<string, VoiceCfg> = {}; for (const k of KEYS) n[k] = { ...c }; return n; });
  const save = () => { try { localStorage.setItem(VOICES_KEY, JSON.stringify(cfgs)); } catch { /* ignore */ } stopSpeaking(); applyVoicePrefs(); setSaved(true); window.setTimeout(() => setSaved(false), 2500); };
  const resetAll = () => { try { localStorage.removeItem(VOICES_KEY); } catch { /* ignore */ } setCfgs(Object.fromEntries(KEYS.map((k) => [k, { ...BASE }]))); applyVoicePrefs(); };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-5 py-6 pb-28 text-foreground">
      <header className="flex items-center gap-3">
        <Link href="/" aria-label="Back" className="grid size-9 place-items-center rounded-full border-2"><ArrowLeft className="size-5" aria-hidden /></Link>
        <h1 className="font-display text-xl font-bold">Voice lab</h1>
      </header>
      <p className="text-sm text-foreground/70">Each of the 8 chapters targets a different persona — give each its own voice. Pick a chapter, tune it, preview, then <b>Save</b>.</p>

      {/* chapter selector */}
      <section className={card} style={{ borderColor: "var(--color-mist)" }}>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-foreground/55">Chapter / persona</span>
          <select value={selCh} onChange={(e) => { stopAll(); setSelCh(e.target.value); }} className="rounded-xl border-2 bg-transparent p-2.5 text-sm font-semibold" style={{ borderColor: "var(--color-mist)" }}>
            {KEYS.map((k) => <option key={k} value={k}>{chapterLabel(k)}</option>)}
          </select>
        </label>
        <button type="button" onClick={copyToAll} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/60 hover:text-foreground"><Copy className="size-3.5" aria-hidden /> Copy this voice to all chapters</button>
      </section>

      {/* sample line */}
      <section className={card} style={{ borderColor: "var(--color-mist)" }}>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-foreground/55">Sample line</p>
        <textarea value={sample} onChange={(e) => setSample(e.target.value)} rows={2} className="w-full resize-none rounded-xl border-2 bg-transparent p-2.5 text-sm" style={{ borderColor: "var(--color-mist)" }} />
        <div className="mt-2 flex flex-wrap gap-1.5">{SAMPLES.map((s, i) => <button key={i} type="button" onClick={() => setSample(s)} className={`rounded-full border px-2.5 py-1 text-xs ${s === sample ? "bg-[var(--color-mist)] font-bold" : "text-foreground/70"}`}>Line {i + 1}</button>)}</div>
      </section>

      {/* engine toggle (per chapter) */}
      <div className="grid grid-cols-2 gap-2">
        {(["web", "kokoro"] as const).map((e) => (
          <button key={e} type="button" onClick={() => { stopAll(); setCfg({ engine: e }); }} className={`rounded-2xl border-2 px-3 py-3 text-sm font-bold transition-colors ${cur.engine === e ? "bg-[var(--color-sun,#F0C03B)] text-slate-900" : "text-foreground/70"}`} style={{ borderColor: cur.engine === e ? "transparent" : "var(--color-mist)" }}>
            {e === "web" ? "📱 Device voice" : "🧠 Kokoro (neural)"}
          </button>
        ))}
      </div>

      {cur.engine === "web" ? (
        <section className={`${card} flex flex-col gap-3`} style={{ borderColor: "var(--color-mist)" }}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Voice ({webVoices.length} on this device)</span>
            <select value={webURI} onChange={(e) => setCfg({ webVoiceURI: e.target.value })} className="rounded-xl border-2 bg-transparent p-2.5 text-sm" style={{ borderColor: "var(--color-mist)" }}>
              {[...webVoices].sort((a, b) => Number(/^en/i.test(b.lang)) - Number(/^en/i.test(a.lang)) || a.name.localeCompare(b.name)).map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>{v.name} — {v.lang}{v.localService ? " · offline" : ""}</option>
              ))}
            </select>
          </label>
          <Slider label="Rate (speed)" value={cur.rate ?? 0.95} min={0.5} max={1.5} step={0.05} onChange={(n) => setCfg({ rate: n })} />
          <Slider label="Pitch" value={cur.pitch ?? 1.08} min={0} max={2} step={0.05} onChange={(n) => setCfg({ pitch: n })} />
          <p className="text-xs text-foreground/55">Tip: device voices vary a lot. On Apple devices the “Enhanced”/Siri voices and an Indian-English voice (e.g. “Rishi”/“Veena”) sound far less robotic; “Google …” voices in Chrome are good but online. “offline” voices work without a network.</p>
        </section>
      ) : (
        <section className={`${card} flex flex-col gap-3`} style={{ borderColor: "var(--color-mist)" }}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Kokoro voice</span>
            <select value={cur.kokoroVoice ?? "af_heart"} onChange={(e) => setCfg({ kokoroVoice: e.target.value })} className="rounded-xl border-2 bg-transparent p-2.5 text-sm" style={{ borderColor: "var(--color-mist)" }}>
              {KOKORO_VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          <Slider label="Speed" value={cur.kokoroSpeed ?? 1} min={0.5} max={1.5} step={0.05} onChange={(n) => setCfg({ kokoroSpeed: n })} />
          <p className="text-xs text-foreground/55">
            {kReady ? "✅ Model loaded — generation is on-device." : kokoroFailed() ? "⚠️ Couldn’t load on this device. It falls back to the device voice." : kProgress > 0 ? `Downloading model… ${kProgress}% (one-time, ~80 MB).` : "First preview downloads the model once (~80 MB). US/UK English only — no Indian accent."}
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
          {saved ? <><Check className="size-5" aria-hidden /> Saved!</> : "Save all chapters"}
        </button>
        <button type="button" onClick={resetAll} className="h-12 rounded-2xl px-4 text-sm font-semibold text-foreground/60">Reset</button>
      </div>
      <p className="text-center text-xs text-foreground/50">Saved to this device only. Each chapter’s games read its voice the next time Lensy speaks.</p>
    </div>
  );
}
