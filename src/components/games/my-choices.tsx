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
  PICTURE_BASE, PICTURE_OPEN, PICTURE_UN, PICTURE_RE, IF_WHEN, DECIDE_SCENES, DECIDE_RECONSIDER,
  ACCESS, ASK_HELP, BADGE_TARGET, SAM, type Fact, type DecideChoice,
} from "@/content/games/my-choices";

type Mode = "home" | "picture" | "ifWhen" | "decideIt" | "access" | "myFuture";
const MODES: [Mode, string, string][] = [
  ["picture", "📋", "The Full Picture"],
  ["ifWhen", "🤔", "If, When & Whether"],
  ["decideIt", "🧭", "Decide It"],
  ["access", "🔒", "Access & Rights"],
  ["myFuture", "🎯", "My Future + Ask"],
];

export function MyChoicesGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [picGot, setPicGot] = useState<Set<number>>(new Set());
  const [picUnRe, setPicUnRe] = useState(false);
  const [ifGot, setIfGot] = useState<Set<number>>(new Set());
  const [decIdx, setDecIdx] = useState(0);
  const [accessGot, setAccessGot] = useState<Set<number>>(new Set());
  const [askGot, setAskGot] = useState<Set<number>>(new Set());

  const picList: Fact[] = useMemo(() => (profile.schoolComfort ? PICTURE_BASE : [...PICTURE_BASE, ...PICTURE_OPEN]), [profile.schoolComfort]);

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
    setBadges(new Set()); setPicGot(new Set()); setPicUnRe(false); setIfGot(new Set()); setDecIdx(0);
    setAccessGot(new Set()); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "picture") { setPicUnRe(false); say(SAM.picture); }
    else if (m === "ifWhen") say(SAM.ifWhen);
    else if (m === "decideIt") { setDecIdx(0); say(SAM.decideIt); }
    else if (m === "access") say(SAM.access);
    else if (m === "myFuture") say(SAM.myFuture);
    else say(SAM.home);
  };

  const tapPic = (i: number) => {
    if (picGot.has(i)) return;
    const next = new Set(picGot); next.add(i);
    setPicGot(next); say(picList[i].say); celebrate("small");
    if (next.size >= picList.length) window.setTimeout(() => setPicUnRe(true), 200);
  };
  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapIf = tapList(IF_WHEN, ifGot, setIfGot, "ifWhen");
  const tapAccess = tapList(ACCESS, accessGot, setAccessGot, "access");

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(ASK_HELP[i].a); celebrate("small");
    if (next.size >= ASK_HELP.length) earn("myFuture");
  };

  const chooseDecide = (c: DecideChoice) => {
    if (!c.good) { say(`${c.result} ${DECIDE_RECONSIDER}`); return; }
    celebrate("small");
    say(c.result, () => { if (decIdx + 1 >= DECIDE_SCENES.length) { earn("decideIt"); go("home"); } else setDecIdx((i) => i + 1); });
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
  const TapList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
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
      <GameShell title="My Choices, My Future" tools={tools} onExit={onExit}>
        <GameDone gameId="my-choices" stars={3} coins={30} title="Your choice! 🧭" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="My Choices, My Future" tools={tools} onExit={onExit}>
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

        {/* The Full Picture — collect facts, then UN & RE */}
        {mode === "picture" && (
          <>
            {!picUnRe ? (
              <>
                {TapList(picList, picGot, tapPic)}
                <p className="text-center text-xs text-white/60">{picGot.size} / {picList.length} · non-explicit & factual</p>
              </>
            ) : (
              <>
                <UnReBeat un={PICTURE_UN} re={PICTURE_RE} />
                <button type="button" onClick={() => { earn("picture"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">The choice is mine</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "ifWhen" && (<>{TapList(IF_WHEN, ifGot, tapIf)}<p className="text-center text-xs text-white/60">{ifGot.size} / {IF_WHEN.length}</p>{HomeBtn}</>)}
        {mode === "access" && (<>{TapList(ACCESS, accessGot, tapAccess)}<p className="text-center text-xs text-white/60">{accessGot.size} / {ACCESS.length}</p>{HomeBtn}</>)}

        {/* Decide It — values-based decision sim */}
        {mode === "decideIt" && DECIDE_SCENES[decIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{DECIDE_SCENES[decIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{DECIDE_SCENES[decIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {DECIDE_SCENES[decIdx].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => chooseDecide(c)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{decIdx + 1} / {DECIDE_SCENES.length} · the choice is yours</p>
            {HomeBtn}
          </>
        )}

        {/* My Future + Ask Anything */}
        {mode === "myFuture" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {ASK_HELP.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#059669"}` } : undefined}>
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
