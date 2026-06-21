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
  ALGORITHM, MYTHS, MYTH_UN, MYTH_MISS, YOURSELF, DECODER,
  GROW_UN, GROW_RE, GROW_TOGETHER, CHARTER, BADGE_TARGET, SAM, type Fact,
} from "@/content/games/decoded";

type Mode = "home" | "algorithm" | "influence" | "yourself" | "decoder" | "grow";
const MODES: [Mode, string, string][] = [
  ["algorithm", "🧮", "Decode the Algorithm"],
  ["influence", "🎭", "Decode the Influence"],
  ["yourself", "🧘", "Decode Yourself"],
  ["decoder", "🔓", "The Decoder"],
  ["grow", "🌟", "Grow: Your Journey"],
];

export function DecodedGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [algoGot, setAlgoGot] = useState<Set<number>>(new Set());
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);
  const [selfGot, setSelfGot] = useState<Set<number>>(new Set());
  const [decGot, setDecGot] = useState<Set<number>>(new Set());
  const [charterOpen, setCharterOpen] = useState(false);
  const [charterGot, setCharterGot] = useState<Set<number>>(new Set());

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
      if (next.size >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1400);
      else say(SAM.badge);
      return next;
    });
  }, [say]);

  const reset = () => {
    setBadges(new Set()); setAlgoGot(new Set()); setMIdx(0); setMBusted(false); setSelfGot(new Set());
    setDecGot(new Set()); setCharterOpen(false); setCharterGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "algorithm") say(SAM.algorithm);
    else if (m === "influence") { setMIdx(0); setMBusted(false); say(SAM.influence); }
    else if (m === "yourself") say(SAM.yourself);
    else if (m === "decoder") say(SAM.decoder);
    else if (m === "grow") { setCharterOpen(false); say(SAM.grow); }
    else say(SAM.home);
  };

  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapAlgo = tapList(ALGORITHM, algoGot, setAlgoGot, "algorithm");
  const tapSelf = tapList(YOURSELF, selfGot, setSelfGot, "yourself");
  const tapDec = tapList(DECODER, decGot, setDecGot, "decoder");

  const tapCharter = (i: number) => {
    if (charterGot.has(i)) return;
    const next = new Set(charterGot); next.add(i);
    setCharterGot(next); say(CHARTER[i].say); celebrate("small");
    if (next.size >= CHARTER.length) earn("grow");
  };

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMyth = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("influence"); go("home"); }
    else { setMBusted(false); setMIdx((i) => i + 1); }
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
          <span className="flex-1 text-sm font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Decoded" tools={tools} onExit={onExit}>
        <GameDone gameId="decoded" stars={3} coins={35} title="Decoded. 🔓" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Decoded" tools={tools} onExit={onExit}>
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

        {mode === "algorithm" && (<>{TapList(ALGORITHM, algoGot, tapAlgo)}<p className="text-center text-xs text-foreground/60">{algoGot.size} / {ALGORITHM.length}</p>{HomeBtn}</>)}
        {mode === "yourself" && (<>{TapList(YOURSELF, selfGot, tapSelf)}<p className="text-center text-xs text-foreground/60">{selfGot.size} / {YOURSELF.length}</p>{HomeBtn}</>)}
        {mode === "decoder" && (<><p className="text-center text-xs font-semibold uppercase tracking-wide text-foreground/55">The master tool — decode anything</p>{TapList(DECODER, decGot, tapDec)}<p className="text-center text-xs text-foreground/60">{decGot.size} / {DECODER.length}</p>{HomeBtn}</>)}

        {/* Decode the Influence (UN & RE) */}
        {mode === "influence" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-base font-bold ${mBusted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTHS[mIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">🔓 {mIdx + 1 >= MYTHS.length ? "Last one decoded!" : "Next"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTHS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-foreground/60">{mIdx + 1} / {MYTHS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Grow: Your Journey — the finale reflection + digital-life charter */}
        {mode === "grow" && (
          <>
            {!charterOpen ? (
              <>
                <UnReBeat un={GROW_UN} re={GROW_RE} />
                <p className="text-center font-display text-lg font-bold" style={{ color: "#c4b5fd" }}>{GROW_TOGETHER}</p>
                <button type="button" onClick={() => { setCharterOpen(true); say(SAM.charter); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">✍️ Write my digital-life charter</button>
              </>
            ) : (
              <>
                {TapList(CHARTER, charterGot, tapCharter)}
                <p className="text-center text-xs text-foreground/60">{charterGot.size} / {CHARTER.length}</p>
              </>
            )}
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
