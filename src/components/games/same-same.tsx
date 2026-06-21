"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Wand2, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { MakeAKid } from "@/components/games/make-a-kid";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { PAIRS, GARDEN_TARGET, SAM } from "@/content/games/same-same";

const FLOWERS = ["🌸", "🌼", "🌷", "🌻", "🌺", "🪷"];

export function SameSameGame({ onExit }: { onExit: () => void }) {
  const [pairIdx, setPairIdx] = useState(0);
  const [phase, setPhase] = useState<"share" | "diff">("share");
  const [tappedSame, setTappedSame] = useState<Set<number>>(new Set());
  const [tappedDiff, setTappedDiff] = useState<Set<number>>(new Set());
  const [mythPopped, setMythPopped] = useState(false);
  const [friendships, setFriendships] = useState(0);
  const [mode, setMode] = useState<"play" | "make">("play");
  const [bubble, setBubble] = useState(SAM.greet);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);

  const pair = PAIRS[pairIdx];
  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setPairIdx(0); setPhase("share"); setTappedSame(new Set()); setTappedDiff(new Set());
    setMythPopped(false); setFriendships(0); setMode("play"); setDone(false);
    say(SAM.greet);
  };

  const bloom = () => setFriendships((f) => Math.min(GARDEN_TARGET, f + 1));

  const tapSame = (i: number) => {
    if (tappedSame.has(i)) return;
    const next = new Set(tappedSame); next.add(i);
    setTappedSame(next);
    celebrate("small"); // a glowing friendship thread
    if (next.size >= pair.same.length) {
      bloom();
      say(`${pair.same[i].say} ${SAM.friends}`, () => { setPhase("diff"); say(SAM.diff); });
    } else {
      say(pair.same[i].say);
    }
  };

  const tapDiff = (i: number) => {
    if (tappedDiff.has(i)) return;
    const next = new Set(tappedDiff); next.add(i);
    setTappedDiff(next);
    celebrate("small");
    say(pair.different[i].say);
  };

  const popMyth = () => {
    if (mythPopped || !pair.myth) return;
    setMythPopped(true);
    celebrate("small");
    say(`${pair.myth.right}`);
  };

  const nextPair = () => {
    if (friendships >= GARDEN_TARGET) { say(SAM.complete, () => setDone(true)); return; }
    setPairIdx((p) => p + 1);
    setPhase("share"); setTappedSame(new Set()); setTappedDiff(new Set()); setMythPopped(false);
    say(SAM.next);
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

  const Garden = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${friendships} of ${GARDEN_TARGET} friends`}>
      {Array.from({ length: GARDEN_TARGET }).map((_, i) => (
        <span key={i} className={`text-2xl ${i < friendships ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{i < friendships ? FLOWERS[i % FLOWERS.length] : "🌱"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Same Same, Different" tools={tools} onExit={onExit}>
        <GameDone gameId="same-same" stars={3} coins={15} title="So many ways we're the same!" blurb="Same inside, and different is wonderful. 🌈" onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  // ---- Make-a-Friend (shared inclusive builder) ----
  if (mode === "make") {
    return (
      <GameShell title="Same Same, Different" tools={tools} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
          {SamSays}
          <MakeAKid
            ctaLabel="Add my friend to the garden"
            onAdd={(cando) => { bloom(); say(`${SAM.friends} They can ${cando}`, () => setMode("play")); }}
          />
        </div>
      </GameShell>
    );
  }

  // ---- Discover ----
  return (
    <GameShell title="Same Same, Different" progress={{ current: friendships, total: GARDEN_TARGET }} tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {Garden}

        {/* the two friends, with friendship threads filling between them */}
        <div className="flex items-center gap-2">
          <div className="glass-card flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] backdrop-saturate-150">
            <span className="text-5xl" aria-hidden>{pair.left.emoji}</span>
            <span className="text-xs font-bold text-foreground">{pair.left.name}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5" aria-hidden>
            {phase === "diff" || tappedSame.size >= pair.same.length ? (
              <span className="text-2xl animate-in zoom-in">🤝</span>
            ) : (
              pair.same.map((_, i) => (
                <span key={i} className="text-lg leading-none transition-all">{i < tappedSame.size ? "❤️" : "🤍"}</span>
              ))
            )}
          </div>
          <div className="glass-card flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] backdrop-saturate-150">
            <span className="text-5xl" aria-hidden>{pair.right.emoji}</span>
            <span className="text-xs font-bold text-foreground">{pair.right.name}</span>
          </div>
        </div>

        {/* myth bubble to pop (gentle anti-stereotype — the seed of Unlearn → Relearn → Grow) */}
        {phase === "share" && pair.myth && !mythPopped && (
          <button type="button" onClick={popMyth} className="glass-pill mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-90" style={{ color: "#ff9085" }}>
            💬 “{pair.myth.wrong}” — tap to pop! 💥
          </button>
        )}

        {/* tappable traits — every tap is kind, none are wrong */}
        <div className="grid w-full grid-cols-1 gap-2.5">
          {(phase === "share" ? pair.same : pair.different).map((t, i) => {
            const tapped = (phase === "share" ? tappedSame : tappedDiff).has(i);
            return (
              <button key={`${pairIdx}-${phase}-${i}`} type="button" disabled={tapped} onClick={() => (phase === "share" ? tapSame(i) : tapDiff(i))} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] ${tapped ? "opacity-80 ring-2 ring-foreground/60" : ""}`}>
                <span className="text-3xl" aria-hidden>{t.emoji}</span>
                <span className="flex-1 text-base font-semibold text-foreground">{t.say}</span>
                {tapped && <Check className="size-5 text-foreground" aria-hidden />}
              </button>
            );
          })}
        </div>

        {/* in the "different" celebration, offer Make-a-Friend + the next pair */}
        {phase === "diff" && (
          <div className="flex gap-2.5">
            <button type="button" onClick={() => { setMode("make"); say(SAM.make); }} className="glass-pill flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
              <Wand2 className="size-4" aria-hidden /> Make a Friend
            </button>
            <button type="button" onClick={nextPair} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-sm font-bold text-slate-900 transition-transform active:scale-95">
              {friendships >= GARDEN_TARGET ? "Finish" : "Next friends"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
