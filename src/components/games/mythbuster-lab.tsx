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
  LAB, LAB_MISS, LAB_UN, LAB_RE, BUSTED, BIOLOGY, BIOLOGY_MISS, DOUBLE, DOUBLE_MISS, TOOLKIT_ASK,
  BADGE_TARGET, SAM, type Scene, type Fact,
} from "@/content/games/mythbuster-lab";

type Mode = "home" | "lab" | "busted" | "biology" | "doubleStd" | "toolkit";
const MODES: [Mode, string, string][] = [
  ["lab", "🔬", "The Myth Lab"],
  ["busted", "💥", "Busted! Gallery"],
  ["biology", "🧬", "It's Just Biology?"],
  ["doubleStd", "🔁", "Double-Standard Detector"],
  ["toolkit", "🧰", "Myth-Buster's Toolkit"],
];

export function MythBusterGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [labIdx, setLabIdx] = useState(0);
  const [labUnRe, setLabUnRe] = useState(false);
  const [bustGot, setBustGot] = useState<Set<number>>(new Set());
  const [bioIdx, setBioIdx] = useState(0);
  const [dblIdx, setDblIdx] = useState(0);
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
    setBadges(new Set()); setLabIdx(0); setLabUnRe(false); setBustGot(new Set()); setBioIdx(0); setDblIdx(0);
    setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "lab") { setLabIdx(0); setLabUnRe(false); say(SAM.lab); }
    else if (m === "busted") say(SAM.busted);
    else if (m === "biology") { setBioIdx(0); say(SAM.biology); }
    else if (m === "doubleStd") { setDblIdx(0); say(SAM.doubleStd); }
    else if (m === "toolkit") say(SAM.toolkit);
    else say(SAM.home);
  };

  const judgeLab = (guessMyth: boolean) => {
    const c = LAB[labIdx];
    if (guessMyth !== c.myth) { say(LAB_MISS); return; }
    celebrate("small");
    if (labIdx + 1 >= LAB.length) say(c.evidence, () => setLabUnRe(true));
    else say(c.evidence, () => setLabIdx((i) => i + 1));
  };

  const tapBust = (i: number) => {
    if (bustGot.has(i)) return;
    const next = new Set(bustGot); next.add(i);
    setBustGot(next); say(BUSTED[i].say); celebrate("small");
    if (next.size >= BUSTED.length) earn("busted");
  };
  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(TOOLKIT_ASK[i].a); celebrate("small");
    if (next.size >= TOOLKIT_ASK.length) earn("toolkit");
  };

  const chooseScene = (scenes: Scene[], idx: number, setIdx: (n: number) => void, miss: string, id: string) => (ok: boolean) => {
    if (!ok) { say(miss); return; }
    celebrate("small");
    say(scenes[idx].result, () => { if (idx + 1 >= scenes.length) { earn(id); go("home"); } else setIdx(idx + 1); });
  };
  const chooseBio = chooseScene(BIOLOGY, bioIdx, setBioIdx, BIOLOGY_MISS, "biology");
  const chooseDbl = chooseScene(DOUBLE, dblIdx, setDblIdx, DOUBLE_MISS, "doubleStd");

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
      <Home className="size-5" aria-hidden /> Lab
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

  if (done) {
    return (
      <GameShell title="MythBuster: Gender" tools={tools} onExit={onExit}>
        <GameDone gameId="mythbuster-lab" stars={3} coins={25} title="Myth-Buster! 💡" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="MythBuster: Gender" tools={tools} onExit={onExit}>
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

        {/* The Myth Lab — judge Myth or Fact, then UN & RE */}
        {mode === "lab" && (
          <>
            {!labUnRe && LAB[labIdx] && (
              <>
                <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
                  <span className="text-5xl" aria-hidden>{LAB[labIdx].emoji}</span>
                  <p className="font-display text-base font-bold text-white">{LAB[labIdx].claim}</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={() => judgeLab(true)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">🚫 Myth</button>
                  <button type="button" onClick={() => judgeLab(false)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">✅ Fact</button>
                </div>
                <p className="text-center text-xs text-white/60">{labIdx + 1} / {LAB.length}</p>
              </>
            )}
            {labUnRe && (
              <>
                <UnReBeat un={LAB_UN} re={LAB_RE} />
                <button type="button" onClick={() => { earn("lab"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Evidence wins</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* Busted! gallery */}
        {mode === "busted" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {BUSTED.map((b, i) => (
                <button key={i} type="button" onClick={() => tapBust(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={bustGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="text-2xl" aria-hidden>{b.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-white">{b.say}</span>
                  {bustGot.has(i) && <Check className="size-5 text-white" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{bustGot.size} / {BUSTED.length}</p>
            {HomeBtn}
          </>
        )}

        {mode === "biology" && BIOLOGY[bioIdx] && (<>{SceneView(BIOLOGY, bioIdx, chooseBio)}{HomeBtn}</>)}
        {mode === "doubleStd" && DOUBLE[dblIdx] && (<>{SceneView(DOUBLE, dblIdx, chooseDbl)}{HomeBtn}</>)}

        {/* Myth-Buster's Toolkit + Ask Anything */}
        {mode === "toolkit" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {TOOLKIT_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>💬</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Bust the myth — not the believer.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
