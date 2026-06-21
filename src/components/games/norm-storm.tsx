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
  NORMS, GATED_NORM, SORT_MISS, KEEP_GOOD, RIGHTS_TRUMP, RIGHTS_CARDS, NORMS_CHANGED,
  KEEP_CHOICES, QUESTION_CHOICES, BADGE_TARGET, SAM, type Bin, type Norm,
} from "@/content/games/norm-storm";

type Mode = "home" | "sort" | "keepGood" | "rightsTrump" | "normsChange" | "myVoice";
const MODES: [Mode, string, string][] = [
  ["sort", "🌀", "Sort the Norm"],
  ["keepGood", "💚", "Keep the Good"],
  ["rightsTrump", "⚖️", "Rights Trump Harm"],
  ["normsChange", "🔄", "Norms Change"],
  ["myVoice", "🗣️", "My Voice"],
];
const BINS: [Bin, string, string][] = [["help", "💚", "Help"], ["depends", "🤔", "Depends"], ["harm", "⛔", "Harm"]];

export function NormStormGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [sortIdx, setSortIdx] = useState(0);
  const [goodGot, setGoodGot] = useState<Set<number>>(new Set());
  const [busted, setBusted] = useState(false);
  const [changeGot, setChangeGot] = useState<Set<number>>(new Set());
  const [keepPick, setKeepPick] = useState<number | null>(null);
  const [questionPick, setQuestionPick] = useState<number | null>(null);

  // The most sensitive norm is included only in the fuller (non-School-Comfort) setting.
  const deck: Norm[] = useMemo(() => (profile.schoolComfort ? NORMS : [...NORMS, GATED_NORM]), [profile.schoolComfort]);

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
    setBadges(new Set()); setSortIdx(0); setGoodGot(new Set()); setBusted(false); setChangeGot(new Set());
    setKeepPick(null); setQuestionPick(null); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "sort") { setSortIdx(0); say(SAM.sort); }
    else if (m === "keepGood") say(SAM.keepGood);
    else if (m === "rightsTrump") { setBusted(false); say(SAM.rightsTrump); }
    else if (m === "normsChange") say(SAM.normsChange);
    else if (m === "myVoice") { setKeepPick(null); setQuestionPick(null); say(SAM.myVoice); }
    else say(SAM.home);
  };

  const sortNorm = (bin: Bin) => {
    const n = deck[sortIdx];
    if (bin !== n.bin) { say(SORT_MISS); return; }
    celebrate("small");
    say(n.reason, () => { if (sortIdx + 1 >= deck.length) { earn("sort"); go("home"); } else setSortIdx((i) => i + 1); });
  };

  const tapGood = (i: number) => {
    if (goodGot.has(i)) return;
    const next = new Set(goodGot); next.add(i);
    setGoodGot(next); say(KEEP_GOOD[i].say); celebrate("small");
    if (next.size >= KEEP_GOOD.length) earn("keepGood");
  };
  const tapChange = (i: number) => {
    if (changeGot.has(i)) return;
    const next = new Set(changeGot); next.add(i);
    setChangeGot(next); say(NORMS_CHANGED[i].say); celebrate("small");
    if (next.size >= NORMS_CHANGED.length) earn("normsChange");
  };

  const pickKeep = (i: number) => { setKeepPick(i); maybeVoice(i, questionPick); };
  const pickQuestion = (i: number) => { setQuestionPick(i); maybeVoice(keepPick, i); };
  const maybeVoice = (k: number | null, q: number | null) => {
    if (k !== null && q !== null) {
      celebrate("small");
      say(`You'd keep “${KEEP_CHOICES[k]}” and respectfully question ${QUESTION_CHOICES[q]}. Well reasoned!`, () => earn("myVoice"));
    }
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
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: { emoji: string; say: string }[], got: Set<number>, onTap: (i: number) => void, ring: string) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: `inset 0 0 0 2px ${ring}` } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-foreground">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-foreground" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Norm Storm" tools={tools} onExit={onExit}>
        <GameDone gameId="norm-storm" stars={3} coins={25} title="Storm calmed! 🌪️" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Norm Storm" tools={tools} onExit={onExit}>
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

        {/* Sort the Norm — Help / Depends / Harm */}
        {mode === "sort" && deck[sortIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{deck[sortIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{deck[sortIdx].text}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BINS.map(([b, emoji, label]) => (
                <button key={b} type="button" onClick={() => sortNorm(b)} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] transition-transform active:scale-[0.96]">
                  <span className="text-2xl" aria-hidden>{emoji}</span>
                  <span className="text-xs font-bold text-foreground">{label}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-foreground/60">{sortIdx + 1} / {deck.length} · your reason matters most</p>
            {HomeBtn}
          </>
        )}

        {mode === "keepGood" && (<>{TapList(KEEP_GOOD, goodGot, tapGood, "#22C55E")}<p className="text-center text-xs text-foreground/60">{goodGot.size} / {KEEP_GOOD.length}</p>{HomeBtn}</>)}
        {mode === "normsChange" && (<>{TapList(NORMS_CHANGED, changeGot, tapChange, "#7C3AED")}<p className="text-center text-xs text-foreground/60">{changeGot.size} / {NORMS_CHANGED.length}</p>{HomeBtn}</>)}

        {/* Rights Trump Harm (UN & RE) */}
        {mode === "rightsTrump" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>🌪️</span>
              <p className={`font-display text-lg font-bold ${busted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={busted ? undefined : { color: "#ff9085" }}>{RIGHTS_TRUMP.norm}</p>
            </div>
            {!busted ? (
              <>
                <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-foreground/55">Rights cards: every child's right to {RIGHTS_CARDS.join(" · ")}</p>
                <button type="button" onClick={() => { setBusted(true); celebrate("small"); say(RIGHTS_TRUMP.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">⚖️ Play a Rights Card</button>
              </>
            ) : (
              <>
                <UnReBeat un={RIGHTS_TRUMP.un} re={RIGHTS_TRUMP.re} />
                <button type="button" onClick={() => { earn("rightsTrump"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* My Voice — keep one, question one */}
        {mode === "myVoice" && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/65">One tradition I'd keep 💚</p>
            <div className="grid grid-cols-1 gap-2">
              {KEEP_CHOICES.map((c, i) => (
                <button key={i} type="button" onClick={() => pickKeep(i)} className="glass-card rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={keepPick === i ? { boxShadow: "inset 0 0 0 2px #22C55E" } : undefined}>{c}</button>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/65">One I'd respectfully question 🤔</p>
            <div className="grid grid-cols-1 gap-2">
              {QUESTION_CHOICES.map((c, i) => (
                <button key={i} type="button" onClick={() => pickQuestion(i)} className="glass-card rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={questionPick === i ? { boxShadow: "inset 0 0 0 2px #F59E0B" } : undefined}>{c}</button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
