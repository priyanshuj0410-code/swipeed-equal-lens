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
  ASK_FIRST, NO_MEANS_NO, BOUNDARIES, ONLINE_SHIELDS, SHIELD_MISS, RED_FLAGS, ASK_BOT,
  BADGE_TARGET, SAM,
} from "@/content/games/boundary-bot";

type Mode = "home" | "askFirst" | "noMeansNo" | "myBoundaries" | "onlineShields" | "askBot";
const MODES: [Mode, string, string][] = [
  ["askFirst", "🙋", "Ask First"],
  ["noMeansNo", "🚫", "No Means No"],
  ["myBoundaries", "🧍", "My Boundaries"],
  ["onlineShields", "🛡️", "Online Shields"],
  ["askBot", "🤖", "Ask Boundary Bot"],
];

export function BoundaryBotGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [askIdx, setAskIdx] = useState(0);
  const [noBusted, setNoBusted] = useState(false);
  const [boundGot, setBoundGot] = useState<Set<number>>(new Set());
  const [shieldIdx, setShieldIdx] = useState(0);
  const [botGot, setBotGot] = useState<Set<number>>(new Set());

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
      if (next.size >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1200);
      else say(SAM.badge);
      return next;
    });
  }, [say]);

  const reset = () => {
    setBadges(new Set()); setAskIdx(0); setNoBusted(false); setBoundGot(new Set()); setShieldIdx(0); setBotGot(new Set());
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "askFirst") { setAskIdx(0); say(SAM.askFirst); }
    else if (m === "noMeansNo") { setNoBusted(false); say(SAM.noMeansNo); }
    else if (m === "myBoundaries") say(SAM.myBoundaries);
    else if (m === "onlineShields") { setShieldIdx(0); say(SAM.onlineShields); }
    else if (m === "askBot") say(SAM.askBot);
    else say(SAM.home);
  };

  const chooseAsk = (ok: boolean) => {
    const s = ASK_FIRST[askIdx];
    if (!ok) { say(s.grabResult); return; }
    celebrate("small");
    say(s.askResult, () => { if (askIdx + 1 >= ASK_FIRST.length) { earn("askFirst"); go("home"); } else setAskIdx((i) => i + 1); });
  };

  const tapBoundary = (i: number) => {
    if (boundGot.has(i)) return;
    const next = new Set(boundGot); next.add(i);
    setBoundGot(next); say(BOUNDARIES[i].say); celebrate("small");
    if (next.size >= BOUNDARIES.length) earn("myBoundaries");
  };

  const chooseShield = (ok: boolean) => {
    const p = ONLINE_SHIELDS[shieldIdx];
    if (!ok) { say(SHIELD_MISS); return; }
    celebrate("small");
    say(p.safe, () => { if (shieldIdx + 1 >= ONLINE_SHIELDS.length) { earn("onlineShields"); go("home"); } else setShieldIdx((i) => i + 1); });
  };

  const tapBot = (i: number) => {
    if (botGot.has(i)) return;
    const next = new Set(botGot); next.add(i);
    setBotGot(next); say(ASK_BOT[i].a); celebrate("small");
    if (next.size >= ASK_BOT.length) earn("askBot");
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
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} boundary badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Boundary Bot" tools={tools} onExit={onExit}>
        <GameDone gameId="boundary-bot" stars={3} coins={25} title="Boundary hero! 🤖" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Boundary Bot" tools={tools} onExit={onExit}>
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

        {/* Ask First — consent sim */}
        {mode === "askFirst" && ASK_FIRST[askIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{ASK_FIRST[askIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{ASK_FIRST[askIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button type="button" onClick={() => chooseAsk(true)} className="glass-card rounded-2xl px-4 py-3 text-base font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{ASK_FIRST[askIdx].ask}</button>
              <button type="button" onClick={() => chooseAsk(false)} className="glass-card rounded-2xl px-4 py-3 text-base font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{ASK_FIRST[askIdx].grab}</button>
            </div>
            <p className="text-center text-xs text-foreground/60">{askIdx + 1} / {ASK_FIRST.length}</p>
            {HomeBtn}
          </>
        )}

        {/* No Means No (UN & RE) */}
        {mode === "noMeansNo" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>🚫</span>
              <p className={`font-display text-lg font-bold ${noBusted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={noBusted ? undefined : { color: "#ff9085" }}>{NO_MEANS_NO.myth}</p>
            </div>
            {!noBusted ? (
              <button type="button" onClick={() => { setNoBusted(true); celebrate("small"); say(NO_MEANS_NO.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust it with UN &amp; RE</button>
            ) : (
              <>
                <UnReBeat un={NO_MEANS_NO.un} re={NO_MEANS_NO.re} />
                <button type="button" onClick={() => { earn("noMeansNo"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* My Boundaries — collect assertive words */}
        {mode === "myBoundaries" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {BOUNDARIES.map((b, i) => (
                <button key={i} type="button" onClick={() => tapBoundary(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={boundGot.has(i) ? { boxShadow: "inset 0 0 0 2px #DC2626" } : undefined}>
                  <span className="text-2xl" aria-hidden>{b.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-foreground">{b.say}</span>
                  {boundGot.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">{boundGot.size} / {BOUNDARIES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Online Shields — safe-action puzzles */}
        {mode === "onlineShields" && ONLINE_SHIELDS[shieldIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{ONLINE_SHIELDS[shieldIdx].emoji}</span>
              <p className="font-display text-base font-bold text-foreground">{ONLINE_SHIELDS[shieldIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {ONLINE_SHIELDS[shieldIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseShield(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="rounded-xl bg-foreground/5 px-3 py-2 text-center text-[11px] font-medium text-foreground/65">{RED_FLAGS}</p>
            <p className="text-center text-xs text-foreground/60">{shieldIdx + 1} / {ONLINE_SHIELDS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Ask Boundary Bot — vetted, curated Q&A; serious matters route to help */}
        {mode === "askBot" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {ASK_BOT.map((it, i) => (
                <button key={i} type="button" onClick={() => tapBot(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={botGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#DC2626"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-foreground"><span aria-hidden>{it.help ? "🆘" : "🤖"}</span> {it.q}</span>
                  {botGot.has(i) && <span className="text-sm font-medium text-foreground/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">Boundary Bot gives safe, checked answers — and never keeps your details.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
