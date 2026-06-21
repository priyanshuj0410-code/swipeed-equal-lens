"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, RotateCcw, Star } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { RECAP, SAM } from "@/content/games/capstone-5";

// Capstone 5 — the Chapter 5 (ages 15–18) graduation AND the final graduation of the whole journey. Tap
// each of the eight "big ideas" to light a star; when all shine, Sam graduates the player into the world.
// Mirrors Capstones 1–4, with the biggest celebration. Sam appears fully grown.
export function CapstoneFiveGame({ onExit }: { onExit: () => void }) {
  const [lit, setLit] = useState<Set<number>>(new Set());
  const [bubble, setBubble] = useState(SAM.greet);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => { setLit(new Set()); setDone(false); say(SAM.greet); };

  const tap = (i: number) => {
    if (lit.has(i)) return;
    const next = new Set(lit); next.add(i);
    setLit(next);
    celebrate("small");
    if (next.size >= RECAP.length) {
      celebrate("big");
      window.setTimeout(() => celebrate("big"), 500);
      say(`${RECAP[i].sam} ${SAM.graduate}`, () => setDone(true));
    } else {
      say(RECAP[i].sam);
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

  if (done) {
    return (
      <GameShell title="Capstone: Ready for the World" tools={tools} onExit={onExit}>
        <GameDone gameId="capstone-5" stars={3} coins={50} title="🎓🌟 The whole journey complete!" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Capstone: Ready for the World" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <div className="flex items-center gap-3">
          <Sam size={64} />
          <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
        </div>

        {/* the graduation stars */}
        <div className="glass-card flex justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${lit.size} of ${RECAP.length} stars`}>
          {RECAP.map((_, i) => (
            <Star key={i} className={`size-5 ${lit.has(i) ? "animate-in zoom-in duration-300" : ""}`} style={{ color: lit.has(i) ? "var(--accent-amber)" : "rgba(34,20,54,0.28)" }} fill={lit.has(i) ? "currentColor" : "none"} aria-hidden />
          ))}
        </div>

        {/* the eight big ideas to light up */}
        <div className="grid grid-cols-1 gap-2.5">
          {RECAP.map((r, i) => (
            <button key={i} type="button" disabled={lit.has(i)} onClick={() => tap(i)} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] ${lit.has(i) ? "opacity-80 ring-2 ring-foreground/60" : ""}`}>
              <span className="text-3xl" aria-hidden>{r.emoji}</span>
              <span className="flex-1 text-sm font-semibold text-foreground">{r.idea}</span>
              {lit.has(i) && <Star className="size-5 shrink-0" style={{ color: "var(--accent-amber)" }} fill="currentColor" aria-hidden />}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
