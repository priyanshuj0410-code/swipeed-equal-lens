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
  ALLYSHIP, ALLY_UN, ALLY_RE, EXAMPLE, LIFT_SCENES, LIFT_MISS, CALLIN_SCENES, CALLIN_MISS, STYLE_ASK,
  BADGE_TARGET, SAM, type Scene, type Fact,
} from "@/content/games/lead-the-way";

type Mode = "home" | "allyship" | "example" | "lift" | "callin" | "style";
const MODES: [Mode, string, string][] = [
  ["allyship", "🤝", "What Allyship Is"],
  ["example", "🌟", "Lead by Example"],
  ["lift", "🪜", "Lift as You Climb"],
  ["callin", "💬", "Call In, Not Just Out"],
  ["style", "💼", "Your Leadership Style"],
];

export function LeadTheWayGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [allyGot, setAllyGot] = useState<Set<number>>(new Set());
  const [allyUnRe, setAllyUnRe] = useState(false);
  const [exGot, setExGot] = useState<Set<number>>(new Set());
  const [liftIdx, setLiftIdx] = useState(0);
  const [callIdx, setCallIdx] = useState(0);
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
    setBadges(new Set()); setAllyGot(new Set()); setAllyUnRe(false); setExGot(new Set()); setLiftIdx(0);
    setCallIdx(0); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "allyship") { setAllyUnRe(false); say(SAM.allyship); }
    else if (m === "example") say(SAM.example);
    else if (m === "lift") { setLiftIdx(0); say(SAM.lift); }
    else if (m === "callin") { setCallIdx(0); say(SAM.callin); }
    else if (m === "style") say(SAM.style);
    else say(SAM.home);
  };

  const chooseScene = (scenes: Scene[], idx: number, setIdx: (n: number) => void, miss: string, id: string) => (ok: boolean) => {
    if (!ok) { say(miss); return; }
    celebrate("small");
    say(scenes[idx].result, () => { if (idx + 1 >= scenes.length) { earn(id); go("home"); } else setIdx(idx + 1); });
  };
  const chooseLift = chooseScene(LIFT_SCENES, liftIdx, setLiftIdx, LIFT_MISS, "lift");
  const chooseCall = chooseScene(CALLIN_SCENES, callIdx, setCallIdx, CALLIN_MISS, "callin");

  const tapAlly = (i: number) => {
    if (allyGot.has(i)) return;
    const next = new Set(allyGot); next.add(i);
    setAllyGot(next); say(ALLYSHIP[i].say); celebrate("small");
    if (next.size >= ALLYSHIP.length) window.setTimeout(() => setAllyUnRe(true), 200);
  };
  const tapEx = (i: number) => {
    if (exGot.has(i)) return;
    const next = new Set(exGot); next.add(i);
    setExGot(next); say(EXAMPLE[i].say); celebrate("small");
    if (next.size >= EXAMPLE.length) earn("example");
  };
  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(STYLE_ASK[i].a); celebrate("small");
    if (next.size >= STYLE_ASK.length) earn("style");
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
  const SceneView = (scenes: Scene[], idx: number, onChoose: (ok: boolean) => void) => (
    <>
      <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
        <span className="text-5xl" aria-hidden>{scenes[idx].emoji}</span>
        <p className="font-display text-base font-bold text-white">{scenes[idx].situation}</p>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {scenes[idx].options.map((o, i) => (
          <button key={i} type="button" onClick={() => onChoose(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
        ))}
      </div>
      <p className="text-center text-xs text-white/60">{idx + 1} / {scenes.length}</p>
    </>
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
      <GameShell title="Lead the Way" tools={tools} onExit={onExit}>
        <GameDone gameId="lead-the-way" stars={3} coins={30} title="Quiet leader! 💼" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Lead the Way" tools={tools} onExit={onExit}>
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

        {/* What Allyship Is — collect, then UN & RE */}
        {mode === "allyship" && (
          <>
            {!allyUnRe ? (
              <>{TapList(ALLYSHIP, allyGot, tapAlly)}<p className="text-center text-xs text-white/60">{allyGot.size} / {ALLYSHIP.length}</p></>
            ) : (
              <>
                <UnReBeat un={ALLY_UN} re={ALLY_RE} />
                <button type="button" onClick={() => { earn("allyship"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Allyship is mine too</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "example" && (<>{TapList(EXAMPLE, exGot, tapEx)}<p className="text-center text-xs text-white/60">{exGot.size} / {EXAMPLE.length}</p>{HomeBtn}</>)}
        {mode === "lift" && LIFT_SCENES[liftIdx] && (<>{SceneView(LIFT_SCENES, liftIdx, chooseLift)}{HomeBtn}</>)}
        {mode === "callin" && CALLIN_SCENES[callIdx] && (<>{SceneView(CALLIN_SCENES, callIdx, chooseCall)}{HomeBtn}</>)}

        {/* Your Leadership Style + Ask Anything */}
        {mode === "style" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {STYLE_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>💬</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Find your authentic style.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
