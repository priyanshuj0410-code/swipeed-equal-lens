"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { STORIES, WORDS, PRESSURE, PRESSURE_UN, PRESSURE_RE, MAKE_IT_RIGHT, GOOD_FRIEND_TAGS, BADGE_TARGET, SAM, type Choice } from "@/content/games/friend-frenemy";

type Mode = "home" | "stories" | "words" | "pressure" | "makeRight" | "check";
const MODES: [Mode, string, string][] = [
  ["stories", "🎭", "Friend or Frenemy?"],
  ["words", "🧰", "Words Toolbox"],
  ["pressure", "😬", "Pressure Moments"],
  ["makeRight", "🤝", "Make It Right"],
  ["check", "💛", "True-Friend Check"],
];

export function FriendFrenemyGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [storyIdx, setStoryIdx] = useState(0);
  const [collected, setCollected] = useState<Set<number>>(new Set());
  const [pIdx, setPIdx] = useState(0);
  const [pBeat, setPBeat] = useState(false);
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setStoryIdx(0); setCollected(new Set()); setPIdx(0); setPBeat(false); setStep(0); setTags(new Set());
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "stories") { setStoryIdx(0); say(SAM.stories); }
    else if (m === "words") say(SAM.words);
    else if (m === "pressure") { setPIdx(0); setPBeat(false); say(SAM.pressure); }
    else if (m === "makeRight") { setStep(0); say(SAM.makeRight); }
    else if (m === "check") say(SAM.check);
    else say(SAM.home);
  };

  const chooseStory = (c: Choice) => {
    if (c.friend) {
      celebrate("small");
      say(c.result, () => { if (storyIdx + 1 >= STORIES.length) { earn("stories"); go("home"); } else setStoryIdx((i) => i + 1); });
    } else {
      say(c.result); // gentle consequence — try again, never a fail
    }
  };

  const tapWord = (i: number) => {
    if (collected.has(i)) return;
    const next = new Set(collected); next.add(i);
    setCollected(next);
    say(WORDS[i].line);
    celebrate("small");
    if (next.size >= WORDS.length) earn("words");
  };

  const choosePressure = (ok: boolean, result: string) => {
    if (ok) {
      celebrate("small");
      say(result, () => { if (pIdx + 1 >= PRESSURE.length) setPBeat(true); else setPIdx((i) => i + 1); });
    } else {
      say(result);
    }
  };

  const tapStep = (i: number) => {
    if (i !== step) return;
    say(MAKE_IT_RIGHT[i].say);
    celebrate("small");
    if (i + 1 >= MAKE_IT_RIGHT.length) { say(SAM.makeRightDone, () => earn("makeRight")); setStep(MAKE_IT_RIGHT.length); }
    else setStep(i + 1);
  };

  const toggleTag = (i: number) => setTags((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : (n.add(i), celebrate("small")); return n; });

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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
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

  if (done) {
    return (
      <GameShell title="Friend or Frenemy?" tools={tools} onExit={onExit}>
        <GameDone gameId="friend-frenemy" stars={3} coins={20} title="A true friend! 🤝" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Friend or Frenemy?" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Friend or Frenemy? — branching story */}
        {mode === "stories" && STORIES[storyIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{STORIES[storyIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{STORIES[storyIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {STORIES[storyIdx].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => chooseStory(c)} className="glass-card rounded-2xl px-4 py-3 text-left text-base font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">Story {storyIdx + 1} / {STORIES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* The Words Toolbox */}
        {mode === "words" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {WORDS.map((w, i) => (
                <button key={i} type="button" onClick={() => tapWord(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={collected.has(i) ? { boxShadow: "inset 0 0 0 2px #EC4899" } : undefined}>
                  <span className="text-3xl" aria-hidden>{w.emoji}</span>
                  <span className="flex-1 text-base font-semibold text-foreground">“{w.line}”</span>
                  {collected.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">Collected {collected.size} / {WORDS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Pressure Moments + UN & RE */}
        {mode === "pressure" && (
          <>
            {!pBeat && PRESSURE[pIdx] ? (
              <>
                <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
                  <span className="text-4xl" aria-hidden>{PRESSURE[pIdx].emoji}</span>
                  <p className="font-display text-lg font-bold text-foreground">{PRESSURE[pIdx].situation}</p>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {PRESSURE[pIdx].choices.map((c, i) => (
                    <button key={i} type="button" onClick={() => choosePressure(c.ok, c.result)} className="glass-card rounded-2xl px-4 py-3 text-left text-base font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <UnReBeat un={PRESSURE_UN} re={PRESSURE_RE} />
                <button type="button" onClick={() => { earn("pressure"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* Make It Right */}
        {mode === "makeRight" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {MAKE_IT_RIGHT.map((s, i) => {
                const doneStep = i < step;
                const active = i === step;
                return (
                  <button key={i} type="button" disabled={!active} onClick={() => tapStep(i)} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98] ${active ? "" : "opacity-50"}`} style={doneStep ? { boxShadow: "inset 0 0 0 2px #62e08f" } : undefined}>
                    <span className="text-3xl" aria-hidden>{s.emoji}</span>
                    <span className="flex-1 text-base font-bold text-foreground">{i + 1}. {s.label}</span>
                    {doneStep && <Check className="size-5 text-foreground" aria-hidden />}
                  </button>
                );
              })}
            </div>
            {HomeBtn}
          </>
        )}

        {/* True-Friend Check */}
        {mode === "check" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {GOOD_FRIEND_TAGS.map((t, i) => (
                <button key={i} type="button" onClick={() => toggleTag(i)} aria-pressed={tags.has(i)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] transition-transform active:scale-95" style={tags.has(i) ? { boxShadow: "inset 0 0 0 2px #EC4899" } : undefined}>
                  <span className="text-2xl" aria-hidden>{t.emoji}</span><span className="text-[10px] font-bold text-foreground">{t.label}</span>
                </button>
              ))}
            </div>
            <button type="button" disabled={tags.size < 3} onClick={() => say(SAM.checkDone, () => earn("check"))} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
              <Check className="size-5" aria-hidden /> That's a good friend!
            </button>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
