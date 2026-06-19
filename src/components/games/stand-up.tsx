"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ShieldCheck, LifeBuoy, ArrowRight } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { SCENARIOS, D_INFO, D_LEGEND, type BystanderOption } from "@/content/games/stand-up";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

export function StandUpGame({ onExit }: { onExit: () => void }) {
  const total = SCENARIOS.length;
  const [phase, setPhase] = useState<"intro" | "scene" | "reveal">("intro");
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<BystanderOption | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sc = SCENARIOS[index];
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
    setPhase("intro");
    setIndex(0);
    setChosen(null);
    setNudge(null);
    setDone(false);
  };

  const choose = (o: BystanderOption) => {
    if (phase !== "scene") return;
    if (!o.safe) {
      setNudge("Safety first — never put yourself at risk. Try a safe D.");
      say("Safety first. Never put yourself at risk. Try a safe D.");
      try {
        navigator.vibrate?.(8);
      } catch {
        /* unsupported */
      }
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
      nudgeTimer.current = setTimeout(() => setNudge(null), 2600);
      return;
    }
    setChosen(o);
    setPhase("reveal");
    setNudge(null);
    celebrate("small");
    say(`${o.d}. ${o.d ? D_INFO[o.d].blurb : ""}`);
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
      <GameShell title="Stand Up" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="stand-up"
          stars={3}
          coins={15}
          title="A safe, brave bystander!"
          blurb="Distract, Delegate, Document, Direct — and always stay safe. ✊"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  // ---- intro: the 4 Ds toolkit ----
  if (phase === "intro") {
    return (
      <GameShell title="Stand Up" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <span className="glass-pill rounded-full px-4 py-2 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150">
            Be a safe bystander — the 4 Ds ✊
          </span>
          <div className="grid w-full grid-cols-1 gap-2.5">
            {D_LEGEND.map((l) => (
              <div
                key={l.d}
                className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-[12px] backdrop-saturate-150"
              >
                <span className="font-display text-lg font-extrabold text-white">{l.d}</span>
                <span className="flex-1 text-right text-sm font-medium text-white/85">{l.what}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-medium text-white/80">You never have to put yourself in danger.</p>
          <button
            type="button"
            onClick={() => {
              setPhase("scene");
              say(SCENARIOS[0].scene);
            }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
          >
            Start <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="Stand Up" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {/* the scenario */}
        <div className="glass-card flex w-full flex-col items-center gap-2 px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
          <span className="text-5xl" aria-hidden>
            {sc.emoji}
          </span>
          <p className="font-display text-lg font-bold leading-snug text-white">{sc.scene}</p>
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
            <span className="text-xs font-semibold text-white/85">Pick a safe way to help</span>
            <div className="grid w-full grid-cols-1 gap-2.5">
              {sc.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(o)}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
                >
                  {o.d && (
                    <span className="shrink-0 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-white">
                      {o.d}
                    </span>
                  )}
                  <span className="flex-1 text-sm font-semibold text-white">{o.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          // safe-action reveal + rights/helpline card
          <div className="flex w-full flex-col items-center gap-3">
            <div
              className="flex w-full flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center backdrop-blur-md backdrop-saturate-150"
              style={{ background: "rgba(10,102,46,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#eef1f7" }}
            >
              <ShieldCheck className="size-7" aria-hidden style={{ color: "#9ff0bd" }} />
              <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">{chosen?.d}</span>
              <p className="font-display text-base font-bold">{chosen?.d ? D_INFO[chosen.d].blurb : ""}</p>
            </div>
            <span className="glass-pill flex items-start gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold backdrop-blur-md backdrop-saturate-150">
              <LifeBuoy className="mt-0.5 size-4 shrink-0" aria-hidden /> {sc.right}
            </span>
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
