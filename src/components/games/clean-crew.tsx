"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { WASH_UP, SPARKLE, ROUTINE, ROUTINE_DONE, HEALTHY, I_CAN, BADGE_TARGET, SAM, type Step } from "@/content/games/clean-crew";

type Mode = "home" | "washUp" | "sparkle" | "routine" | "healthy" | "iCan";
const MODES: [Mode, string, string][] = [
  ["washUp", "🫧", "Wash Up!"],
  ["sparkle", "🪥", "Sparkle Smile"],
  ["routine", "☀️", "Daily Routine"],
  ["healthy", "🥗", "Healthy Me"],
  ["iCan", "💪", "I Can Do It!"],
];

export function CleanCrewGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [stickers, setStickers] = useState<Set<string>>(new Set());
  const [washGot, setWashGot] = useState<Set<number>>(new Set());
  const [sparkleGot, setSparkleGot] = useState<Set<number>>(new Set());
  const [routineStep, setRoutineStep] = useState(0);
  const [healthyGot, setHealthyGot] = useState<Set<number>>(new Set());
  const [iCanGot, setICanGot] = useState<Set<number>>(new Set());

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earn = useCallback((id: string) => {
    setStickers((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      celebrate("small");
      if (next.size >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1200);
      else say(SAM.badge);
      return next;
    });
  }, [say]);

  const reset = () => {
    setStickers(new Set()); setWashGot(new Set()); setSparkleGot(new Set()); setRoutineStep(0);
    setHealthyGot(new Set()); setICanGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "washUp") say(SAM.washUp);
    else if (m === "sparkle") say(SAM.sparkle);
    else if (m === "routine") { setRoutineStep(0); say(SAM.routine); }
    else if (m === "healthy") say(SAM.healthy);
    else if (m === "iCan") say(SAM.iCan);
    else say(SAM.home);
  };

  const tapList = (arr: Step[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapWash = tapList(WASH_UP, washGot, setWashGot, "washUp");
  const tapSparkle = tapList(SPARKLE, sparkleGot, setSparkleGot, "sparkle");
  const tapHealthy = tapList(HEALTHY, healthyGot, setHealthyGot, "healthy");
  const tapICan = tapList(I_CAN, iCanGot, setICanGot, "iCan");

  const doRoutineStep = () => {
    celebrate("small");
    if (routineStep + 1 >= ROUTINE.length) say(ROUTINE_DONE, () => earn("routine"));
    else { const next = routineStep + 1; say(`${ROUTINE[next].step}!`); setRoutineStep(next); }
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
  // Sticker chart — one sticker per mode.
  const Stickers = (
    <div className="glass-card flex items-center justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${stickers.size} of ${BADGE_TARGET} stickers`}>
      <span className="text-xl" aria-hidden>📋</span>
      <span className="mx-1 h-5 w-px bg-foreground/25" aria-hidden />
      {MODES.map(([id, emoji]) => (
        <span key={id} className={`text-2xl ${stickers.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{stickers.has(id) ? emoji : "⚪"}</span>
      ))}
    </div>
  );
  const TapList = (items: Step[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #0EA5E9" } : undefined}>
          <span className="text-3xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-base font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Clean Crew" tools={tools} onExit={onExit}>
        <GameDone gameId="clean-crew" stars={3} coins={20} title="Clean Crew star! 🫧" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Clean Crew" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {Stickers}

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

        {mode === "washUp" && (<>{TapList(WASH_UP, washGot, tapWash)}<p className="text-center text-xs text-foreground/60">{washGot.size} / {WASH_UP.length}</p>{HomeBtn}</>)}
        {mode === "sparkle" && (<>{TapList(SPARKLE, sparkleGot, tapSparkle)}<p className="text-center text-xs text-foreground/60">{sparkleGot.size} / {SPARKLE.length}</p>{HomeBtn}</>)}
        {mode === "healthy" && (<>{TapList(HEALTHY, healthyGot, tapHealthy)}<p className="text-center text-xs text-foreground/60">{healthyGot.size} / {HEALTHY.length}</p>{HomeBtn}</>)}
        {mode === "iCan" && (<>{TapList(I_CAN, iCanGot, tapICan)}<p className="text-center text-xs text-foreground/60">{iCanGot.size} / {I_CAN.length}</p>{HomeBtn}</>)}

        {/* Daily Routine — do each step in order */}
        {mode === "routine" && ROUTINE[routineStep] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-8 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/60">Step {routineStep + 1} of {ROUTINE.length}</span>
              <span className="text-6xl" aria-hidden>{ROUTINE[routineStep].emoji}</span>
              <p className="font-display text-xl font-bold text-foreground">{ROUTINE[routineStep].step}</p>
            </div>
            <button type="button" onClick={doRoutineStep} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">✓ Did it!</button>
            <div className="flex justify-center gap-1.5">
              {ROUTINE.map((_, i) => (<span key={i} className={`size-2.5 rounded-full ${i < routineStep ? "bg-foreground" : i === routineStep ? "bg-foreground/70" : "bg-foreground/25"}`} aria-hidden />))}
            </div>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
