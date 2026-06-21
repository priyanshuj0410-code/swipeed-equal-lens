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
  CAUSES, CAUSE_UN, CAUSE_RE, PLAN, MOVEMENT, MOVEMENT_DONE, STICK, LAUNCH_ASK,
  BADGE_TARGET, SAM, type Fact,
} from "@/content/games/change-makers";

type Mode = "home" | "cause" | "plan" | "movement" | "stick" | "launch";
const MODES: [Mode, string, string][] = [
  ["cause", "💗", "Find Your Cause"],
  ["plan", "📋", "The Plan"],
  ["movement", "📣", "Build the Movement"],
  ["stick", "📊", "Make It Stick"],
  ["launch", "🚀", "Launch It"],
];

export function ChangeMakersGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [causePick, setCausePick] = useState<number | null>(null);
  const [causeUnRe, setCauseUnRe] = useState(false);
  const [planGot, setPlanGot] = useState<Set<number>>(new Set());
  const [deployed, setDeployed] = useState<Set<number>>(new Set());
  const [stickGot, setStickGot] = useState<Set<number>>(new Set());
  const [askGot, setAskGot] = useState<Set<number>>(new Set());

  const momentum = Math.min(100, deployed.size * Math.ceil(100 / MOVEMENT.length));

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
    setBadges(new Set()); setCausePick(null); setCauseUnRe(false); setPlanGot(new Set()); setDeployed(new Set());
    setStickGot(new Set()); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "cause") { setCausePick(null); setCauseUnRe(false); say(SAM.cause); }
    else if (m === "plan") say(SAM.plan);
    else if (m === "movement") { setDeployed(new Set()); say(SAM.movement); }
    else if (m === "stick") say(SAM.stick);
    else if (m === "launch") say(SAM.launch);
    else say(SAM.home);
  };

  const pickCause = (i: number) => {
    setCausePick(i); celebrate("small");
    say(CAUSES[i].sharpen, () => setCauseUnRe(true));
  };

  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapPlan = tapList(PLAN, planGot, setPlanGot, "plan");
  const tapStick = tapList(STICK, stickGot, setStickGot, "stick");

  const deploy = (i: number) => {
    if (deployed.has(i)) return;
    const next = new Set(deployed); next.add(i);
    setDeployed(next); say(MOVEMENT[i].say); celebrate("small");
    if (next.size >= MOVEMENT.length) say(MOVEMENT_DONE, () => earn("movement"));
  };

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(LAUNCH_ASK[i].a); celebrate("small");
    if (next.size >= LAUNCH_ASK.length) earn("launch");
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
  const TapList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
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
      <GameShell title="Change Makers" tools={tools} onExit={onExit}>
        <GameDone gameId="change-makers" stars={3} coins={30} title="Change Maker! 🌍" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Change Makers" tools={tools} onExit={onExit}>
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

        {/* Find Your Cause — pick & sharpen, then UN & RE */}
        {mode === "cause" && (
          <>
            {!causeUnRe ? (
              <>
                <p className="text-center text-xs font-semibold uppercase tracking-wide text-foreground/60">Pick a cause you care about</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {CAUSES.map((c, i) => (
                    <button key={i} type="button" onClick={() => pickCause(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={causePick === i ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                      <span className="text-2xl" aria-hidden>{c.emoji}</span>
                      <span className="flex-1 text-sm font-semibold text-foreground">{c.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <UnReBeat un={CAUSE_UN} re={CAUSE_RE} />
                <button type="button" onClick={() => { earn("cause"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">I can change this</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "plan" && (<>{TapList(PLAN, planGot, tapPlan)}<p className="text-center text-xs text-foreground/60">{planGot.size} / {PLAN.length}</p>{HomeBtn}</>)}
        {mode === "stick" && (<>{TapList(STICK, stickGot, tapStick)}<p className="text-center text-xs text-foreground/60">{stickGot.size} / {STICK.length}</p>{HomeBtn}</>)}

        {/* Build the Movement — deploy to grow Momentum */}
        {mode === "movement" && (
          <>
            <div className="glass-card flex flex-col gap-2 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
              <div className="flex items-center justify-between text-xs font-bold text-foreground/80"><span>📣 Momentum</span><span>{momentum}%</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-foreground/15">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${momentum}%`, background: "linear-gradient(90deg,#a78bfa,#34d399)" }} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {MOVEMENT.map((mv, i) => (
                <button key={i} type="button" onClick={() => deploy(i)} disabled={deployed.has(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={deployed.has(i) ? { boxShadow: "inset 0 0 0 2px #22C55E", opacity: 0.8 } : undefined}>
                  <span className="text-2xl" aria-hidden>{mv.emoji}</span>
                  <span className="flex-1 text-sm font-bold text-foreground">{mv.label}</span>
                  {deployed.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Launch It + Ask Anything */}
        {mode === "launch" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {LAUNCH_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-foreground"><span aria-hidden>💬</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-foreground/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">Start small, start real — one safe step.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
