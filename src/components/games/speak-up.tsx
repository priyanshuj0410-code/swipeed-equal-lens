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
  SPOT, SPOT_MISS, SAFE, SAFE_MISS, NOT_FAULT, HELP_MAP, STAND_TOGETHER,
  BADGE_TARGET, SAM,
} from "@/content/games/speak-up";

type Mode = "home" | "spot" | "safe" | "notFault" | "helpMap" | "standTogether";
const MODES: [Mode, string, string][] = [
  ["spot", "🔍", "Spot the Harm"],
  ["safe", "🛡️", "The Safe Response"],
  ["notFault", "💛", "It's Not Your Fault"],
  ["helpMap", "🗺️", "The Help Map"],
  ["standTogether", "🤝", "Stand Together"],
];

export function SpeakUpGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [spotIdx, setSpotIdx] = useState(0);
  const [safeIdx, setSafeIdx] = useState(0);
  const [faultBusted, setFaultBusted] = useState(false);
  const [mapGot, setMapGot] = useState<Set<number>>(new Set());
  const [standGot, setStandGot] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setSpotIdx(0); setSafeIdx(0); setFaultBusted(false); setMapGot(new Set()); setStandGot(new Set());
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "spot") { setSpotIdx(0); say(SAM.spot); }
    else if (m === "safe") { setSafeIdx(0); say(SAM.safe); }
    else if (m === "notFault") { setFaultBusted(false); say(SAM.notFault); }
    else if (m === "helpMap") say(SAM.helpMap);
    else if (m === "standTogether") say(SAM.standTogether);
    else say(SAM.home);
  };

  const chooseSpot = (ok: boolean) => {
    if (!ok) { say(SPOT_MISS); return; }
    celebrate("small");
    say(SPOT[spotIdx].why, () => { if (spotIdx + 1 >= SPOT.length) { earn("spot"); go("home"); } else setSpotIdx((i) => i + 1); });
  };

  const chooseSafe = (safe: boolean, kind?: string) => {
    if (!safe) { say(SAFE_MISS); return; }
    celebrate("small");
    say(`Safe response: ${kind}.`, () => { if (safeIdx + 1 >= SAFE.length) { earn("safe"); go("home"); } else setSafeIdx((i) => i + 1); });
  };

  const tapMap = (i: number) => {
    if (mapGot.has(i)) return;
    const next = new Set(mapGot); next.add(i);
    setMapGot(next); say(HELP_MAP[i].say); celebrate("small");
    if (next.size >= HELP_MAP.length) earn("helpMap");
  };
  const tapStand = (i: number) => {
    if (standGot.has(i)) return;
    const next = new Set(standGot); next.add(i);
    setStandGot(next); say(STAND_TOGETHER[i].say); celebrate("small");
    if (next.size >= STAND_TOGETHER.length) earn("standTogether");
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
  const TapList = (items: { emoji: string; say: string }[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Speak Up" tools={tools} onExit={onExit}>
        <GameDone gameId="speak-up" stars={3} coins={25} title="You spoke up! 📣" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Speak Up" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

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

        {/* Spot the Harm */}
        {mode === "spot" && SPOT[spotIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{SPOT[spotIdx].emoji}</span>
              <p className="font-display text-base font-bold text-foreground">{SPOT[spotIdx].scene}</p>
            </div>
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-foreground/60">Is this harm?</p>
            <div className="grid grid-cols-1 gap-2.5">
              {SPOT[spotIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseSpot(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">{spotIdx + 1} / {SPOT.length}</p>
            {HomeBtn}
          </>
        )}

        {/* The Safe Response */}
        {mode === "safe" && SAFE[safeIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{SAFE[safeIdx].emoji}</span>
              <p className="font-display text-base font-bold text-foreground">{SAFE[safeIdx].scene}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {SAFE[safeIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseSafe(o.safe, o.kind)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">{safeIdx + 1} / {SAFE.length}</p>
            {HomeBtn}
          </>
        )}

        {/* It's Not Your Fault (UN & RE) */}
        {mode === "notFault" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>💔</span>
              <p className={`font-display text-base font-bold ${faultBusted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={faultBusted ? undefined : { color: "#ff9085" }}>{NOT_FAULT.myths}</p>
            </div>
            {!faultBusted ? (
              <button type="button" onClick={() => { setFaultBusted(true); celebrate("small"); say(NOT_FAULT.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust them with UN &amp; RE</button>
            ) : (
              <>
                <UnReBeat un={NOT_FAULT.un} re={NOT_FAULT.re} />
                <button type="button" onClick={() => { earn("notFault"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">It's never my fault.</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "helpMap" && (<>{TapList(HELP_MAP, mapGot, tapMap)}<p className="text-center text-xs text-foreground/60">Help Map: {mapGot.size} / {HELP_MAP.length}</p>{HomeBtn}</>)}
        {mode === "standTogether" && (<>{TapList(STAND_TOGETHER, standGot, tapStand)}<p className="text-center text-xs text-foreground/60">{standGot.size} / {STAND_TOGETHER.length}</p>{HomeBtn}</>)}
      </div>
    </GameShell>
  );
}
