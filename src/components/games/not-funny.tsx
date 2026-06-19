"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { SCENES, JOKE, ALLY_STEPS, COMEBACK_KIT, FEEL, STAND_TALL, BADGE_TARGET, SAM, type Choice } from "@/content/games/not-funny";

type Mode = "home" | "scenes" | "joke" | "ally" | "feel" | "standTall";
const MODES: [Mode, string, string][] = [
  ["scenes", "🎬", "Not Fair, Not Funny"],
  ["joke", "💬", "Just a Joke?"],
  ["ally", "🦸", "Be an Ally"],
  ["feel", "💛", "How Would You Feel?"],
  ["standTall", "🌟", "Stand Tall"],
];

export function NotFunnyGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [sceneIdx, setSceneIdx] = useState(0);
  const [jokeBusted, setJokeBusted] = useState(false);
  const [kit, setKit] = useState<Set<number>>(new Set());
  const [feelGot, setFeelGot] = useState<Set<number>>(new Set());
  const [tallGot, setTallGot] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setSceneIdx(0); setJokeBusted(false); setKit(new Set()); setFeelGot(new Set()); setTallGot(new Set());
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "scenes") { setSceneIdx(0); say(SAM.scenes); }
    else if (m === "joke") { setJokeBusted(false); say(SAM.joke); }
    else if (m === "ally") say(SAM.ally);
    else if (m === "feel") say(SAM.feel);
    else if (m === "standTall") say(SAM.standTall);
    else say(SAM.home);
  };

  const chooseScene = (c: Choice) => {
    if (c.ally) {
      celebrate("small");
      say(c.result, () => { if (sceneIdx + 1 >= SCENES.length) { earn("scenes"); go("home"); } else setSceneIdx((i) => i + 1); });
    } else {
      say(c.result); // gentle consequence — try again, never a fail
    }
  };

  const tapKit = (i: number) => {
    if (kit.has(i)) return;
    const next = new Set(kit); next.add(i);
    setKit(next); say(COMEBACK_KIT[i].line); celebrate("small");
    if (next.size >= COMEBACK_KIT.length) earn("ally");
  };
  const tapFeel = (i: number) => {
    if (feelGot.has(i)) return;
    const next = new Set(feelGot); next.add(i);
    setFeelGot(next); say(FEEL[i].say); celebrate("small");
    if (next.size >= FEEL.length) earn("feel");
  };
  const tapTall = (i: number) => {
    if (tallGot.has(i)) return;
    const next = new Set(tallGot); next.add(i);
    setTallGot(next); say(STAND_TALL[i].say); celebrate("small");
    if (next.size >= STAND_TALL.length) earn("standTall");
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
  const TapList = (items: { emoji: string; say?: string; line?: string }[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.line ? `“${it.line}”` : it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Not Fair, Not Funny" tools={tools} onExit={onExit}>
        <GameDone gameId="not-funny" stars={3} coins={20} title="An Ally! 🦸" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Not Fair, Not Funny" tools={tools} onExit={onExit}>
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

        {/* Not Fair, Not Funny — teasing scene */}
        {mode === "scenes" && SCENES[sceneIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{SCENES[sceneIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{SCENES[sceneIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {SCENES[sceneIdx].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => chooseScene(c)} className="glass-card rounded-2xl px-4 py-3 text-left text-base font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Scene {sceneIdx + 1} / {SCENES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Just a Joke? (UN & RE) */}
        {mode === "joke" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>💬</span>
              <p className={`font-display text-lg font-bold ${jokeBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={jokeBusted ? undefined : { color: "#ff9085" }}>{JOKE.deflection}</p>
            </div>
            {!jokeBusted ? (
              <button type="button" onClick={() => { setJokeBusted(true); celebrate("small"); say(JOKE.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust it with UN &amp; RE</button>
            ) : (
              <>
                <UnReBeat un={JOKE.un} re={JOKE.re} />
                <button type="button" onClick={() => { earn("joke"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* Be an Ally — the three-step + Comeback Kit */}
        {mode === "ally" && (
          <>
            <div className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 backdrop-blur-[12px] backdrop-saturate-150">
              {ALLY_STEPS.map((s, i) => (
                <p key={i} className="flex items-center gap-2 text-sm font-semibold text-white"><span className="text-lg" aria-hidden>{s.emoji}</span> {i + 1}. {s.label}</p>
              ))}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/65">Your Comeback Kit — tap each phrase</p>
            {TapList(COMEBACK_KIT, kit, tapKit)}
            <p className="text-center text-xs text-white/60">{kit.size} / {COMEBACK_KIT.length}</p>
            {HomeBtn}
          </>
        )}

        {/* How Would You Feel? */}
        {mode === "feel" && (<>{TapList(FEEL, feelGot, tapFeel)}{HomeBtn}</>)}

        {/* Stand Tall */}
        {mode === "standTall" && (<>{TapList(STAND_TALL, tallGot, tapTall)}{HomeBtn}</>)}
      </div>
    </GameShell>
  );
}
