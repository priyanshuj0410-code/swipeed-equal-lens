"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ShieldCheck, ArrowRight, MapPin } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { SITUATIONS, HELP_MAP, type Response } from "@/content/games/speak-up";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

export function SpeakUpGame({ onExit }: { onExit: () => void }) {
  const total = SITUATIONS.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"scene" | "reveal" | "helpmap">("scene");
  const [chosen, setChosen] = useState<Response | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sit = SITUATIONS[index];
  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  useEffect(() => {
    if (!done && phase === "scene") say(sit.scene);
    if (phase === "helpmap") say("If something feels wrong, here is who can help.");
  }, [index, phase, done, say, sit.scene]);

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

  const choose = (r: Response) => {
    if (phase !== "scene") return;
    if (!r.safe) {
      setNudge("That may not keep someone safe — try a safe choice. 💛");
      say("That may not keep someone safe. Try a safe choice.");
      try {
        navigator.vibrate?.(8);
      } catch {
        /* unsupported */
      }
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      nudgeTimer.current = setTimeout(() => setNudge(null), 2400);
      return;
    }
    setChosen(r);
    setPhase("reveal");
    setNudge(null);
    celebrate("small");
    say(`${r.kind}. That's a safe, strong choice.`);
    try {
      navigator.vibrate?.(12);
    } catch {
      /* unsupported */
    }
  };

  const next = () => {
    if (index + 1 >= total) {
      setPhase("helpmap");
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
      <GameShell title="Speak Up" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="speak-up"
          stars={3}
          coins={15}
          title="You know how to speak up!"
          blurb="Set a boundary, find an ally, and always know where help is. 🫶"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  // ---- final help-map screen ----
  if (phase === "helpmap") {
    return (
      <GameShell title="Speak Up" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <span className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold backdrop-blur-md backdrop-saturate-150">
            <MapPin className="size-4" aria-hidden /> Who can help?
          </span>
          <div className="grid w-full grid-cols-1 gap-2.5">
            {HELP_MAP.map((h) => (
              <div
                key={h.name}
                className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-[12px] backdrop-saturate-150"
              >
                <span className="text-2xl" aria-hidden>
                  {h.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-base font-bold text-white">{h.name}</span>
                  <span className="text-xs text-white/80">{h.detail}</span>
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDone(true)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
          >
            Finish <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="Speak Up" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* the situation */}
        <div className="glass-card flex w-full flex-col items-center gap-2 px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
          <span className="text-5xl" aria-hidden>
            {sit.emoji}
          </span>
          <p className="font-display text-lg font-bold leading-snug text-white">{sit.scene}</p>
        </div>

        {phase === "scene" ? (
          <>
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
            <span className="text-xs font-semibold text-white/85">What's a safe thing to do?</span>
            <div className="grid w-full grid-cols-1 gap-2.5">
              {sit.options.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => choose(r)}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
                >
                  <span className="flex-1 text-sm font-semibold text-white">{r.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          // safe-response reveal
          <div className="flex w-full flex-col items-center gap-3">
            <div
              className="flex w-full flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center backdrop-blur-md backdrop-saturate-150"
              style={{ background: "rgba(10,102,46,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#eef1f7" }}
            >
              <ShieldCheck className="size-7" aria-hidden style={{ color: "#9ff0bd" }} />
              <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">{chosen?.kind}</span>
              <p className="font-display text-lg font-bold">That's a safe, strong choice.</p>
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
            >
              {index + 1 >= total ? "See who can help" : "Next"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
