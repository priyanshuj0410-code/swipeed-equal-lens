"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check, ShieldCheck } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  WHOS_THERE, SHARE_BASE, SHARE_OPEN, NOT_YOUR_FAULT, SEXTORTION_INTRO, SEXTORTION_PLAN,
  SEXTORTION_DONE, MYTHS, LOCK_DOWN, BADGE_TARGET, SAM, type Step,
} from "@/content/games/firewall";

type Mode = "home" | "whos" | "share" | "sextortion" | "myths" | "lock";
const MODES: [Mode, string, string][] = [
  ["whos", "🕵️", "Who's Really There?"],
  ["share", "📤", "Think Before You Share"],
  ["sextortion", "🛑", "Sextortion: Don't Panic"],
  ["myths", "💭", "Online Myths Busted"],
  ["lock", "🔒", "Lock It Down"],
];

export function FirewallGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [whosGot, setWhosGot] = useState<Set<number>>(new Set());
  const [shareGot, setShareGot] = useState<Set<number>>(new Set());
  const [lockGot, setLockGot] = useState<Set<number>>(new Set());
  const [planStep, setPlanStep] = useState(0);
  const [mythIdx, setMythIdx] = useState(0);
  const [busted, setBusted] = useState(false);

  // School-Comfort sets how directly sexting is named: BASE always; the explicit OPEN line only when OFF.
  const shareList: Step[] = useMemo(
    () => (profile.schoolComfort ? SHARE_BASE : [...SHARE_BASE, ...SHARE_OPEN]),
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
    setBadges(new Set()); setWhosGot(new Set()); setShareGot(new Set()); setLockGot(new Set());
    setPlanStep(0); setMythIdx(0); setBusted(false); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "whos") say(SAM.whos);
    else if (m === "share") say(SAM.share);
    else if (m === "sextortion") { setPlanStep(0); say(SEXTORTION_INTRO); }
    else if (m === "myths") { setMythIdx(0); setBusted(false); say(SAM.myths); }
    else if (m === "lock") say(SAM.lock);
    else say(SAM.home);
  };

  const tapList = (arr: Step[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapWhos = tapList(WHOS_THERE, whosGot, setWhosGot, "whos");
  const tapShare = tapList(shareList, shareGot, setShareGot, "share");
  const tapLock = tapList(LOCK_DOWN, lockGot, setLockGot, "lock");

  const doPlanStep = () => {
    celebrate("small");
    if (planStep + 1 >= SEXTORTION_PLAN.length) say(SEXTORTION_DONE, () => earn("sextortion"));
    else { const next = planStep + 1; say(SEXTORTION_PLAN[next].step); setPlanStep(next); }
  };

  const bustMyth = () => { setBusted(true); celebrate("small"); say(MYTHS[mythIdx].re); };
  const nextMyth = () => {
    if (mythIdx + 1 >= MYTHS.length) { earn("myths"); go("home"); }
    else { setMythIdx((i) => i + 1); setBusted(false); }
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
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} skills`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🛡️" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: Step[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #DC2626" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Firewall" tools={tools} onExit={onExit}>
        <GameDone gameId="firewall" stars={3} coins={30} title="Firewall up 🧱" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Firewall" tools={tools} onExit={onExit}>
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

        {mode === "whos" && (<>{TapList(WHOS_THERE, whosGot, tapWhos)}<p className="text-center text-xs text-white/60">{whosGot.size} / {WHOS_THERE.length} · most people are genuine — spot the few who aren't</p>{HomeBtn}</>)}
        {mode === "share" && (<>{TapList(shareList, shareGot, tapShare)}<p className="text-center text-xs text-white/60">{shareGot.size} / {shareList.length} · what goes online can't be taken back</p>{HomeBtn}</>)}
        {mode === "lock" && (<>{TapList(LOCK_DOWN, lockGot, tapLock)}<p className="text-center text-xs text-white/60">{lockGot.size} / {LOCK_DOWN.length} · set it up before you ever need it</p>{HomeBtn}</>)}

        {/* Sextortion: Don't Panic — rehearse the calm, no-blame plan, step by step */}
        {mode === "sextortion" && SEXTORTION_PLAN[planStep] && (
          <>
            <div className="glass-pill flex items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-md" style={{ color: "#eef1f7", boxShadow: "inset 0 0 0 1.5px rgba(98,224,143,0.5)" }}>
              <ShieldCheck className="size-5 shrink-0" style={{ color: "#62e08f" }} aria-hidden />
              <span className="text-sm font-bold">{NOT_YOUR_FAULT}</span>
            </div>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-7 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-xs font-bold uppercase tracking-wide text-white/60">Step {planStep + 1} of {SEXTORTION_PLAN.length}</span>
              <span className="text-5xl" aria-hidden>{SEXTORTION_PLAN[planStep].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{SEXTORTION_PLAN[planStep].step}</p>
            </div>
            <button type="button" onClick={doPlanStep} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-bold text-slate-900 transition-transform active:scale-95">✓ Got it</button>
            <div className="flex justify-center gap-1.5">
              {SEXTORTION_PLAN.map((_, i) => (<span key={i} className={`size-2.5 rounded-full ${i < planStep ? "bg-white" : i === planStep ? "bg-white/70" : "bg-white/25"}`} aria-hidden />))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Online Myths Busted — the UN & RE beat */}
        {mode === "myths" && MYTHS[mythIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>💭</span>
              <p className={`font-display text-lg font-bold ${busted ? "text-white/40 line-through" : "animate-pulse"}`} style={busted ? undefined : { color: "#ff9085" }}>“{MYTHS[mythIdx].un}”</p>
            </div>
            {!busted ? (
              <button type="button" onClick={bustMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">🧽 Bust this myth</button>
            ) : (
              <>
                <UnReBeat un={MYTHS[mythIdx].un} re={MYTHS[mythIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">{mythIdx + 1 >= MYTHS.length ? "Done" : "Next myth"}</button>
              </>
            )}
            <p className="text-center text-xs text-white/60">{mythIdx + 1} / {MYTHS.length} · no shame for ever believing one</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
