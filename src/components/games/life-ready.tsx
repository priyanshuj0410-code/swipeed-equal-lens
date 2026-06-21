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
  VALUES, SCENES, SCENE_MISS, BIG_STUFF, PEOPLE, MYTHS, BADGE_TARGET, SAM, type Step,
} from "@/content/games/life-ready";

type Mode = "home" | "know" | "decide" | "big" | "people" | "myths";
const MODES: [Mode, string, string][] = [
  ["know", "🪞", "Know Yourself"],
  ["decide", "⚖️", "Decide Like an Adult"],
  ["big", "🌊", "Handle the Big Stuff"],
  ["people", "🤝", "People & Support"],
  ["myths", "💭", "Life Myths"],
];

export function LifeReadyGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [knowGot, setKnowGot] = useState<Set<number>>(new Set());
  const [bigGot, setBigGot] = useState<Set<number>>(new Set());
  const [peopleGot, setPeopleGot] = useState<Set<number>>(new Set());
  const [sceneIdx, setSceneIdx] = useState(0);
  const [mythIdx, setMythIdx] = useState(0);
  const [busted, setBusted] = useState(false);

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
    setBadges(new Set()); setKnowGot(new Set()); setBigGot(new Set()); setPeopleGot(new Set());
    setSceneIdx(0); setMythIdx(0); setBusted(false); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "know") say(SAM.know);
    else if (m === "decide") { setSceneIdx(0); say(SAM.decide); }
    else if (m === "big") say(SAM.big);
    else if (m === "people") say(SAM.people);
    else if (m === "myths") { setMythIdx(0); setBusted(false); say(SAM.myths); }
    else say(SAM.home);
  };

  const tapList = (arr: Step[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapKnow = tapList(VALUES, knowGot, setKnowGot, "know");
  const tapBig = tapList(BIG_STUFF, bigGot, setBigGot, "big");
  const tapPeople = tapList(PEOPLE, peopleGot, setPeopleGot, "people");

  const pickApproach = (mature: boolean) => {
    const s = SCENES[sceneIdx];
    if (!mature) { say(SCENE_MISS); return; }
    celebrate("small");
    say(s.reason, () => { if (sceneIdx + 1 >= SCENES.length) { earn("decide"); go("home"); } else setSceneIdx((i) => i + 1); });
  };

  const bustMyth = () => { setBusted(true); celebrate("small"); say(MYTHS[mythIdx].re); };
  const nextMyth = () => {
    if (mythIdx + 1 >= MYTHS.length) { earn("myths"); go("home"); }
    else { setMythIdx((i) => i + 1); setBusted(false); }
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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} skills`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🧭" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: Step[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #F59E0B" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Life Ready" tools={tools} onExit={onExit}>
        <GameDone gameId="life-ready" stars={3} coins={35} title="Life Ready 🌅" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Life Ready" tools={tools} onExit={onExit}>
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

        {mode === "know" && (<>{TapList(VALUES, knowGot, tapKnow)}<p className="text-center text-xs text-foreground/60">{knowGot.size} / {VALUES.length} · your values map — no wrong answers</p>{HomeBtn}</>)}
        {mode === "big" && (<>{TapList(BIG_STUFF, bigGot, tapBig)}<p className="text-center text-xs text-foreground/60">{bigGot.size} / {BIG_STUFF.length} · the big stuff is hard — and handleable</p>{HomeBtn}</>)}
        {mode === "people" && (<>{TapList(PEOPLE, peopleGot, tapPeople)}<p className="text-center text-xs text-foreground/60">{peopleGot.size} / {PEOPLE.length} · you don't do adulthood alone</p>{HomeBtn}</>)}

        {/* Decide Like an Adult — pick the grown-up approach */}
        {mode === "decide" && SCENES[sceneIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{SCENES[sceneIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{SCENES[sceneIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SCENES[sceneIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => pickApproach(o.mature)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">{sceneIdx + 1} / {SCENES.length} · decide by your own values</p>
            {HomeBtn}
          </>
        )}

        {/* Life Myths Busted — the UN & RE beat */}
        {mode === "myths" && MYTHS[mythIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>💭</span>
              <p className={`font-display text-lg font-bold ${busted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={busted ? undefined : { color: "#ff9085" }}>“{MYTHS[mythIdx].un}”</p>
            </div>
            {!busted ? (
              <button type="button" onClick={bustMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">🧽 Bust this myth</button>
            ) : (
              <>
                <UnReBeat un={MYTHS[mythIdx].un} re={MYTHS[mythIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">{mythIdx + 1 >= MYTHS.length ? "Done" : "Next myth"}</button>
              </>
            )}
            <p className="text-center text-xs text-foreground/60">{mythIdx + 1} / {MYTHS.length} · no shame for ever believing one</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
