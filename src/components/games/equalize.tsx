"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  GAP_FACTS, CHORES, SHIFT_SHARED, SHIFT_BALANCED, EQUALIZE_SCENES, EQ_MISS, LIFTS, BE_CHANGE,
  BADGE_TARGET, SAM, type Fact,
} from "@/content/games/equalize";

type Mode = "home" | "gap" | "secondShift" | "equalize" | "lifts" | "beChange";
const MODES: [Mode, string, string][] = [
  ["gap", "🔍", "The Equality Gap"],
  ["secondShift", "🧺", "The Second Shift"],
  ["equalize", "🟰", "Equalize!"],
  ["lifts", "🎈", "Equality Lifts Everyone"],
  ["beChange", "✊", "Be the Change"],
];

export function EqualizeGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [gapGot, setGapGot] = useState<Set<number>>(new Set());
  const [shared, setShared] = useState<Set<number>>(new Set());
  const [eqIdx, setEqIdx] = useState(0);
  const [liftsBusted, setLiftsBusted] = useState(false);
  const [changeGot, setChangeGot] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setGapGot(new Set()); setShared(new Set()); setEqIdx(0); setLiftsBusted(false);
    setChangeGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "gap") say(SAM.gap);
    else if (m === "secondShift") { setShared(new Set()); say(SAM.secondShift); }
    else if (m === "equalize") { setEqIdx(0); say(SAM.equalize); }
    else if (m === "lifts") { setLiftsBusted(false); say(SAM.lifts); }
    else if (m === "beChange") say(SAM.beChange);
    else say(SAM.home);
  };

  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapGap = tapList(GAP_FACTS, gapGot, setGapGot, "gap");
  const tapChange = tapList(BE_CHANGE, changeGot, setChangeGot, "beChange");

  const shareChore = (i: number) => {
    if (shared.has(i)) return;
    const next = new Set(shared); next.add(i);
    setShared(next); celebrate("small");
    if (next.size >= CHORES.length) say(SHIFT_BALANCED, () => earn("secondShift"));
    else say(SHIFT_SHARED);
  };

  const chooseEq = (ok: boolean) => {
    if (!ok) { say(EQ_MISS); return; }
    celebrate("small");
    say(EQUALIZE_SCENES[eqIdx].fixed, () => { if (eqIdx + 1 >= EQUALIZE_SCENES.length) { earn("equalize"); go("home"); } else setEqIdx((i) => i + 1); });
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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "#eef1f7" }}>{bubble}</span>
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
  const TapList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Equalize" tools={tools} onExit={onExit}>
        <GameDone gameId="equalize" stars={3} coins={25} title="Rebalanced! 🟰" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Equalize" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {mode === "gap" && (<>{TapList(GAP_FACTS, gapGot, tapGap)}<p className="text-center text-xs text-white/60">{gapGot.size} / {GAP_FACTS.length}</p>{HomeBtn}</>)}
        {mode === "beChange" && (<>{TapList(BE_CHANGE, changeGot, tapChange)}<p className="text-center text-xs text-white/60">{changeGot.size} / {BE_CHANGE.length}</p>{HomeBtn}</>)}

        {/* The Second Shift — share each chore */}
        {mode === "secondShift" && (
          <>
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/60">Right now it all falls on her — tap to share</p>
            <div className="grid grid-cols-1 gap-2.5">
              {CHORES.map((c, i) => (
                <button key={i} type="button" onClick={() => shareChore(i)} disabled={shared.has(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={shared.has(i) ? { boxShadow: "inset 0 0 0 2px #22C55E", opacity: 0.85 } : undefined}>
                  <span className="text-2xl" aria-hidden>{c.emoji}</span>
                  <span className="flex-1 text-sm font-bold text-white">{c.task}</span>
                  <span className="text-xs font-semibold text-white/80">{shared.has(i) ? "👥 Shared" : "🙋‍♀️ Her"}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{shared.size} / {CHORES.length} shared</p>
            {HomeBtn}
          </>
        )}

        {/* Equalize! — spot and fix */}
        {mode === "equalize" && EQUALIZE_SCENES[eqIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{EQUALIZE_SCENES[eqIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{EQUALIZE_SCENES[eqIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {EQUALIZE_SCENES[eqIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseEq(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{eqIdx + 1} / {EQUALIZE_SCENES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Equality Lifts Everyone (UN & RE) */}
        {mode === "lifts" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>🥧</span>
              <p className={`font-display text-lg font-bold ${liftsBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={liftsBusted ? undefined : { color: "#ff9085" }}>{LIFTS.myth}</p>
            </div>
            {!liftsBusted ? (
              <button type="button" onClick={() => { setLiftsBusted(true); celebrate("small"); say(LIFTS.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust it with UN &amp; RE</button>
            ) : (
              <>
                <UnReBeat un={LIFTS.un} re={LIFTS.re} />
                <button type="button" onClick={() => { earn("lifts"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Everyone gains!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
