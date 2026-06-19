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
  DEFEND, DEFEND_MISS, STAY_HEALTHY, MYTH_GERMS, MYTH_UN, MYTH_MISS, STIGMA_SCENES, HEALTH_HELPERS,
  BADGE_TARGET, SAM, type StigmaChoice,
} from "@/content/games/defenders";

type Mode = "home" | "defend" | "stayHealthy" | "factPowerUps" | "bustStigma" | "healthHelpers";
const MODES: [Mode, string, string][] = [
  ["defend", "🏰", "Defend the Body"],
  ["stayHealthy", "💪", "Stay Healthy"],
  ["factPowerUps", "⚡", "Fact Power-Ups"],
  ["bustStigma", "💛", "Bust the Stigma"],
  ["healthHelpers", "🧑‍⚕️", "Health Helpers"],
];

export function DefendersGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [waveIdx, setWaveIdx] = useState(0);
  const [healthGot, setHealthGot] = useState<Set<number>>(new Set());
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);
  const [stigmaIdx, setStigmaIdx] = useState(0);
  const [helperGot, setHelperGot] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setWaveIdx(0); setHealthGot(new Set()); setMIdx(0); setMBusted(false);
    setStigmaIdx(0); setHelperGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "defend") { setWaveIdx(0); say(SAM.defend); }
    else if (m === "stayHealthy") say(SAM.stayHealthy);
    else if (m === "factPowerUps") { setMIdx(0); setMBusted(false); say(SAM.factPowerUps); }
    else if (m === "bustStigma") { setStigmaIdx(0); say(SAM.bustStigma); }
    else if (m === "healthHelpers") say(SAM.healthHelpers);
    else say(SAM.home);
  };

  const chooseDefence = (ok: boolean) => {
    if (!ok) { say(DEFEND_MISS); return; }
    celebrate("small");
    say(DEFEND[waveIdx].blocked, () => { if (waveIdx + 1 >= DEFEND.length) { earn("defend"); go("home"); } else setWaveIdx((i) => i + 1); });
  };

  const tapHealth = (i: number) => {
    if (healthGot.has(i)) return;
    const next = new Set(healthGot); next.add(i);
    setHealthGot(next); say(STAY_HEALTHY[i].say); celebrate("small");
    if (next.size >= STAY_HEALTHY.length) earn("stayHealthy");
  };
  const tapHelper = (i: number) => {
    if (helperGot.has(i)) return;
    const next = new Set(helperGot); next.add(i);
    setHelperGot(next); say(HEALTH_HELPERS[i].say); celebrate("small");
    if (next.size >= HEALTH_HELPERS.length) earn("healthHelpers");
  };

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTH_GERMS[mIdx].re);
  };
  const nextGerm = () => {
    if (mIdx + 1 >= MYTH_GERMS.length) { earn("factPowerUps"); go("home"); }
    else { setMBusted(false); setMIdx((i) => i + 1); }
  };

  const chooseStigma = (c: StigmaChoice) => {
    if (!c.care) { say(c.result); return; }
    celebrate("small");
    say(c.result, () => { if (stigmaIdx + 1 >= STIGMA_SCENES.length) { earn("bustStigma"); go("home"); } else setStigmaIdx((i) => i + 1); });
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
      <Home className="size-5" aria-hidden /> Base
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} defender badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: { emoji: string; say: string }[], got: Set<number>, onTap: (i: number) => void) => (
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
      <GameShell title="Defenders of the Body" tools={tools} onExit={onExit}>
        <GameDone gameId="defenders" stars={3} coins={25} title="Body Defender! 💪" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Defenders of the Body" tools={tools} onExit={onExit}>
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

        {/* Defend the Body — pick the good-habit defence */}
        {mode === "defend" && DEFEND[waveIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl animate-bounce" aria-hidden>{DEFEND[waveIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{DEFEND[waveIdx].attack}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {DEFEND[waveIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseDefence(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Wave {waveIdx + 1} / {DEFEND.length}</p>
            {HomeBtn}
          </>
        )}

        {mode === "stayHealthy" && (<>{TapList(STAY_HEALTHY, healthGot, tapHealth)}<p className="text-center text-xs text-white/60">{healthGot.size} / {STAY_HEALTHY.length}</p>{HomeBtn}</>)}
        {mode === "healthHelpers" && (<>{TapList(HEALTH_HELPERS, helperGot, tapHelper)}<p className="text-center text-xs text-white/60">{helperGot.size} / {HEALTH_HELPERS.length}</p>{HomeBtn}</>)}

        {/* Fact Power-Ups — blast the myth-germs (UN & RE) */}
        {mode === "factPowerUps" && MYTH_GERMS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className={`text-5xl ${mBusted ? "opacity-30" : "animate-bounce"}`} aria-hidden>{MYTH_GERMS[mIdx].emoji}</span>
              {MYTH_GERMS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth-Germ</span>}
              <p className={`font-display text-base font-bold ${mBusted ? "text-white/40 line-through" : ""}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTH_GERMS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTH_GERMS[mIdx].re} />
                <button type="button" onClick={nextGerm} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">⚡ {mIdx + 1 >= MYTH_GERMS.length ? "Last one blasted!" : "Next myth-germ"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTH_GERMS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-white/60">Myth-germ {mIdx + 1} / {MYTH_GERMS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Bust the Stigma — care, not fear */}
        {mode === "bustStigma" && STIGMA_SCENES[stigmaIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{STIGMA_SCENES[stigmaIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{STIGMA_SCENES[stigmaIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {STIGMA_SCENES[stigmaIdx].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => chooseStigma(c)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{stigmaIdx + 1} / {STIGMA_SCENES.length} · care, not fear</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
