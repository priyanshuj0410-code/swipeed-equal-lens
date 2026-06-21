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
  FUNNEL, FUNNEL_DONE, MONEY_BASE, MONEY_OPEN, HOOKS, REAL_STRONG, BACKS, BADGE_TARGET, SAM, type Step,
} from "@/content/games/rabbit-hole";

type Mode = "home" | "funnel" | "money" | "hooks" | "realStrong" | "backs";
const MODES: [Mode, string, string][] = [
  ["funnel", "🕳️", "The Funnel"],
  ["money", "💸", "Follow the Money"],
  ["hooks", "🪝", "Spot the Hook"],
  ["realStrong", "💪", "Real Strong"],
  ["backs", "🤝", "Have Each Other's Backs"],
];

export function RabbitHoleGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [funnelStep, setFunnelStep] = useState(0);
  const [moneyGot, setMoneyGot] = useState<Set<number>>(new Set());
  const [strongGot, setStrongGot] = useState<Set<number>>(new Set());
  const [backsGot, setBacksGot] = useState<Set<number>>(new Set());
  const [hookIdx, setHookIdx] = useState(0);
  const [busted, setBusted] = useState(false);

  // School-Comfort sets depth: the blunter "follow the money" line is added only when it's OFF.
  const moneyList: Step[] = useMemo(
    () => (profile.schoolComfort ? MONEY_BASE : [...MONEY_BASE, ...MONEY_OPEN]),
    [profile.schoolComfort],
  );

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
    setBadges(new Set()); setFunnelStep(0); setMoneyGot(new Set()); setStrongGot(new Set());
    setBacksGot(new Set()); setHookIdx(0); setBusted(false); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "funnel") { setFunnelStep(0); say(SAM.funnel); }
    else if (m === "money") say(SAM.money);
    else if (m === "hooks") { setHookIdx(0); setBusted(false); say(SAM.hooks); }
    else if (m === "realStrong") say(SAM.realStrong);
    else if (m === "backs") say(SAM.backs);
    else say(SAM.home);
  };

  const tapList = (arr: Step[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapMoney = tapList(moneyList, moneyGot, setMoneyGot, "money");
  const tapStrong = tapList(REAL_STRONG, strongGot, setStrongGot, "realStrong");
  const tapBacks = tapList(BACKS, backsGot, setBacksGot, "backs");

  const doFunnelStep = () => {
    celebrate("small");
    if (funnelStep + 1 >= FUNNEL.length) say(FUNNEL_DONE, () => earn("funnel"));
    else { const next = funnelStep + 1; say(FUNNEL[next].step); setFunnelStep(next); }
  };

  const bustHook = () => { setBusted(true); celebrate("small"); say(HOOKS[hookIdx].re); };
  const nextHook = () => {
    if (hookIdx + 1 >= HOOKS.length) { earn("hooks"); go("home"); }
    else { setHookIdx((i) => i + 1); setBusted(false); }
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
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "💪" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: Step[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #475569" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="The Rabbit Hole" tools={tools} onExit={onExit}>
        <GameDone gameId="rabbit-hole" stars={3} coins={30} title="Real strength lifts 💪" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="The Rabbit Hole" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}
        {mode === "backs" && <ToolMoment tool="help-map" line="Feeling the loneliness it preys on? Your Help Map is here — you're not alone." />}

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

        {mode === "money" && (<>{TapList(moneyList, moneyGot, tapMoney)}<p className="text-center text-xs text-foreground/60">{moneyGot.size} / {moneyList.length} · follow the incentive</p>{HomeBtn}</>)}
        {mode === "realStrong" && (<>{TapList(REAL_STRONG, strongGot, tapStrong)}<p className="text-center text-xs text-foreground/60">{strongGot.size} / {REAL_STRONG.length} · strength that lifts</p>{HomeBtn}</>)}
        {mode === "backs" && (<>{TapList(BACKS, backsGot, tapBacks)}<p className="text-center text-xs text-foreground/60">{backsGot.size} / {BACKS.length} · this part's for everyone</p>{HomeBtn}</>)}

        {/* The Funnel — trace the escalation, step by step */}
        {mode === "funnel" && FUNNEL[funnelStep] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-8 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/60">Step {funnelStep + 1} of {FUNNEL.length}</span>
              <span className="text-5xl" aria-hidden>{FUNNEL[funnelStep].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{FUNNEL[funnelStep].step}</p>
            </div>
            <button type="button" onClick={doFunnelStep} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">{funnelStep + 1 >= FUNNEL.length ? "I see it" : "Keep going ↓"}</button>
            <div className="flex justify-center gap-1.5">
              {FUNNEL.map((_, i) => (<span key={i} className={`size-2.5 rounded-full ${i < funnelStep ? "bg-foreground" : i === funnelStep ? "bg-foreground/70" : "bg-foreground/25"}`} aria-hidden />))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Spot the Hook — the UN & RE beat */}
        {mode === "hooks" && HOOKS[hookIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>🪝</span>
              <p className={`font-display text-lg font-bold ${busted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={busted ? undefined : { color: "#ff9085" }}>“{HOOKS[hookIdx].un}”</p>
            </div>
            {!busted ? (
              <button type="button" onClick={bustHook} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">🧽 See through it</button>
            ) : (
              <>
                <UnReBeat un={HOOKS[hookIdx].un} re={HOOKS[hookIdx].re} />
                <button type="button" onClick={nextHook} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">{hookIdx + 1 >= HOOKS.length ? "Done" : "Next hook"}</button>
              </>
            )}
            <p className="text-center text-xs text-foreground/60">{hookIdx + 1} / {HOOKS.length} · no shame for ever finding it convincing</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
