"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { SCREEN_THINGS, PRETEND_UNRE, CHOICES, GERMS, HYGIENE, KIND_SCENES, HABITS, BADGE_TARGET, SAM, type KindChoice } from "@/content/games/smart-screen";

type Mode = "home" | "realPretend" | "goodChoice" | "germBusters" | "beKind" | "habits";
const MODES: [Mode, string, string][] = [
  ["realPretend", "📺", "Real or Pretend?"],
  ["goodChoice", "🤔", "Good Choice"],
  ["germBusters", "🧼", "Germ Busters"],
  ["beKind", "💛", "Be Kind, Not Mean"],
  ["habits", "📱", "Smart Screen Habits"],
];

export function SmartScreenGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [rpIdx, setRpIdx] = useState(0);
  const [rpUnRe, setRpUnRe] = useState(false);
  const [chIdx, setChIdx] = useState(0);
  const [germs, setGerms] = useState(GERMS.length);
  const [coughed, setCoughed] = useState(false);
  const [kindIdx, setKindIdx] = useState(0);
  const [habitGot, setHabitGot] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setRpIdx(0); setRpUnRe(false); setChIdx(0); setGerms(GERMS.length); setCoughed(false);
    setKindIdx(0); setHabitGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "realPretend") { setRpIdx(0); setRpUnRe(false); say(SAM.realPretend); }
    else if (m === "goodChoice") { setChIdx(0); say(SAM.goodChoice); }
    else if (m === "germBusters") { setGerms(GERMS.length); setCoughed(false); say(SAM.germBusters); }
    else if (m === "beKind") { setKindIdx(0); say(SAM.beKind); }
    else if (m === "habits") say(SAM.habits);
    else say(SAM.home);
  };

  // Real or Pretend? — sort, then advance (UN & RE on the fairness-cream ad)
  const sortThing = (guessPretend: boolean) => {
    const t = SCREEN_THINGS[rpIdx];
    if (guessPretend !== t.pretend) { say("Look again — is this real, or just pretend?"); return; }
    celebrate("small");
    if (t.unRe) { setRpUnRe(true); say(PRETEND_UNRE.re); return; }
    say(t.why, () => advanceRp());
  };
  const advanceRp = () => {
    if (rpIdx + 1 >= SCREEN_THINGS.length) { earn("realPretend"); go("home"); }
    else { setRpUnRe(false); setRpIdx((i) => i + 1); }
  };

  // Good Choice — good advances; the other gives a friendly consequence
  const chooseGood = (good: boolean) => {
    const c = CHOICES[chIdx];
    if (!good) { say(c.badResult); return; }
    celebrate("small");
    say(c.goodResult, () => { if (chIdx + 1 >= CHOICES.length) { earn("goodChoice"); go("home"); } else setChIdx((i) => i + 1); });
  };

  // Germ Busters — scrub the germs, then cover the cough
  const scrub = () => {
    setGerms((g) => {
      const next = Math.max(0, g - 1);
      if (next === 0) { celebrate("small"); say("Sparkly clean! Now cover that cough."); }
      return next;
    });
  };
  const coverCough = () => {
    if (coughed) return;
    setCoughed(true); celebrate("small"); say("Covered! That keeps everyone healthy.");
    earn("germBusters");
  };

  // Be Kind, Not Mean
  const chooseKind = (c: KindChoice) => {
    if (!c.kind) { say(c.result); return; }
    celebrate("small");
    say(c.result, () => { if (kindIdx + 1 >= KIND_SCENES.length) { earn("beKind"); go("home"); } else setKindIdx((i) => i + 1); });
  };

  // Smart Screen Habits — tap each
  const tapHabit = (i: number) => {
    if (habitGot.has(i)) return;
    const next = new Set(habitGot); next.add(i);
    setHabitGot(next); say(HABITS[i].say); celebrate("small");
    if (next.size >= HABITS.length) earn("habits");
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
  // Badge Book doubles as the hero cape that "levels up" — a 🦸 leads the medal row.
  const BadgeBook = (
    <div className="glass-card flex items-center justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} hero badges`}>
      <span className={`text-2xl transition-transform ${badges.size > 0 ? "scale-110" : "opacity-50"}`} aria-hidden>🦸</span>
      <span className="mx-1 h-5 w-px bg-white/25" aria-hidden />
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Smart Screen Heroes" tools={tools} onExit={onExit}>
        <GameDone gameId="smart-screen" stars={3} coins={20} title="Smart Screen Hero! 🦸" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Smart Screen Heroes" tools={tools} onExit={onExit}>
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

        {/* Real or Pretend? */}
        {mode === "realPretend" && SCREEN_THINGS[rpIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{SCREEN_THINGS[rpIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{SCREEN_THINGS[rpIdx].label}</p>
            </div>
            {rpUnRe ? (
              <>
                <UnReBeat un={PRETEND_UNRE.un} re={PRETEND_UNRE.re} />
                <button type="button" onClick={advanceRp} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={() => sortThing(false)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">📷 Real</button>
                <button type="button" onClick={() => sortThing(true)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">🎭 Pretend</button>
              </div>
            )}
            <p className="text-center text-xs text-white/60">{rpIdx + 1} / {SCREEN_THINGS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Good Choice */}
        {mode === "goodChoice" && CHOICES[chIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{CHOICES[chIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{CHOICES[chIdx].q}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button type="button" onClick={() => chooseGood(true)} className="glass-card rounded-2xl px-4 py-3 text-base font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{CHOICES[chIdx].good}</button>
              <button type="button" onClick={() => chooseGood(false)} className="glass-card rounded-2xl px-4 py-3 text-base font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{CHOICES[chIdx].bad}</button>
            </div>
            <p className="text-center text-xs text-white/60">{chIdx + 1} / {CHOICES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Germ Busters */}
        {mode === "germBusters" && (
          <>
            <div className="glass-card flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {germs > 0 ? (
                <>
                  <div className="flex flex-wrap justify-center gap-1 text-3xl" aria-hidden>
                    {Array.from({ length: germs }).map((_, i) => <span key={i} className="animate-pulse">🦠</span>)}
                  </div>
                  <p className="text-sm font-semibold text-white/80">{germs} germ{germs === 1 ? "" : "s"} left — keep scrubbing!</p>
                </>
              ) : (
                <p className="font-display text-lg font-bold text-white">✨ Sparkly clean! ✨</p>
              )}
            </div>
            {germs > 0 ? (
              <button type="button" onClick={scrub} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-bold text-slate-900 transition-transform active:scale-95">🧼 Scrub!</button>
            ) : !coughed ? (
              <button type="button" onClick={coverCough} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-bold text-slate-900 transition-transform active:scale-95">🤧 Cover your cough</button>
            ) : (
              <div className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 backdrop-blur-[12px]">
                {HYGIENE.map((h, i) => (
                  <p key={i} className="flex items-center gap-2 text-sm font-semibold text-white"><span className="text-lg" aria-hidden>{h.emoji}</span> {h.say}</p>
                ))}
              </div>
            )}
            {HomeBtn}
          </>
        )}

        {/* Be Kind, Not Mean */}
        {mode === "beKind" && KIND_SCENES[kindIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{KIND_SCENES[kindIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-white">{KIND_SCENES[kindIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {KIND_SCENES[kindIdx].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => chooseKind(c)} className="glass-card rounded-2xl px-4 py-3 text-base font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{kindIdx + 1} / {KIND_SCENES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Smart Screen Habits */}
        {mode === "habits" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {HABITS.map((h, i) => (
                <button key={i} type="button" onClick={() => tapHabit(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={habitGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="text-2xl" aria-hidden>{h.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-white">{h.say}</span>
                  {habitGot.has(i) && <Check className="size-5 text-white" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{habitGot.size} / {HABITS.length}</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
