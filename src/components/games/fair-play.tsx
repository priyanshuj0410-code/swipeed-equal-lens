"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Scale, ScrollText } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { TASKS, type FairOption } from "@/content/games/fair-play";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

export function FairPlayGame({ onExit }: { onExit: () => void }) {
  const total = TASKS.length;
  const [index, setIndex] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleKind, setBubbleKind] = useState<"cheer" | "nudge">("cheer");
  const [rights, setRights] = useState<string | null>(null);
  const [locked, setLocked] = useState(false); // brief lock during cheer/rights transition
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const task = TASKS[index];
  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  // narrate each question
  useEffect(() => {
    if (!done) say(task.q);
  }, [index, done, say, task.q]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      stopSpeaking();
    },
    []
  );

  const after = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setIndex(0);
    setBubble(null);
    setRights(null);
    setLocked(false);
    setDone(false);
  };

  const choose = (opt: FairOption) => {
    if (locked) return;
    if (!opt.fair) {
      setBubbleKind("nudge");
      setBubble(opt.nudge ?? "Let's be fair! 💛");
      say(opt.nudge ?? "Let's be fair!");
      try {
        navigator.vibrate?.(8);
      } catch {
        /* unsupported */
      }
      return;
    }
    // fair choice
    setLocked(true);
    setBubbleKind("cheer");
    setBubble(task.cheer);
    say(task.cheer);
    celebrate("small");
    try {
      navigator.vibrate?.(12);
    } catch {
      /* unsupported */
    }
    const advance = () => {
      setBubble(null);
      setRights(null);
      setLocked(false);
      if (index + 1 >= total) setDone(true);
      else setIndex(index + 1);
    };
    if (task.right) {
      after(700, () => {
        setRights(task.right!);
        say(task.right!);
      });
      after(2600, advance);
    } else {
      after(950, advance);
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
      <GameShell title="Fair Play World" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="fair-play"
          stars={3}
          coins={15}
          title="A fair home for everyone!"
          blurb="Chores, school and play — shared by all. 🔄"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  const pct = Math.round((index / total) * 100);

  return (
    <GameShell title="Fair Play World" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* fairness meter */}
        <div className="glass-pill w-full rounded-2xl px-3.5 py-2 backdrop-blur-md backdrop-saturate-150">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Scale className="size-3.5" aria-hidden /> Fairness Meter
            </span>
            <span>
              {index}/{total}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "var(--flag-green)" }}
            />
          </div>
        </div>

        {/* bubble (cheer / nudge) */}
        <div className="flex h-12 items-end">
          {bubble && (
            <span
              className="animate-in fade-in zoom-in rounded-2xl px-4 py-2 text-center text-sm font-bold backdrop-blur-md backdrop-saturate-150 duration-200"
              style={{
                background: bubbleKind === "cheer" ? "rgba(10,102,46,0.52)" : "rgba(128,80,16,0.5)",
                color: "#eef1f7",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {bubble}
            </span>
          )}
        </div>

        {rights ? (
          // Rights Card reveal
          <div className="glass-card flex w-full flex-col items-center gap-2 px-6 py-7 text-center backdrop-blur-[12px] backdrop-saturate-150">
            <ScrollText className="size-9 text-white" aria-hidden />
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">Rights Card</span>
            <p className="font-display text-lg font-bold text-white">{rights}</p>
          </div>
        ) : (
          <>
            {/* the task */}
            <div className="glass-card flex w-full items-center gap-3 px-5 py-5 backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>
                {task.emoji}
              </span>
              <p className="flex-1 font-display text-xl font-bold text-white">{task.q}</p>
            </div>

            {/* assign options */}
            <div className="grid w-full grid-cols-1 gap-2.5">
              {task.options.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => choose(opt)}
                  disabled={locked}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] disabled:opacity-70"
                >
                  <span className="text-2xl" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="flex-1 text-base font-semibold text-white">{opt.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
}
