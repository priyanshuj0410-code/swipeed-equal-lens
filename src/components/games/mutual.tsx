"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { ToolMoment } from "@/components/toolkit/tool-moment";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  CONSENT_STANDARD, READ_SCENES, READ_MISS, MYTHS, MYTH_UN, MYTH_MISS, MUTUAL_SCENES, MUTUAL_MISS,
  RIGHTS_ASK, BADGE_TARGET, SAM, type Scene,
} from "@/content/games/mutual";

type Mode = "home" | "standard" | "reading" | "pressure" | "mutual" | "rights";
const MODES: [Mode, string, string][] = [
  ["standard", "✅", "What Consent Really Is"],
  ["reading", "👀", "Reading & Respecting"],
  ["pressure", "🚫", "Pressure & Coercion"],
  ["mutual", "🤝", "The Mutual Zone"],
  ["rights", "⚖️", "Your Right, Their Right"],
];

export function MutualGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [stdGot, setStdGot] = useState<Set<number>>(new Set());
  const [readIdx, setReadIdx] = useState(0);
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);
  const [mutIdx, setMutIdx] = useState(0);
  const [askGot, setAskGot] = useState<Set<number>>(new Set());

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
      if (next.size >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1200);
      else say(SAM.badge);
      return next;
    });
  }, [say]);

  const reset = () => {
    setBadges(new Set()); setStdGot(new Set()); setReadIdx(0); setMIdx(0); setMBusted(false); setMutIdx(0);
    setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "standard") say(SAM.standard);
    else if (m === "reading") { setReadIdx(0); say(SAM.reading); }
    else if (m === "pressure") { setMIdx(0); setMBusted(false); say(SAM.pressure); }
    else if (m === "mutual") { setMutIdx(0); say(SAM.mutual); }
    else if (m === "rights") say(SAM.rights);
    else say(SAM.home);
  };

  const tapStd = (i: number) => {
    if (stdGot.has(i)) return;
    const next = new Set(stdGot); next.add(i);
    setStdGot(next); say(CONSENT_STANDARD[i].say); celebrate("small");
    if (next.size >= CONSENT_STANDARD.length) earn("standard");
  };
  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(RIGHTS_ASK[i].a); celebrate("small");
    if (next.size >= RIGHTS_ASK.length) earn("rights");
  };

  // shared scene-chooser for reading & mutual zone
  const chooseScene = (scenes: Scene[], idx: number, setIdx: (n: number) => void, miss: string, id: string) => (ok: boolean) => {
    if (!ok) { say(miss); return; }
    celebrate("small");
    say(scenes[idx].result, () => { if (idx + 1 >= scenes.length) { earn(id); go("home"); } else setIdx(idx + 1); });
  };
  const chooseRead = chooseScene(READ_SCENES, readIdx, setReadIdx, READ_MISS, "reading");
  const chooseMutual = chooseScene(MUTUAL_SCENES, mutIdx, setMutIdx, MUTUAL_MISS, "mutual");

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMyth = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("pressure"); go("home"); }
    else { setMBusted(false); setMIdx((i) => i + 1); }
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
      <Home className="size-5" aria-hidden /> Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const SceneView = (scenes: Scene[], idx: number, onChoose: (ok: boolean) => void) => (
    <>
      <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
        <span className="text-5xl" aria-hidden>{scenes[idx].emoji}</span>
        <p className="font-display text-base font-bold text-foreground">{scenes[idx].situation}</p>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {scenes[idx].options.map((o, i) => (
          <button key={i} type="button" onClick={() => onChoose(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
        ))}
      </div>
      <p className="text-center text-xs text-foreground/60">{idx + 1} / {scenes.length}</p>
    </>
  );

  if (done) {
    return (
      <GameShell title="Mutual" tools={tools} onExit={onExit}>
        <GameDone gameId="mutual" stars={3} coins={30} title="Mutual respect! 💚" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Mutual" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}
        {mode === "pressure" && <ToolMoment tool="cool-down" line="Feeling the pressure? Take a Cool-Down first." />}
        {mode === "mutual" && <ToolMoment tool="talk-it-out" line="Talk-It-Out helps you put a boundary into words." />}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* What Consent Really Is */}
        {mode === "standard" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {CONSENT_STANDARD.map((c, i) => (
                <button key={i} type="button" onClick={() => tapStd(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={stdGot.has(i) ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
                  <span className="text-2xl" aria-hidden>{c.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-foreground">{c.say}</span>
                  {stdGot.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">{stdGot.size} / {CONSENT_STANDARD.length} · a yes, not the absence of no</p>
            {HomeBtn}
          </>
        )}

        {mode === "reading" && READ_SCENES[readIdx] && (<>{SceneView(READ_SCENES, readIdx, chooseRead)}{HomeBtn}</>)}
        {mode === "mutual" && MUTUAL_SCENES[mutIdx] && (<>{SceneView(MUTUAL_SCENES, mutIdx, chooseMutual)}{HomeBtn}</>)}

        {/* Pressure & Coercion (UN & RE) */}
        {mode === "pressure" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-base font-bold ${mBusted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTHS[mIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">💥 {mIdx + 1 >= MYTHS.length ? "Last one busted!" : "Next myth"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTHS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-foreground/60">Myth {mIdx + 1} / {MYTHS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Your Right, Their Right + Ask Anything */}
        {mode === "rights" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {RIGHTS_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#059669"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-foreground"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-foreground/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">Private & anonymous — help is always here.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
