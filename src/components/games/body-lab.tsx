"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { useProfile } from "@/lib/store";
import { ORGANS, SENSES, STAGES, YOU_ARE_HERE, BABIES, ALL_BODIES, SKIN_MYTH, SAM } from "@/content/games/body-lab";

type Mode = "home" | "label" | "senses" | "grow" | "babies" | "bodies";
const STATIONS: [Mode, string, string][] = [
  ["label", "🔖", "Label the Body"],
  ["senses", "👀", "Super Senses"],
  ["grow", "📈", "Growing Machine"],
  ["babies", "🍼", "Where Babies Grow"],
  ["bodies", "💛", "All Bodies Are Good"],
];

export function BodyLabGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [labelled, setLabelled] = useState<Set<string>>(new Set());
  const [sensed, setSensed] = useState<Set<string>>(new Set());
  const [stage, setStage] = useState(YOU_ARE_HERE);
  const [mythPopped, setMythPopped] = useState(false);

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earn = useCallback((id: string) => {
    setBadges((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      celebrate("small");
      if (next.size >= STATIONS.length) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1000);
      else say(SAM.badge);
      return next;
    });
  }, [say]);

  const reset = () => {
    setBadges(new Set()); setLabelled(new Set()); setSensed(new Set()); setStage(YOU_ARE_HERE); setMythPopped(false);
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "label") say(SAM.label);
    else if (m === "senses") say(SAM.senses);
    else if (m === "grow") say(SAM.grow);
    else if (m === "babies") say(SAM.babies);
    else if (m === "bodies") { setMythPopped(false); say(SAM.bodies); }
    else say(SAM.home);
  };

  const tapOrgan = (o: typeof ORGANS[number]) => {
    if (labelled.has(o.id)) return;
    const next = new Set(labelled); next.add(o.id);
    setLabelled(next);
    say(`${o.name}. ${o.does}`);
    celebrate("small");
    if (next.size >= ORGANS.length) earn("label");
  };
  const tapSense = (s: typeof SENSES[number]) => {
    if (sensed.has(s.id)) return;
    const next = new Set(sensed); next.add(s.id);
    setSensed(next);
    say(s.say);
    celebrate("small");
    if (next.size >= SENSES.length) earn("senses");
  };
  const popSkinMyth = () => {
    if (mythPopped) return;
    setMythPopped(true);
    celebrate("small");
    say(SKIN_MYTH.re, () => earn("bodies"));
  };

  const muteBtn = (
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );
  const tools = (
    <span className="flex items-center gap-2">
      {!muted && (
        <button type="button" aria-label="Hear it again" onClick={() => replay()} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
          <RotateCcw className="size-4" aria-hidden />
        </button>
      )}
      {muteBtn}
    </span>
  );

  const SamSays = (
    <div className="flex items-center gap-3">
      <Sam size={64} />
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Lab Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${STATIONS.length} badges`}>
      {STATIONS.map(([id, emoji]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40 grayscale"}`} aria-hidden>{badges.has(id) ? "🏅" : emoji}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Body Lab Juniors" tools={tools} onExit={onExit}>
        <GameDone gameId="body-lab" stars={3} coins={20} title="Body Boss! 🧪" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Body Lab Juniors" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {STATIONS.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Label the Body */}
        {mode === "label" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {ORGANS.map((o) => (
                <button key={o.id} type="button" onClick={() => tapOrgan(o)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] transition-transform active:scale-95" style={labelled.has(o.id) ? { boxShadow: "inset 0 0 0 2px #0EA5E9" } : undefined}>
                  <span className={`text-3xl ${labelled.has(o.id) ? "animate-pulse" : ""}`} aria-hidden>{o.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{o.name}</span>
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Super Senses */}
        {mode === "senses" && (
          <>
            <div className="grid grid-cols-5 gap-2">
              {SENSES.map((s) => (
                <button key={s.id} type="button" onClick={() => tapSense(s)} className="glass-card flex items-center justify-center rounded-2xl py-4 text-3xl backdrop-blur-[12px] transition-transform active:scale-95" style={sensed.has(s.id) ? { boxShadow: "inset 0 0 0 2px #0EA5E9" } : undefined} aria-label={s.say}>
                  <span aria-hidden>{s.emoji}</span>
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* The Growing Machine */}
        {mode === "grow" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-7xl transition-all" aria-hidden>{STAGES[stage].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{STAGES[stage].label}</p>
            </div>
            <input type="range" min={0} max={STAGES.length - 1} value={stage} onChange={(e) => { const v = Number(e.target.value); setStage(v); say(STAGES[v].say); }} className="w-full accent-sky-400" aria-label="Growth stage: baby to older grown-up" />
            <button type="button" onClick={() => earn("grow")} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">
              <Check className="size-5" aria-hidden /> I'm growing!
            </button>
            {HomeBtn}
          </>
        )}

        {/* Where Babies Grow (school-comfort gates the depth) */}
        {mode === "babies" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-6xl" aria-hidden>🍼</span>
              <p className="text-sm font-semibold text-foreground">{profile.schoolComfort ? BABIES.simple : BABIES.fuller}</p>
            </div>
            <UnReBeat un={BABIES.un} re={profile.schoolComfort ? BABIES.reSimple : BABIES.reFuller} />
            <button type="button" onClick={() => { say(profile.schoolComfort ? BABIES.reSimple : BABIES.reFuller, () => earn("babies")); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">
              <Check className="size-5" aria-hidden /> Got it!
            </button>
            {HomeBtn}
          </>
        )}

        {/* All Bodies Are Good (+ the colourism myth → UN & RE) */}
        {mode === "bodies" && (
          <>
            <div className="grid grid-cols-1 gap-2">
              {ALL_BODIES.map((c, i) => (
                <button key={i} type="button" onClick={() => { say(c.say); celebrate("small"); }} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]">
                  <span className="text-2xl" aria-hidden>{c.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-foreground">{c.say}</span>
                </button>
              ))}
            </div>
            {!mythPopped ? (
              <button type="button" onClick={popSkinMyth} className="glass-pill mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-90" style={{ color: "#ff9085" }}>
                💬 “{SKIN_MYTH.wrong}” — tap to bust it! 💥
              </button>
            ) : (
              <UnReBeat un={SKIN_MYTH.un} re={SKIN_MYTH.re} />
            )}
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
