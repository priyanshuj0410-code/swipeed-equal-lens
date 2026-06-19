"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  DEPLOY_TOOLS, OUTBREAK_CONTAINED, MYTHS, MYTH_UN, MYTH_MISS, KIT_BASE, KIT_OPEN, TEST_TREAT,
  STIGMA, PLEDGE, HELP_LINE, BADGE_TARGET, SAM, type Fact,
} from "@/content/games/outbreak";

type Mode = "home" | "outbreak" | "spreads" | "kit" | "testTreat" | "endStigma";
const MODES: [Mode, string, string][] = [
  ["outbreak", "🦠", "Outbreak!"],
  ["spreads", "💥", "How It Spreads"],
  ["kit", "🛡️", "Your Defense Kit"],
  ["testTreat", "🧪", "Test, Treat, Live Well"],
  ["endStigma", "💚", "End the Stigma"],
];

export function OutbreakGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [deployed, setDeployed] = useState<Set<number>>(new Set());
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);
  const [kitGot, setKitGot] = useState<Set<number>>(new Set());
  const [ttGot, setTtGot] = useState<Set<number>>(new Set());
  const [stigmaBusted, setStigmaBusted] = useState(false);

  const kitList: Fact[] = useMemo(() => (profile.schoolComfort ? KIT_BASE : [...KIT_BASE, ...KIT_OPEN]), [profile.schoolComfort]);
  const spread = Math.max(0, 100 - deployed.size * Math.ceil(100 / DEPLOY_TOOLS.length));

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
    setBadges(new Set()); setDeployed(new Set()); setMIdx(0); setMBusted(false); setKitGot(new Set());
    setTtGot(new Set()); setStigmaBusted(false); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "outbreak") { setDeployed(new Set()); say(SAM.outbreak); }
    else if (m === "spreads") { setMIdx(0); setMBusted(false); say(SAM.spreads); }
    else if (m === "kit") say(SAM.kit);
    else if (m === "testTreat") say(SAM.testTreat);
    else if (m === "endStigma") { setStigmaBusted(false); say(SAM.endStigma); }
    else say(SAM.home);
  };

  const deploy = (i: number) => {
    if (deployed.has(i)) return;
    const next = new Set(deployed); next.add(i);
    setDeployed(next); say(DEPLOY_TOOLS[i].say); celebrate("small");
    if (next.size >= DEPLOY_TOOLS.length) say(OUTBREAK_CONTAINED, () => earn("outbreak"));
  };

  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapKit = tapList(kitList, kitGot, setKitGot, "kit");
  const tapTt = tapList(TEST_TREAT, ttGot, setTtGot, "testTreat");

  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMyth = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("spreads"); go("home"); }
    else { setMBusted(false); setMIdx((i) => i + 1); }
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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "#eef1f7" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Base
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Outbreak: Stop the Spread" tools={tools} onExit={onExit}>
        <GameDone gameId="outbreak" stars={3} coins={25} title="Spread stopped! 🧫" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Outbreak: Stop the Spread" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Outbreak! — deploy tools to bring the spread to zero */}
        {mode === "outbreak" && (
          <>
            <div className="glass-card flex flex-col gap-2 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
              <div className="flex items-center justify-between text-xs font-bold text-white/80"><span>🦠 Spread</span><span>{spread}%</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${spread}%`, background: "linear-gradient(90deg,#f87171,#fb923c)" }} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {DEPLOY_TOOLS.map((t, i) => (
                <button key={i} type="button" onClick={() => deploy(i)} disabled={deployed.has(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={deployed.has(i) ? { boxShadow: "inset 0 0 0 2px #059669", opacity: 0.7 } : undefined}>
                  <span className="text-2xl" aria-hidden>{t.emoji}</span>
                  <span className="flex-1 text-sm font-bold text-white">Deploy {t.label}</span>
                  {deployed.has(i) && <Check className="size-5 text-white" aria-hidden />}
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* How It Spreads (UN & RE) */}
        {mode === "spreads" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-base font-bold ${mBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTHS[mIdx].re} />
                <button type="button" onClick={nextMyth} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 {mIdx + 1 >= MYTHS.length ? "Last one busted!" : "Next myth"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTHS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-white/60">Myth {mIdx + 1} / {MYTHS.length}</p>
            {HomeBtn}
          </>
        )}

        {mode === "kit" && (<>{TapList(kitList, kitGot, tapKit)}<p className="text-center text-xs text-white/60">{kitGot.size} / {kitList.length} · they stack</p>{HomeBtn}</>)}
        {mode === "testTreat" && (<>{TapList(TEST_TREAT, ttGot, tapTt)}<p className="text-center text-xs text-white/60">{ttGot.size} / {TEST_TREAT.length}</p>{HomeBtn}</>)}

        {/* End the Stigma — UN & RE + pledge */}
        {mode === "endStigma" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>💔</span>
              <p className={`font-display text-base font-bold ${stigmaBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={stigmaBusted ? undefined : { color: "#ff9085" }}>{STIGMA.claim}</p>
            </div>
            {!stigmaBusted ? (
              <button type="button" onClick={() => { setStigmaBusted(true); celebrate("small"); say(STIGMA.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust the stigma (UN &amp; RE)</button>
            ) : (
              <>
                <UnReBeat un={STIGMA.un} re={STIGMA.re} />
                <p className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs font-medium text-white/70">{HELP_LINE}</p>
                <button type="button" onClick={() => { celebrate("big"); say(PLEDGE, () => earn("endStigma")); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">🤝 Take the anti-stigma pledge</button>
              </>
            )}
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
