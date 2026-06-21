"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { EXHIBITS, MYTHS, MYTH_UN, MYTH_MISS, CHECK_MISS, BADGE_TARGET, SAM, type Exhibit } from "@/content/games/amazing-journey";

type Mode = "home" | "exhibit" | "myths";
const STAMP_IDS = [...EXHIBITS.map((e) => e.id), "myths"];

export function AmazingJourneyGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [stamps, setStamps] = useState<Set<string>>(new Set());
  const [exId, setExId] = useState<string>(EXHIBITS[0].id);
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);

  const exhibit: Exhibit = EXHIBITS.find((e) => e.id === exId) ?? EXHIBITS[0];

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earn = useCallback((id: string) => {
    setStamps((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      celebrate("small");
      if (next.size >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1200);
      return next;
    });
  }, [say]);

  const reset = () => { setStamps(new Set()); setMIdx(0); setMBusted(false); setDone(false); setMode("home"); say(SAM.greet); };

  const openExhibit = (id: string) => { setExId(id); setMode("exhibit"); say(SAM.exhibit); };
  const openMyths = () => { setMIdx(0); setMBusted(false); setMode("myths"); say(SAM.myths); };
  const goHome = () => { setMode("home"); say(SAM.home); };

  const answerCheck = (ok: boolean) => {
    if (!ok) { say(CHECK_MISS); return; }
    celebrate("small");
    say(exhibit.stamp, () => { earn(exhibit.id); goHome(); });
  };

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMyth = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("myths"); goHome(); }
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
    <button type="button" onClick={goHome} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Journey map
    </button>
  );
  // The Journey passport — one stamp per stop.
  const Passport = (
    <div className="glass-card flex items-center justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${stamps.size} of ${BADGE_TARGET} passport stamps`}>
      <span className="text-xl" aria-hidden>🛂</span>
      <span className="mx-1 h-5 w-px bg-foreground/25" aria-hidden />
      {STAMP_IDS.map((id) => (
        <span key={id} className={`text-2xl ${stamps.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{stamps.has(id) ? "🟢" : "⚪"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="The Amazing Journey" tools={tools} onExit={onExit}>
        <GameDone gameId="amazing-journey" stars={3} coins={25} title="Journey complete! 🧬" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="The Amazing Journey" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {Passport}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {EXHIBITS.map((e) => (
              <button key={e.id} type="button" onClick={() => openExhibit(e.id)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]" style={stamps.has(e.id) ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
                <span className="text-4xl" aria-hidden>{e.emoji}</span>
                <span className="text-center text-sm font-bold text-foreground">{e.title}</span>
              </button>
            ))}
            <button type="button" onClick={openMyths} className="glass-card col-span-2 flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]" style={stamps.has("myths") ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
              <span className="text-4xl" aria-hidden>👻</span>
              <span className="text-center text-sm font-bold text-foreground">Bust the Baby Myths</span>
            </button>
          </div>
        )}

        {/* An exhibit: explore, then a checkpoint stamps the passport */}
        {mode === "exhibit" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{exhibit.emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{exhibit.title}</p>
              <p className="text-sm font-medium text-foreground/85">{exhibit.explain}</p>
              {exhibit.explainFuller && !profile.schoolComfort && (
                <p className="text-sm font-medium text-foreground/70">{exhibit.explainFuller}</p>
              )}
            </div>
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-foreground/60">Checkpoint: {exhibit.q}</p>
            <div className="grid grid-cols-1 gap-2.5">
              {exhibit.options.map((o, i) => (
                <button key={i} type="button" onClick={() => answerCheck(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Bust the Baby Myths (UN & RE) */}
        {mode === "myths" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className={`text-5xl ${mBusted ? "opacity-30" : "animate-bounce"}`} aria-hidden>{MYTHS[mIdx].emoji}</span>
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-lg font-bold ${mBusted ? "text-foreground/40 line-through" : ""}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
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
      </div>
    </GameShell>
  );
}
