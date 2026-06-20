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
  READ_SCENES, READ_MISS, FIVE_DS, DS_UN, DS_RE, SAFETY_SCENES, SAFETY_MISS, SUPPORT, UPSTANDER_ASK,
  BADGE_TARGET, SAM, type Scene, type Fact,
} from "@/content/games/stand-up";

type Mode = "home" | "read" | "fiveDs" | "safety" | "support" | "upstander";
const MODES: [Mode, string, string][] = [
  ["read", "👁️", "Read the Room"],
  ["fiveDs", "✋", "The 5 Ds"],
  ["safety", "🛟", "Safety First"],
  ["support", "🫂", "Support the Target"],
  ["upstander", "💪", "Be an Upstander"],
];

export function StandUpGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [readIdx, setReadIdx] = useState(0);
  const [dsGot, setDsGot] = useState<Set<number>>(new Set());
  const [dsUnRe, setDsUnRe] = useState(false);
  const [safIdx, setSafIdx] = useState(0);
  const [supGot, setSupGot] = useState<Set<number>>(new Set());
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
    setBadges(new Set()); setReadIdx(0); setDsGot(new Set()); setDsUnRe(false); setSafIdx(0);
    setSupGot(new Set()); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "read") { setReadIdx(0); say(SAM.read); }
    else if (m === "fiveDs") { setDsUnRe(false); say(SAM.fiveDs); }
    else if (m === "safety") { setSafIdx(0); say(SAM.safety); }
    else if (m === "support") say(SAM.support);
    else if (m === "upstander") say(SAM.upstander);
    else say(SAM.home);
  };

  const chooseScene = (scenes: Scene[], idx: number, setIdx: (n: number) => void, miss: string, id: string) => (ok: boolean) => {
    if (!ok) { say(miss); return; }
    celebrate("small");
    say(scenes[idx].result, () => { if (idx + 1 >= scenes.length) { earn(id); go("home"); } else setIdx(idx + 1); });
  };
  const chooseRead = chooseScene(READ_SCENES, readIdx, setReadIdx, READ_MISS, "read");
  const chooseSafety = chooseScene(SAFETY_SCENES, safIdx, setSafIdx, SAFETY_MISS, "safety");

  const tapDs = (i: number) => {
    if (dsGot.has(i)) return;
    const next = new Set(dsGot); next.add(i);
    setDsGot(next); say(FIVE_DS[i].say); celebrate("small");
    if (next.size >= FIVE_DS.length) window.setTimeout(() => setDsUnRe(true), 200);
  };
  const tapSup = (i: number) => {
    if (supGot.has(i)) return;
    const next = new Set(supGot); next.add(i);
    setSupGot(next); say(SUPPORT[i].say); celebrate("small");
    if (next.size >= SUPPORT.length) earn("support");
  };
  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(UPSTANDER_ASK[i].a); celebrate("small");
    if (next.size >= UPSTANDER_ASK.length) earn("upstander");
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
      <GameShell title="Stand Up" tools={tools} onExit={onExit}>
        <GameDone gameId="stand-up" stars={3} coins={25} title="Upstander! 💪" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Stand Up" tools={tools} onExit={onExit}>
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

        {mode === "read" && READ_SCENES[readIdx] && (<>{SceneView(READ_SCENES, readIdx, chooseRead)}{HomeBtn}</>)}
        {mode === "safety" && SAFETY_SCENES[safIdx] && (<>{SceneView(SAFETY_SCENES, safIdx, chooseSafety)}{HomeBtn}</>)}
        {mode === "support" && (<>{TapList(SUPPORT, supGot, tapSup)}<p className="text-center text-xs text-white/60">{supGot.size} / {SUPPORT.length}</p>{HomeBtn}</>)}

        {/* The 5 Ds — collect, then UN & RE */}
        {mode === "fiveDs" && (
          <>
            {!dsUnRe ? (
              <>{TapList(FIVE_DS, dsGot, tapDs)}<p className="text-center text-xs text-white/60">{dsGot.size} / {FIVE_DS.length}</p></>
            ) : (
              <>
                <UnReBeat un={DS_UN} re={DS_RE} />
                <button type="button" onClick={() => { earn("fiveDs"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Pick a safe D</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* Be an Upstander + Ask Anything */}
        {mode === "upstander" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {UPSTANDER_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#7C3AED"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Private & anonymous — safety first, always.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
