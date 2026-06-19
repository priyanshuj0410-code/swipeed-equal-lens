"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Scissors, ArrowDown, ArrowRight } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { ADS, type Swap } from "@/content/games/flip-script";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

export function FlipScriptGame({ onExit }: { onExit: () => void }) {
  const total = ADS.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"edit" | "after">("edit");
  const [chosen, setChosen] = useState<Swap | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ad = ADS[index];
  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  useEffect(() => {
    if (!done && phase === "edit") say(`Spot the stereotype. ${ad.original}`);
  }, [index, phase, done, say, ad.original]);

  useEffect(
    () => () => {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      stopSpeaking();
    },
    []
  );

  const reset = () => {
    setIndex(0);
    setPhase("edit");
    setChosen(null);
    setNudge(null);
    setDone(false);
  };

  const choose = (s: Swap) => {
    if (phase !== "edit") return;
    if (!s.fair) {
      setNudge("Still unfair — look again 🔍");
      say("Still unfair. Look again.");
      try {
        navigator.vibrate?.(8);
      } catch {
        /* unsupported */
      }
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      nudgeTimer.current = setTimeout(() => setNudge(null), 2200);
      return;
    }
    setChosen(s);
    setPhase("after");
    setNudge(null);
    celebrate("small");
    say(`${ad.cheer}`);
    try {
      navigator.vibrate?.(12);
    } catch {
      /* unsupported */
    }
  };

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPhase("edit");
    setChosen(null);
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
      <GameShell title="Flip the Script" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="flip-script"
          stars={3}
          coins={15}
          title="Sharp eye, smart editor!"
          blurb="Ads and films don't get to decide who you can be. 🎬"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Flip the Script" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* the poster / ad */}
        <div className="glass-card flex w-full flex-col items-center gap-2 px-5 py-5 text-center backdrop-blur-[12px] backdrop-saturate-150">
          <span className="text-4xl" aria-hidden>
            {ad.emoji}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-white/75">{ad.poster}</span>
          <p
            className={`font-display text-lg font-bold leading-snug text-white ${phase === "after" ? "text-white/55 line-through" : ""}`}
          >
            {ad.original}
          </p>
          {phase === "edit" && (
            <span
              className="mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ background: "rgba(128,32,24,0.55)", color: "#ffd9d4", border: "1px solid rgba(255,255,255,0.16)" }}
            >
              Stereotype
            </span>
          )}
        </div>

        {phase === "edit" ? (
          <>
            <div className="flex h-10 items-end">
              {nudge && (
                <span
                  className="animate-in fade-in zoom-in rounded-2xl px-4 py-2 text-center text-sm font-bold backdrop-blur-md backdrop-saturate-150 duration-200"
                  style={{ background: "rgba(128,80,16,0.5)", color: "#eef1f7", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  {nudge}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
              <Scissors className="size-3.5" aria-hidden /> You're the editor — swap in a fair line!
            </span>
            <div className="grid w-full grid-cols-1 gap-2.5">
              {ad.options.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  onClick={() => choose(s)}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
                >
                  <span className="flex-1 text-sm font-semibold text-white">{s.text}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          // before / after reveal
          <div className="flex w-full flex-col items-center gap-3">
            <ArrowDown className="size-6 text-white/80" aria-hidden />
            <div
              className="flex w-full flex-col items-center gap-1.5 rounded-2xl px-5 py-5 text-center backdrop-blur-md backdrop-saturate-150"
              style={{ background: "rgba(10,102,46,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#eef1f7" }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">Your remix</span>
              <p className="font-display text-lg font-bold">{chosen?.text}</p>
              <p className="mt-1 text-sm font-semibold text-white/90">{ad.cheer}</p>
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
            >
              {index + 1 >= total ? "Finish" : "Next ad"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
