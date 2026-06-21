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
  PERIOD_FACTS, CHANGE_FACTS, MOOD_FACTS, MOOD_FACT_OPEN, MYTHS, MYTH_UN, MYTH_MISS,
  ASK_IT, BADGE_TARGET, SAM, type Fact,
} from "@/content/games/puberty-quest";

type Mode = "home" | "periodPlace" | "changes" | "moods" | "mythMonsters" | "askIt";
const MODES: [Mode, string, string][] = [
  ["periodPlace", "🩸", "The Period Place"],
  ["changes", "📈", "Changes All Over"],
  ["moods", "🎢", "Moods & My Self"],
  ["mythMonsters", "👹", "Myth Monsters"],
  ["askIt", "📬", "Ask-It Box"],
];

export function PubertyQuestGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  // collect-list progress per area
  const [periodGot, setPeriodGot] = useState<Set<number>>(new Set());
  const [changeGot, setChangeGot] = useState<Set<number>>(new Set());
  const [moodGot, setMoodGot] = useState<Set<number>>(new Set());
  const [askGot, setAskGot] = useState<Set<number>>(new Set());
  // myth battle
  const [mIdx, setMIdx] = useState(0);
  const [mBusted, setMBusted] = useState(false);

  // Moods list grows by one factual card when School-Comfort is off (the fuller setting).
  const moodList: Fact[] = useMemo(() => (profile.schoolComfort ? MOOD_FACTS : [...MOOD_FACTS, MOOD_FACT_OPEN]), [profile.schoolComfort]);

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
    setBadges(new Set()); setPeriodGot(new Set()); setChangeGot(new Set()); setMoodGot(new Set()); setAskGot(new Set());
    setMIdx(0); setMBusted(false); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "mythMonsters") { setMIdx(0); setMBusted(false); say(SAM.mythMonsters); }
    else if (m === "periodPlace") say(SAM.periodPlace);
    else if (m === "changes") say(SAM.changes);
    else if (m === "moods") say(SAM.moods);
    else if (m === "askIt") say(SAM.askIt);
    else say(SAM.home);
  };

  const tapFact = (list: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, badgeId: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(list[i].say); celebrate("small");
    if (next.size >= list.length) earn(badgeId);
  };
  const tapPeriod = tapFact(PERIOD_FACTS, periodGot, setPeriodGot, "periodPlace");
  const tapChange = tapFact(CHANGE_FACTS, changeGot, setChangeGot, "changes");
  const tapMood = tapFact(moodList, moodGot, setMoodGot, "moods");

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(ASK_IT[i].a); celebrate("small");
    if (next.size >= ASK_IT.length) earn("askIt");
  };

  // Myth Monster battle
  const chooseFact = (ok: boolean) => {
    if (!ok) { say(MYTH_MISS); return; }
    setMBusted(true); celebrate("small"); say(MYTHS[mIdx].re);
  };
  const nextMonster = () => {
    if (mIdx + 1 >= MYTHS.length) { earn("mythMonsters"); go("home"); }
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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Valley map
    </button>
  );
  // The Puberty Pocketbook — one badge per area.
  const Pocketbook = (
    <div className="glass-card flex items-center justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} pocketbook badges`}>
      <span className="text-xl" aria-hidden>📓</span>
      <span className="mx-1 h-5 w-px bg-foreground/25" aria-hidden />
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const FactList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #0EA5E9" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Puberty Quest" tools={tools} onExit={onExit}>
        <GameDone gameId="puberty-quest" stars={3} coins={25} title="Pocketbook complete! 🌱" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Puberty Quest" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {Pocketbook}

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

        {mode === "periodPlace" && (<>{FactList(PERIOD_FACTS, periodGot, tapPeriod)}<p className="text-center text-xs text-foreground/60">{periodGot.size} / {PERIOD_FACTS.length}</p>{HomeBtn}</>)}
        {mode === "changes" && (<>{FactList(CHANGE_FACTS, changeGot, tapChange)}<p className="text-center text-xs text-foreground/60">{changeGot.size} / {CHANGE_FACTS.length}</p>{HomeBtn}</>)}
        {mode === "moods" && (<>{FactList(moodList, moodGot, tapMood)}<p className="text-center text-xs text-foreground/60">{moodGot.size} / {moodList.length}</p>{HomeBtn}</>)}

        {/* Myth Monster battle (UN & RE) */}
        {mode === "mythMonsters" && MYTHS[mIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className={`text-5xl ${mBusted ? "opacity-30" : "animate-bounce"}`} aria-hidden>{MYTHS[mIdx].emoji}</span>
              {MYTHS[mIdx].boss && !mBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
              <p className={`font-display text-lg font-bold ${mBusted ? "text-foreground/40 line-through" : ""}`} style={mBusted ? undefined : { color: "#ff9085" }}>{MYTHS[mIdx].myth}</p>
            </div>
            {mBusted ? (
              <>
                <UnReBeat un={MYTH_UN} re={MYTHS[mIdx].re} />
                <button type="button" onClick={nextMonster} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">💥 {mIdx + 1 >= MYTHS.length ? "Last one busted!" : "Next monster"}</button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {MYTHS[mIdx].facts.map((f, i) => (
                  <button key={i} type="button" onClick={() => chooseFact(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-foreground/60">Monster {mIdx + 1} / {MYTHS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Ask-It box */}
        {mode === "askIt" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {ASK_IT.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#0EA5E9"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-foreground"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-foreground/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">Ask-It is private and anonymous.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
