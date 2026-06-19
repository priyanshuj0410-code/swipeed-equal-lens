"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Heart, LifeBuoy, ArrowRight } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { SCENES, type Choice } from "@/content/games/not-funny";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

export function NotFunnyGame({ onExit }: { onExit: () => void }) {
  const total = SCENES.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"scene" | "reveal">("scene");
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sc = SCENES[index];
  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  useEffect(() => {
    if (!done && phase === "scene") say(sc.scene);
  }, [index, phase, done, say, sc.scene]);

  useEffect(
    () => () => {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      stopSpeaking();
    },
    []
  );

  const reset = () => {
    setIndex(0);
    setPhase("scene");
    setChosen(null);
    setNudge(null);
    setDone(false);
  };

  const choose = (c: Choice) => {
    if (phase !== "scene") return;
    if (!c.ally) {
      setNudge(c.outcome);
      say(c.outcome);
      try {
        navigator.vibrate?.(8);
      } catch {
        /* unsupported */
      }
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      nudgeTimer.current = setTimeout(() => setNudge(null), 2400);
      return;
    }
    setChosen(c);
    setPhase("reveal");
    setNudge(null);
    celebrate("small");
    say(`${c.outcome} ${c.phrase ?? ""}`);
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
    setPhase("scene");
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
      <GameShell title="Not Fair, Not Funny" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="not-funny"
          stars={3}
          coins={15}
          title="You're a great ally!"
          blurb="Speak up, include everyone, and tell a trusted adult if it won't stop. 💛"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Not Fair, Not Funny" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* the scene */}
        <div className="glass-card flex w-full flex-col items-center gap-2 px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
          <span className="text-5xl" aria-hidden>
            {sc.emoji}
          </span>
          <p className="font-display text-lg font-bold leading-snug text-white">{sc.scene}</p>
        </div>

        {phase === "scene" ? (
          <>
            {/* gentle nudge for an unkind choice */}
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
            <span className="text-xs font-semibold text-white/85">What do you do?</span>
            <div className="grid w-full grid-cols-1 gap-2.5">
              {sc.choices.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => choose(c)}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
                >
                  <span className="flex-1 text-base font-semibold text-white">{c.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          // ally reveal: outcome + a phrase to keep (+ help route if any)
          <div className="flex w-full flex-col items-center gap-3">
            <div
              className="flex w-full flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center backdrop-blur-md backdrop-saturate-150"
              style={{ background: "rgba(10,102,46,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#eef1f7" }}
            >
              <Heart className="size-7" aria-hidden style={{ color: "#9ff0bd" }} />
              <p className="font-display text-lg font-bold">{chosen?.outcome}</p>
              {chosen?.phrase && (
                <>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">A phrase to keep</span>
                  <p className="text-base font-semibold">{chosen.phrase}</p>
                </>
              )}
            </div>
            {chosen?.help && (
              <span className="glass-pill flex items-center gap-2 rounded-2xl px-4 py-2.5 text-center text-sm font-semibold backdrop-blur-md backdrop-saturate-150">
                <LifeBuoy className="size-4 shrink-0" aria-hidden /> {chosen.help}
              </span>
            )}
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
            >
              {index + 1 >= total ? "Finish" : "Next"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
