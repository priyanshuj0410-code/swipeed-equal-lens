"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { SAME_SAME } from "@/content/games/same-same";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

const PROMPT = {
  same: "What is the same?",
  different: "What is different?",
} as const;

export function SameSameGame() {
  const pairs = SAME_SAME.pairs;
  const [pairIdx, setPairIdx] = useState(0);
  const [phase, setPhase] = useState<"same" | "different">("same");
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [bubble, setBubble] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);

  const pair = pairs[pairIdx];
  const items = phase === "same" ? pair.same : pair.different;

  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  // narrate the round prompt whenever the phase or pair changes
  useEffect(() => {
    if (done) return;
    say(PROMPT[phase]);
  }, [phase, pairIdx, done, say]);

  useEffect(() => () => stopSpeaking(), []);

  const reset = () => {
    setPairIdx(0);
    setPhase("same");
    setTapped(new Set());
    setBubble(null);
    setDone(false);
  };

  const tap = (i: number) => {
    if (tapped.has(i)) return;
    const item = items[i];
    const next = new Set(tapped);
    next.add(i);
    setTapped(next);
    setBubble(item.say);
    say(item.say);
    if (phase === "different") celebrate("small");
    try {
      navigator.vibrate?.(10);
    } catch {
      /* unsupported */
    }
    window.setTimeout(() => setBubble((b) => (b === item.say ? null : b)), 1700);

    if (next.size >= items.length) {
      window.setTimeout(() => {
        setBubble(null);
        if (phase === "same") {
          setPhase("different");
          setTapped(new Set());
        } else if (pairIdx + 1 < pairs.length) {
          setPairIdx(pairIdx + 1);
          setPhase("same");
          setTapped(new Set());
        } else {
          setDone(true);
        }
      }, 900);
    }
  };

  const muteBtn = (
    <button
      type="button"
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      onClick={() =>
        setMuted((m) => {
          const n = !m;
          if (n) stopSpeaking();
          return n;
        })
      }
      className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
    >
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );

  if (done) {
    return (
      <GameShell title="Same Same, Different" tools={muteBtn}>
        <GameDone
          gameId="same-same"
          stars={3}
          coins={15}
          title="So many ways we're the same!"
          blurb="And different is wonderful. 🌈"
          onReplay={reset}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Same Same, Different" progress={{ current: pairIdx + 1, total: pairs.length }} tools={muteBtn}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* speech bubble */}
        <div className="flex h-12 items-end">
          {bubble && (
            <span className="glass-pill animate-in fade-in zoom-in rounded-2xl px-4 py-2 text-center text-sm font-bold backdrop-blur-md backdrop-saturate-150 duration-200">
              {bubble}
            </span>
          )}
        </div>

        {/* the two children */}
        <div className="flex w-full items-stretch gap-3">
          {[pair.left, pair.right].map((k, idx) => (
            <div
              key={idx}
              className="glass-card flex flex-1 flex-col items-center gap-1 px-3 py-4 backdrop-blur-[12px] backdrop-saturate-150"
            >
              <span className="text-5xl" aria-hidden>
                {k.emoji}
              </span>
              <span className="text-sm font-bold text-white">{k.name}</span>
            </div>
          ))}
        </div>

        {/* the round prompt — tap to hear it again */}
        <button
          type="button"
          onClick={() => say(PROMPT[phase])}
          className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
        >
          {phase === "same" ? "What's the SAME? 💛" : "What's DIFFERENT? 🌈"}
        </button>

        {/* tappable traits — every tap is kind, none are wrong */}
        <div className="grid w-full grid-cols-1 gap-2.5">
          {items.map((item, i) => {
            const isTapped = tapped.has(i);
            return (
              <button
                key={`${pairIdx}-${phase}-${i}`}
                type="button"
                onClick={() => tap(i)}
                disabled={isTapped}
                className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] ${
                  isTapped ? "opacity-80 ring-2 ring-white/60" : ""
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <span className="flex-1 text-base font-semibold text-white">{item.label}</span>
                {isTapped && <Check className="size-5 text-white" aria-hidden />}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
