"use client";

import { useCallback, useMemo, useState } from "react";
import { Volume2, VolumeX, Megaphone, ScrollText, Check, ArrowRight, TrendingUp } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { CAMPAIGNS, BUDGET, type Campaign } from "@/content/games/change-makers";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function ChangeMakersGame({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"issue" | "plan" | "pushback" | "result">("issue");
  const [camp, setCamp] = useState<Campaign | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bonus, setBonus] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);

  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  const chosen = useMemo(() => (camp ? camp.actions.filter((a) => selected.has(a.id)) : []), [camp, selected]);
  const spent = chosen.reduce((s, a) => s + a.cost, 0);
  const left = BUDGET - spent;
  const baseImpact = chosen.reduce((s, a) => s + a.impact, 0);
  const laws = chosen.map((a) => a.law).filter((l): l is string => !!l);
  const impact = clamp(baseImpact + bonus);

  const pickIssue = (c: Campaign) => {
    setCamp(c);
    setPhase("plan");
    say(`Campaign: ${c.title}. Spend your action points wisely.`);
  };

  const toggle = (id: string, cost: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (cost > left) return prev; // can't afford
        next.add(id);
      }
      return next;
    });
  };

  const launch = () => {
    if (!chosen.length || !camp) return;
    setPhase("pushback");
    say(camp.pushback.quote);
  };

  const standFirm = () => {
    if (!camp) return;
    setBonus(camp.pushback.firmBonus);
    setPhase("result");
    celebrate("big");
    say(`${camp.pushback.firm} Campaign succeeded!`);
  };

  const backDown = () => {
    setBonus(-8);
    setPhase("result");
    say("You backed down. The campaign still helped, a little.");
  };

  const reset = () => {
    setPhase("issue");
    setCamp(null);
    setSelected(new Set());
    setBonus(0);
    setDone(false);
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
      <GameShell title="Change Makers" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="change-makers"
          stars={3}
          coins={15}
          title="You moved your community!"
          blurb="Real change runs on rights, laws and supporting people — not just slogans. 📣"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  // ---- pick an issue ----
  if (phase === "issue") {
    return (
      <GameShell title="Change Makers" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <span className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150">
            <Megaphone className="size-4" aria-hidden /> Pick a cause to lead
          </span>
          <div className="grid w-full grid-cols-1 gap-2.5">
            {CAMPAIGNS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => pickIssue(c)}
                className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
              >
                <span className="text-3xl" aria-hidden>
                  {c.emoji}
                </span>
                <span className="flex-1 text-base font-bold text-white">{c.title}</span>
              </button>
            ))}
          </div>
        </div>
      </GameShell>
    );
  }

  // ---- result ----
  if (phase === "result") {
    const win = impact >= 60;
    return (
      <GameShell title="Change Makers" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <span className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold backdrop-blur-md backdrop-saturate-150">
            <TrendingUp className="size-4" aria-hidden /> Community impact
          </span>
          <div className="glass-pill w-full rounded-2xl px-4 py-3 backdrop-blur-md backdrop-saturate-150">
            <div className="mb-1 flex items-center justify-between text-xs font-bold">
              <span>{camp?.title}</span>
              <span className="tabular-nums">{impact}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${impact}%`, background: "var(--flag-green)" }} />
            </div>
            <p className="mt-2 text-sm font-semibold">{win ? "Campaign succeeded! 🎉" : "A real start — keep building."}</p>
          </div>

          {laws.length > 0 && (
            <div className="flex w-full flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">Rights & laws unlocked</span>
              {laws.map((l) => (
                <span
                  key={l}
                  className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold backdrop-blur-md backdrop-saturate-150"
                  style={{ background: "rgba(10,102,46,0.5)", border: "1px solid rgba(255,255,255,0.18)", color: "#eef1f7" }}
                >
                  <ScrollText className="size-4 shrink-0" aria-hidden /> {l}
                </span>
              ))}
            </div>
          )}

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

  // ---- pushback ----
  if (phase === "pushback" && camp) {
    return (
      <GameShell title="Change Makers" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <span className="glass-pill rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide backdrop-blur-md backdrop-saturate-150">
            Pushback
          </span>
          <div className="glass-card flex w-full items-center justify-center px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
            <p className="font-display text-lg font-bold text-white">{camp.pushback.quote}</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={standFirm}
              className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
            >
              <span className="flex-1 text-sm font-semibold text-white">Stand firm: {camp.pushback.firm}</span>
            </button>
            <button
              type="button"
              onClick={backDown}
              className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]"
            >
              <span className="flex-1 text-sm font-semibold text-white/85">Back down to avoid trouble</span>
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  // ---- plan (allocate the budget) ----
  return (
    <GameShell title="Change Makers" tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div className="glass-pill flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-bold backdrop-blur-md backdrop-saturate-150">
          <span>⚡ Action points: {left}/{BUDGET}</span>
          <span className="text-xs">Impact +{baseImpact}</span>
        </div>

        <div className="grid w-full grid-cols-1 gap-2">
          {camp?.actions.map((a) => {
            const on = selected.has(a.id);
            const afford = a.cost <= left || on;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id, a.cost)}
                disabled={!afford}
                className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] ${
                  on ? "ring-2 ring-white/70" : ""
                } ${!afford ? "opacity-45" : ""}`}
              >
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-white">{a.label}</span>
                  <span className="text-[11px] font-medium text-white/75">
                    {a.cost} pt{a.cost > 1 ? "s" : ""} · +{a.impact} impact{a.law ? ` · unlocks ${a.law}` : ""}
                  </span>
                </span>
                {on && <Check className="size-5 shrink-0 text-white" aria-hidden />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={launch}
          disabled={chosen.length === 0}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50"
        >
          Launch campaign 🚀
        </button>
      </div>
    </GameShell>
  );
}
