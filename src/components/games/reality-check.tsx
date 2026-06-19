"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  REAL_VS_REEL, REEL_MISS, MYTHS, MYTH_UN, MYTH_MISS, LOVE_FACTS, LOVE_SCHOOL_COMFORT_COUNT,
  FAKES, TOOLKIT, BADGE_TARGET, SAM, type Fact,
} from "@/content/games/reality-check";

type Mode = "home" | "realVsReel" | "manipulation" | "love" | "fakes" | "toolkit";
const MODES: [Mode, string, string][] = [
  ["realVsReel", "📱", "Real vs Reel"],
  ["manipulation", "🕵️", "The Manipulation Files"],
  ["love", "🎬", "Love & Sex on Screen"],
  ["fakes", "🤖", "Fakes & Your Rights"],
  ["toolkit", "🧠", "Think for Yourself"],
];

export function RealityCheckGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [reelIdx, setReelIdx] = useState(0);
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);
  const [loveGot, setLoveGot] = useState<Set<number>>(new Set());
  const [fakeGot, setFakeGot] = useState<Set<number>>(new Set());
  const [toolGot, setToolGot] = useState<Set<number>>(new Set());

  // The porn-specific card is hidden in School-Comfort mode.
  const loveList: Fact[] = useMemo(() => (profile.schoolComfort ? LOVE_FACTS.slice(0, LOVE_SCHOOL_COMFORT_COUNT) : LOVE_FACTS), [profile.schoolComfort]);

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
    setBadges(new Set()); setReelIdx(0); setMIdx(0); setMBusted(false); setLoveGot(new Set());
    setFakeGot(new Set()); setToolGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "realVsReel") { setReelIdx(0); say(SAM.realVsReel); }
    else if (m === "manipulation") { setMIdx(0); setMBusted(false); say(SAM.manipulation); }
    else if (m === "love") say(SAM.love);
    else if (m === "fakes") say(SAM.fakes);
    else if (m === "toolkit") say(SAM.toolkit);
    else say(SAM.home);
  };

  const judge = (guessStaged: boolean) => {
    const r = REAL_VS_REEL[reelIdx];
    if (guessStaged !== r.staged) { say(REEL_MISS); return; }
    celebrate("small");
    say(r.why, () => { if (reelIdx + 1 >= REAL_VS_REEL.length) { earn("realVsReel"); go("home"); } else setReelIdx((i) => i + 1); });
  };

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMyth = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("manipulation"); go("home"); }
    else { setMBusted(false); setMIdx((i) => i + 1); }
  };

  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapLove = tapList(loveList, loveGot, setLoveGot, "love");
  const tapFake = tapList(FAKES, fakeGot, setFakeGot, "fakes");
  const tapTool = tapList(TOOLKIT, toolGot, setToolGot, "toolkit");

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
  const TapList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #475569" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Reality Check" tools={tools} onExit={onExit}>
        <GameDone gameId="reality-check" stars={3} coins={25} title="Reality checked! 🔍" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Reality Check" tools={tools} onExit={onExit}>
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

        {/* Real vs Reel — judge real or staged */}
        {mode === "realVsReel" && REAL_VS_REEL[reelIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{REAL_VS_REEL[reelIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{REAL_VS_REEL[reelIdx].claim}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => judge(false)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">📷 Real</button>
              <button type="button" onClick={() => judge(true)} className="glass-card rounded-2xl py-4 text-base font-bold text-white backdrop-blur-[12px] transition-transform active:scale-[0.97]">🎬 Reel</button>
            </div>
            <p className="text-center text-xs text-white/60">{reelIdx + 1} / {REAL_VS_REEL.length}</p>
            {HomeBtn}
          </>
        )}

        {/* The Manipulation Files (UN & RE) */}
        {mode === "manipulation" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-base font-bold ${mBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTHS[mIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">🕵️ {mIdx + 1 >= MYTHS.length ? "Last one busted!" : "Next file"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTHS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-white/60">File {mIdx + 1} / {MYTHS.length}</p>
            {HomeBtn}
          </>
        )}

        {mode === "love" && (<>{profile.schoolComfort && <p className="rounded-xl bg-white/5 px-3 py-2 text-center text-[11px] font-medium text-white/65">School-Comfort mode: the most sensitive part is hidden. A trusted adult or counsellor can answer privately.</p>}{TapList(loveList, loveGot, tapLove)}<p className="text-center text-xs text-white/60">{loveGot.size} / {loveList.length}</p>{HomeBtn}</>)}
        {mode === "fakes" && (<>{TapList(FAKES, fakeGot, tapFake)}<p className="text-center text-xs text-white/60">{fakeGot.size} / {FAKES.length}</p>{HomeBtn}</>)}
        {mode === "toolkit" && (<>{TapList(TOOLKIT, toolGot, tapTool)}<p className="text-center text-xs text-white/60">{toolGot.size} / {TOOLKIT.length}</p>{HomeBtn}</>)}
      </div>
    </GameShell>
  );
}
