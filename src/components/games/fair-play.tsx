"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, ArrowRight, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { CHORES, CHORE_OPTIONS, CHANCES, CHANCE_OPTIONS, RIGHTS, SWAPS, RULES, BADGE_TARGET, SAM } from "@/content/games/fair-play";

type Mode = "home" | "work" | "chances" | "rights" | "swap" | "rules";
const MODES: [Mode, string, string][] = [
  ["work", "🧹", "Share the Work"],
  ["chances", "🎟️", "Fair Chances"],
  ["rights", "📜", "Rights for Every Child"],
  ["swap", "🔁", "Swap Day"],
  ["rules", "⚖️", "Bust the Rule"],
];

// The Fairness Meter — the star of the game. 0 = lopsided, 100 = balanced.
function FairnessMeter({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const face = v >= 80 ? "😄" : v >= 40 ? "🙂" : "😟";
  const color = v >= 80 ? "#62e08f" : v >= 40 ? "#ffce6a" : "#ff9085";
  return (
    <div className="glass-card flex items-center gap-2 rounded-2xl px-3 py-2 backdrop-blur-[12px] backdrop-saturate-150">
      <span className="text-xl" aria-hidden>⚖️</span>
      <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/15" role="meter" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label="Fairness">
        <span className="absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-500" style={{ width: `${v}%`, background: color }} />
      </span>
      <span className="text-xl" aria-hidden>{face}</span>
    </div>
  );
}

export function FairPlayGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [workIdx, setWorkIdx] = useState(0);
  const [chanceIdx, setChanceIdx] = useState(0);
  const [rightsGot, setRightsGot] = useState<Set<number>>(new Set());
  const [swapIdx, setSwapIdx] = useState(0);
  const [ruleIdx, setRuleIdx] = useState(0);
  const [ruleBusted, setRuleBusted] = useState(false);

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
    setBadges(new Set()); setWorkIdx(0); setChanceIdx(0); setRightsGot(new Set()); setSwapIdx(0); setRuleIdx(0); setRuleBusted(false);
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "work") { setWorkIdx(0); say(SAM.work); }
    else if (m === "chances") { setChanceIdx(0); say(SAM.chances); }
    else if (m === "rights") say(SAM.rights);
    else if (m === "swap") { setSwapIdx(0); say(SAM.swap); }
    else if (m === "rules") { setRuleIdx(0); setRuleBusted(false); say(SAM.rules); }
    else say(SAM.home);
  };

  const assign = (kind: "work" | "chances", fair: boolean, nudge: string) => {
    if (!fair) { say(nudge); return; } // gentle nudge, try again — never a fail
    celebrate("small");
    const idx = kind === "work" ? workIdx : chanceIdx;
    const total = kind === "work" ? CHORES.length : CHANCES.length;
    say(nudge, () => {
      if (idx + 1 >= total) { earn(kind); go("home"); }
      else (kind === "work" ? setWorkIdx : setChanceIdx)((i) => i + 1);
    });
  };

  const tapRight = (i: number) => {
    if (rightsGot.has(i)) return;
    const next = new Set(rightsGot); next.add(i);
    setRightsGot(next);
    say(RIGHTS[i].say); celebrate("small");
    if (next.size >= RIGHTS.length) earn("rights");
  };

  const tapSwap = () => {
    say(SWAPS[swapIdx].say, () => { if (swapIdx + 1 >= SWAPS.length) earn("swap"); else setSwapIdx((i) => i + 1); });
    celebrate("small");
  };

  const bustRule = () => { setRuleBusted(true); celebrate("small"); say(RULES[ruleIdx].re); };
  const nextRule = () => {
    if (ruleIdx + 1 >= RULES.length) { earn("rules"); go("home"); }
    else { setRuleIdx((i) => i + 1); setRuleBusted(false); say(SAM.rules); }
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
      <Home className="size-5" aria-hidden /> World Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "⚪"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Fair Play World" tools={tools} onExit={onExit}>
        <GameDone gameId="fair-play" stars={3} coins={20} title="A Fair World! 🌍" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Fair Play World" tools={tools} onExit={onExit}>
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

        {/* Share the Work */}
        {mode === "work" && CHORES[workIdx] && (
          <>
            <FairnessMeter value={(workIdx / CHORES.length) * 100} />
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{CHORES[workIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{CHORES[workIdx].label}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {CHORE_OPTIONS.map((o) => (
                <button key={o.label} type="button" onClick={() => assign("work", o.fair, o.nudge)} className="glass-card rounded-2xl px-4 py-3 text-left text-base font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.label}</button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Fair Chances */}
        {mode === "chances" && CHANCES[chanceIdx] && (
          <>
            <FairnessMeter value={(chanceIdx / CHANCES.length) * 100} />
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{CHANCES[chanceIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{CHANCES[chanceIdx].label}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {CHANCE_OPTIONS.map((o) => (
                <button key={o.label} type="button" onClick={() => assign("chances", o.fair, o.nudge)} className="glass-card rounded-2xl px-4 py-3 text-left text-base font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.label}</button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Rights for Every Child */}
        {mode === "rights" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {RIGHTS.map((r, i) => (
                <button key={i} type="button" onClick={() => tapRight(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={rightsGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="text-3xl" aria-hidden>{r.emoji}</span>
                  <span className="flex-1 text-base font-semibold text-white">{r.label}</span>
                  {rightsGot.has(i) && <Check className="size-5 text-white" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Rights Cards {rightsGot.size} / {RIGHTS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Swap Day */}
        {mode === "swap" && (
          <>
            <div className="glass-card flex flex-col items-center gap-3 rounded-2xl px-5 py-8 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-6xl animate-in zoom-in" aria-hidden>{SWAPS[swapIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{SWAPS[swapIdx].say}</p>
            </div>
            <button type="button" onClick={tapSwap} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">
              🔁 Swap! <ArrowRight className="size-4" aria-hidden />
            </button>
            <p className="text-center text-xs text-white/60">{swapIdx + 1} / {SWAPS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Bust the Rule (UN & RE) */}
        {mode === "rules" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>⚖️</span>
              <p className={`font-display text-lg font-bold ${ruleBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={ruleBusted ? undefined : { color: "#ff9085" }}>{RULES[ruleIdx].rule}</p>
            </div>
            {!ruleBusted ? (
              <button type="button" onClick={bustRule} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust it with UN &amp; RE</button>
            ) : (
              <>
                <UnReBeat un={RULES[ruleIdx].un} re={RULES[ruleIdx].re} />
                <button type="button" onClick={nextRule} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Next <ArrowRight className="size-4" aria-hidden /></button>
              </>
            )}
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
