"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { DECISIONS, START, METRIC_LABEL, type Metric, type Decision } from "@/content/games/lead-the-way";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

function Dashboard({ metrics }: { metrics: Record<Metric, number> }) {
  return (
    <div className="glass-pill w-full rounded-2xl px-4 py-3 backdrop-blur-md backdrop-saturate-150">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold">
        <TrendingUp className="size-3.5" aria-hidden /> Equality dashboard
      </div>
      <div className="flex flex-col gap-2">
        {(Object.keys(METRIC_LABEL) as Metric[]).map((m) => (
          <div key={m} className="flex items-center gap-2">
            <span className="w-28 shrink-0 text-[11px] font-semibold text-white/85">{METRIC_LABEL[m]}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${clamp(metrics[m])}%`, background: "var(--flag-green)" }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-[11px] font-bold tabular-nums">{Math.round(clamp(metrics[m]))}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeadTheWayGame({ onExit }: { onExit: () => void }) {
  const total = DECISIONS.length;
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState<Record<Metric, number>>({ ...START });
  const [phase, setPhase] = useState<"decide" | "cost" | "reflect">("decide");
  const [cost, setCost] = useState<string>("");
  const [flash, setFlash] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);

  const dec: Decision = DECISIONS[index];
  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  useEffect(() => {
    if (!done && phase === "decide") say(dec.scene);
    if (phase === "reflect") say("Years later, with fair choices, the gaps closed.");
  }, [index, phase, done, say, dec.scene]);

  useEffect(() => () => stopSpeaking(), []);

  const reset = () => {
    setIndex(0);
    setMetrics({ ...START });
    setPhase("decide");
    setCost("");
    setFlash(null);
    setDone(false);
  };

  const chooseFair = () => {
    if (phase !== "decide") return;
    setMetrics((m) => ({ ...m, [dec.metric]: clamp(m[dec.metric] + dec.gain) }));
    setFlash(dec.fairNote);
    say(dec.fairNote);
    celebrate("small");
    try {
      navigator.vibrate?.(12);
    } catch {
      /* unsupported */
    }
    window.setTimeout(() => {
      setFlash(null);
      if (index + 1 >= total) setPhase("reflect");
      else setIndex(index + 1);
    }, 1100);
  };

  const chooseStatusQuo = () => {
    if (phase !== "decide") return;
    setCost(dec.cost);
    setPhase("cost");
    say(`Years later. ${dec.cost}`);
    try {
      navigator.vibrate?.(8);
    } catch {
      /* unsupported */
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
      <GameShell title="Lead the Way" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="lead-the-way"
          stars={3}
          coins={15}
          title="You closed the gaps!"
          blurb="Inequality is a system — and these are the levers that change it. 📈"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  // ---- reflection ----
  if (phase === "reflect") {
    return (
      <GameShell title="Lead the Way" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <span className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold backdrop-blur-md backdrop-saturate-150">
            <Clock className="size-4" aria-hidden /> Years later…
          </span>
          <Dashboard metrics={metrics} />
          <p className="text-balance text-center text-sm font-medium text-white/90">
            Fair choices closed the gaps. Inequality isn't one person's fault — it's a system, and these are the levers that
            change it.
          </p>
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
    <GameShell title="Lead the Way" progress={{ current: index + 1, total }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <Dashboard metrics={metrics} />

        {/* the barrier */}
        <div className="glass-card flex w-full items-center gap-3 px-5 py-5 backdrop-blur-[12px] backdrop-saturate-150">
          <span className="text-4xl" aria-hidden>
            {dec.emoji}
          </span>
          <p className="flex-1 font-display text-base font-bold leading-snug text-white">{dec.scene}</p>
        </div>

        {phase === "cost" ? (
          // status-quo "years later" cost + rethink
          <div className="flex w-full flex-col items-center gap-3">
            <div
              className="flex w-full flex-col items-center gap-2 rounded-2xl px-5 py-4 text-center backdrop-blur-md backdrop-saturate-150"
              style={{ background: "rgba(128,40,24,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#ffe7e3" }}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/80">
                <Clock className="size-3.5" aria-hidden /> Years later
              </span>
              <p className="text-sm font-semibold">{cost}</p>
            </div>
            <button
              type="button"
              onClick={() => setPhase("decide")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95"
            >
              Rethink <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <>
            <div className="flex min-h-9 items-end">
              {flash && (
                <span
                  className="animate-in fade-in zoom-in rounded-2xl px-4 py-2 text-center text-sm font-bold backdrop-blur-md backdrop-saturate-150 duration-200"
                  style={{ background: "rgba(10,102,46,0.52)", color: "#eef1f7", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  {flash} ✅
                </span>
              )}
            </div>
            <div className="grid w-full grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={chooseFair}
                disabled={flash !== null}
                className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] disabled:opacity-70"
              >
                <span className="flex-1 text-sm font-semibold text-white">{dec.fair}</span>
              </button>
              <button
                type="button"
                onClick={chooseStatusQuo}
                disabled={flash !== null}
                className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] disabled:opacity-70"
              >
                <span className="flex-1 text-sm font-semibold text-white/85">{dec.statusQuo}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
}
