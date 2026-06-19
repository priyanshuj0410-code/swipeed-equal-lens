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
  FACT_OR_FILTER, FOF_MISS, FILTER_UN, FILTER_RE, MY_PACE, COMPARISON, SELF_CARE, ASK_HELP,
  BADGE_TARGET, SAM,
} from "@/content/games/body-confident";

type Mode = "home" | "factOrFilter" | "myPace" | "comparison" | "selfCare" | "askHelp";
const MODES: [Mode, string, string][] = [
  ["factOrFilter", "🤳", "Fact or Filter"],
  ["myPace", "⏳", "My Body, My Pace"],
  ["comparison", "📱", "The Comparison Trap"],
  ["selfCare", "🌿", "Self-Care Quests"],
  ["askHelp", "💬", "Ask Anything"],
];

export function BodyConfidentGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [fofIdx, setFofIdx] = useState(0);
  const [fofUnRe, setFofUnRe] = useState(false);
  const [paceGot, setPaceGot] = useState<Set<number>>(new Set());
  const [compGot, setCompGot] = useState<Set<number>>(new Set());
  const [careGot, setCareGot] = useState<Set<number>>(new Set());
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
    setBadges(new Set()); setFofIdx(0); setFofUnRe(false); setPaceGot(new Set()); setCompGot(new Set());
    setCareGot(new Set()); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "factOrFilter") { setFofIdx(0); setFofUnRe(false); say(SAM.factOrFilter); }
    else if (m === "myPace") say(SAM.myPace);
    else if (m === "comparison") say(SAM.comparison);
    else if (m === "selfCare") say(SAM.selfCare);
    else if (m === "askHelp") say(SAM.askHelp);
    else say(SAM.home);
  };

  const judge = (guessFiltered: boolean) => {
    const s = FACT_OR_FILTER[fofIdx];
    if (guessFiltered !== s.filtered) { say(FOF_MISS); return; }
    celebrate("small");
    if (fofIdx + 1 >= FACT_OR_FILTER.length) { say(s.why, () => setFofUnRe(true)); }
    else { say(s.why, () => setFofIdx((i) => i + 1)); }
  };

  const tapList = (arr: { say: string }[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapPace = tapList(MY_PACE, paceGot, setPaceGot, "myPace");
  const tapComp = tapList(COMPARISON, compGot, setCompGot, "comparison");
  const tapCare = tapList(SELF_CARE, careGot, setCareGot, "selfCare");

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(ASK_HELP[i].a); celebrate("small");
    if (next.size >= ASK_HELP.length) earn("askHelp");
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
  const TapList = (items: { emoji: string; say: string }[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #0EA5E9" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Body Confident" tools={tools} onExit={onExit}>
        <GameDone gameId="body-confident" stars={3} coins={25} title="Body Confident! 💪" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Body Confident" tools={tools} onExit={onExit}>
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

        {/* Fact or Filter — judge real vs filtered, then UN & RE */}
        {mode === "factOrFilter" && (
          <>
            {!fofUnRe && FACT_OR_FILTER[fofIdx] && (
              <>
                <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
                  <span className="text-5xl" aria-hidden>{FACT_OR_FILTER[fofIdx].emoji}</span>
                  <p className="font-display text-base font-bold text-white">{FACT_OR_FILTER[fofIdx].claim}</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={() => judge(false)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">📷 Real</button>
                  <button type="button" onClick={() => judge(true)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">✨ Filtered</button>
                </div>
                <p className="text-center text-xs text-white/60">{fofIdx + 1} / {FACT_OR_FILTER.length}</p>
              </>
            )}
            {fofUnRe && (
              <>
                <UnReBeat un={FILTER_UN} re={FILTER_RE} />
                <button type="button" onClick={() => { earn("factOrFilter"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Slide it back to real</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "myPace" && (<>{TapList(MY_PACE, paceGot, tapPace)}<p className="text-center text-xs text-white/60">{paceGot.size} / {MY_PACE.length}</p>{HomeBtn}</>)}
        {mode === "comparison" && (<>{TapList(COMPARISON, compGot, tapComp)}<p className="text-center text-xs text-white/60">{compGot.size} / {COMPARISON.length}</p>{HomeBtn}</>)}
        {mode === "selfCare" && (<>{TapList(SELF_CARE, careGot, tapCare)}<p className="text-center text-xs text-white/60">{careGot.size} / {SELF_CARE.length}</p>{HomeBtn}</>)}

        {/* Ask Anything + Get Help */}
        {mode === "askHelp" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {ASK_HELP.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#0EA5E9"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Private & anonymous — no details kept.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
