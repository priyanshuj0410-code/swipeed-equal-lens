"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Scale, Landmark, ScrollText, ArrowRight } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { CASES, LAW_DECK } from "@/content/games/justice-league";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

export function JusticeLeagueGame({ onExit }: { onExit: () => void }) {
  const total = CASES.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"law" | "pathway" | "resolved">("law");
  const [nudge, setNudge] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const c = CASES[index];
  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  useEffect(() => {
    if (!done && phase === "law") say(c.brief);
  }, [index, phase, done, say, c.brief]);

  useEffect(
    () => () => {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      stopSpeaking();
    },
    []
  );

  const flashNudge = (t: string) => {
    setNudge(t);
    say(t);
    try {
      navigator.vibrate?.(8);
    } catch {
      /* unsupported */
    }
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = setTimeout(() => setNudge(null), 2400);
  };

  const reset = () => {
    setIndex(0);
    setPhase("law");
    setNudge(null);
    setDone(false);
  };

  const pickLaw = (law: string) => {
    if (phase !== "law") return;
    if (law !== c.correctLaw) {
      flashNudge("Not quite — match the law to the wrongdoing.");
      return;
    }
    setNudge(null);
    setPhase("pathway");
    say("Right law. Now, where do you take it?");
  };

  const pickPathway = (p: string) => {
    if (phase !== "pathway") return;
    if (p !== c.correctPathway) {
      flashNudge("Think about who actually handles this.");
      return;
    }
    setNudge(null);
    setPhase("resolved");
    celebrate("small");
    say("Case resolved.");
  };

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPhase("law");
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
      <GameShell title="Justice League" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="justice-league"
          stars={3}
          coins={15}
          title="Case closed, advocate!"
          blurb="You know the law and where to turn — that's real power. ⚖️"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  const Nudge = (
    <div className="flex min-h-10 items-end">
      {nudge && (
        <span
          className="animate-in fade-in zoom-in rounded-2xl px-4 py-2 text-center text-sm font-bold backdrop-blur-md backdrop-saturate-150 duration-200"
          style={{ background: "rgba(128,80,16,0.5)", color: "#eef1f7", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          {nudge}
        </span>
      )}
    </div>
  );

  return (
    <GameShell title="Justice League" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* the case file */}
        <div className="glass-card flex w-full flex-col gap-2 px-5 py-5 backdrop-blur-[12px] backdrop-saturate-150">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/75">
            <Scale className="size-3.5" aria-hidden /> Case file
          </span>
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {c.emoji}
            </span>
            <p className="flex-1 font-display text-base font-bold leading-snug text-white">{c.brief}</p>
          </div>
        </div>

        {phase === "resolved" ? (
          <div className="flex w-full flex-col items-center gap-3">
            <div
              className="flex w-full flex-col gap-1.5 rounded-2xl px-5 py-4 backdrop-blur-md backdrop-saturate-150"
              style={{ background: "rgba(10,102,46,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#eef1f7" }}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <ScrollText className="size-4 shrink-0" aria-hidden /> {c.correctLaw}
              </span>
              <span className="flex items-center gap-2 text-sm font-bold">
                <Landmark className="size-4 shrink-0" aria-hidden /> {c.correctPathway}
              </span>
              <p className="mt-1 text-sm font-medium text-white/90">{c.resource}</p>
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
            >
              {index + 1 >= total ? "Finish" : "Next case"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <>
            {Nudge}
            <span className="text-xs font-semibold text-white/85">
              {phase === "law" ? "Which law applies?" : "Where do you take it?"}
            </span>
            <div className="grid w-full grid-cols-1 gap-2.5">
              {(phase === "law" ? LAW_DECK : c.pathways).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => (phase === "law" ? pickLaw(opt) : pickPathway(opt))}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
                >
                  <span className="flex-1 text-sm font-semibold text-white">{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
}
