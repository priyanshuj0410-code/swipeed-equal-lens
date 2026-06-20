"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { ToolMoment } from "@/components/toolkit/tool-moment";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  CYCLE_FACTS, MYTHS, MYTH_UN, MYTH_MISS, PREVENT_BASE, PREVENT_OPEN, PLAN_SCENES, PLAN_RECONSIDER,
  ASK_HELP, BADGE_TARGET, SAM, type Fact, type PlanChoice,
} from "@/content/games/plan-it";

type Mode = "home" | "cycle" | "myths" | "prevent" | "planIt" | "myFuture";
const MODES: [Mode, string, string][] = [
  ["cycle", "🔄", "The Fertility Cycle"],
  ["myths", "💥", "Myths Busted"],
  ["prevent", "🛡️", "Ways to Prevent"],
  ["planIt", "🗺️", "Plan It!"],
  ["myFuture", "🎯", "My Future + Ask"],
];

export function PlanItGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [cycleGot, setCycleGot] = useState<Set<number>>(new Set());
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);
  const [preventGot, setPreventGot] = useState<Set<number>>(new Set());
  const [planIdx, setPlanIdx] = useState(0);
  const [askGot, setAskGot] = useState<Set<number>>(new Set());

  // Contraception basics are added only when School-Comfort is OFF (the fuller setting).
  const preventList: Fact[] = useMemo(() => (profile.schoolComfort ? PREVENT_BASE : [...PREVENT_BASE, ...PREVENT_OPEN]), [profile.schoolComfort]);

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
    setBadges(new Set()); setCycleGot(new Set()); setMIdx(0); setMBusted(false); setPreventGot(new Set());
    setPlanIdx(0); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "cycle") say(SAM.cycle);
    else if (m === "myths") { setMIdx(0); setMBusted(false); say(SAM.myths); }
    else if (m === "prevent") say(SAM.prevent);
    else if (m === "planIt") { setPlanIdx(0); say(SAM.planIt); }
    else if (m === "myFuture") say(SAM.myFuture);
    else say(SAM.home);
  };

  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapCycle = tapList(CYCLE_FACTS, cycleGot, setCycleGot, "cycle");
  const tapPrevent = tapList(preventList, preventGot, setPreventGot, "prevent");

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMyth = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("myths"); go("home"); }
    else { setMBusted(false); setMIdx((i) => i + 1); }
  };

  const choosePlan = (c: PlanChoice) => {
    if (!c.safe) { say(`${c.result} ${PLAN_RECONSIDER}`); return; }
    celebrate("small");
    say(c.result, () => { if (planIdx + 1 >= PLAN_SCENES.length) { earn("planIt"); go("home"); } else setPlanIdx((i) => i + 1); });
  };

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(ASK_HELP[i].a); celebrate("small");
    if (next.size >= ASK_HELP.length) earn("myFuture");
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
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Plan It" tools={tools} onExit={onExit}>
        <GameDone gameId="plan-it" stars={3} coins={25} title="Plan It! 🗓️" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Plan It" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}
        {mode === "planIt" && <ToolMoment tool="decision-steps" line="Big plan? Walk it through with your Decision Steps." />}

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

        {mode === "cycle" && (<>{TapList(CYCLE_FACTS, cycleGot, tapCycle)}<p className="text-center text-xs text-white/60">{cycleGot.size} / {CYCLE_FACTS.length}</p>{HomeBtn}</>)}
        {mode === "prevent" && (<>{TapList(preventList, preventGot, tapPrevent)}<p className="text-center text-xs text-white/60">{preventGot.size} / {preventList.length}</p>{HomeBtn}</>)}

        {/* Myths Busted (UN & RE) */}
        {mode === "myths" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-base font-bold ${mBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTHS[mIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 {mIdx + 1 >= MYTHS.length ? "Last one busted!" : "Next myth"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTHS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-white/60">Myth {mIdx + 1} / {MYTHS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Plan It! — the life-sim */}
        {mode === "planIt" && PLAN_SCENES[planIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{PLAN_SCENES[planIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{PLAN_SCENES[planIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {PLAN_SCENES[planIdx].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => choosePlan(c)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{planIdx + 1} / {PLAN_SCENES.length} · no fear, no shame</p>
            {HomeBtn}
          </>
        )}

        {/* My Future + Ask Anything */}
        {mode === "myFuture" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {ASK_HELP.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#059669"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Private & anonymous — no details kept.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
