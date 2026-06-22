"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Home, Wind, RotateCcw, Sparkles, Heart, Users } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { ToolMoment } from "@/components/toolkit/tool-moment";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  SCENARIOS, byCat, FEELING_FACES, MOVES, MOVE_BY_ID, CALM_STEPS, CALM_CYCLES, SAM,
  type Scenario, type Cat,
} from "@/content/games/feelings-friends";

const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const faceOf = (opt: string) => FEELING_FACES[opt.trim().toLowerCase()];

// Feelings Friends (g01) — reworked to GDD 01. Six verb-moves (Name it · It's okay UN→RE · Calm it ·
// How do they feel? · Big No · I can help) over the 88-scenario library, run as the micro-loop
// (Hook → Play → UN→RE → Apply → Sticker) and rotated so no beat repeats. Keeps & deepens the Calm
// Corner breath + the tactile Big No. No hard fail (a wrong tap = gentle "let's look again"); audio-first;
// optional grown-up co-play; Get Help one tap away (GameShell). gameId "feelings" — records once + levels Cool-Down.
export function FeelingsFriendsGame({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<"home" | "play" | "done">("home");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"ask" | "right" | "wrong" | "breathe">("ask");
  const [opts, setOpts] = useState<string[]>([]); // options shuffled per scenario (library lists answer first)
  const [stickers, setStickers] = useState<Set<Cat>>(new Set());
  const [bubble, setBubble] = useState(SAM.greet);
  const [muted, setMuted] = useState(false);
  // Calm Mode is the app-wide setting: the store syncs profile.calmMode → juice.setCalm(), so toggling it
  // here actually drives prefersReducedMotion() (suppressing confetti + motion), not just the breath cycles.
  const { profile, setCalmMode } = useProfile();
  const calmMode = profile.calmMode ?? false;
  const [coplay, setCoplay] = useState(false);
  const [breath, setBreath] = useState<"idle" | "in" | "out">("idle");
  const calmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sc = queue[qi];

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => { if (calmTimer.current) clearTimeout(calmTimer.current); stopSpeaking(); };
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const present = useCallback((s: Scenario) => {
    setPhase("ask"); setBreath("idle"); setOpts(shuffle(s.options)); // vary the correct slot
    say(`${s.situation} ${s.prompt}`);
  }, [say]);

  const startRotate = () => {
    // one fresh scenario per move, in move order → consecutive rounds are always a different beat
    const q = MOVES.map((m) => shuffle(byCat(m.id))[0]).filter(Boolean) as Scenario[];
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };
  const startMove = (cat: Cat) => {
    const q = shuffle(byCat(cat)).slice(0, 3);
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };

  const earn = (cat: Cat) => setStickers((prev) => (prev.has(cat) ? prev : new Set(prev).add(cat)));

  // the deepened Calm Corner — flower in / candle out, the calm move's "Apply"
  const breathe = (onDone: () => void) => {
    const cycles = calmMode ? 2 : CALM_CYCLES;
    let c = 0;
    const stepIn = () => { setBreath("in"); say(CALM_STEPS[0].say); calmTimer.current = setTimeout(stepOut, CALM_STEPS[0].ms); };
    const stepOut = () => {
      setBreath("out"); say(CALM_STEPS[1].say);
      calmTimer.current = setTimeout(() => { c += 1; if (c >= cycles) { setBreath("idle"); onDone(); } else stepIn(); }, CALM_STEPS[1].ms);
    };
    setPhase("breathe"); calmTimer.current = setTimeout(stepIn, 600);
  };

  const land = (s: Scenario) => {
    earn(s.cat);
    setPhase("right");
    say(s.relearn);
    if (!muted) try { navigator.vibrate?.(s.cat === "big-no" ? [16, 40, 16] : 12); } catch { /* unsupported */ }
  };

  const choose = (s: Scenario, opt: string) => {
    if (phase !== "ask") return;
    if (opt !== s.answer) { setPhase("wrong"); say(SAM.nudge); return; }
    celebrate("small");
    // Apply: the calm move always breathes with Lensy; every other move lands on the relearn
    if (s.cat === "calm") breathe(() => land(s));
    else land(s);
  };

  const next = () => {
    if (calmTimer.current) clearTimeout(calmTimer.current);
    const ni = qi + 1;
    if (ni < queue.length) { setQi(ni); present(queue[ni]); return; }
    if (stickers.size >= MOVES.length) { celebrate("big"); say(SAM.complete, () => setView("done")); }
    else { setView("home"); say(SAM.home); }
  };

  const reset = () => {
    if (calmTimer.current) clearTimeout(calmTimer.current);
    setStickers(new Set()); setQueue([]); setQi(0); setPhase("ask"); setBreath("idle"); setView("home"); say(SAM.greet);
  };

  // ---- chrome ----
  const muteBtn = (
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );
  const tools = (
    <span className="flex items-center gap-2">
      <button type="button" aria-label={calmMode ? "Calm mode on" : "Calm mode off"} aria-pressed={calmMode} onClick={() => setCalmMode(!calmMode)} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95" style={calmMode ? { boxShadow: "inset 0 0 0 2px var(--color-insight)" } : undefined}>
        <Sparkles className="size-4" aria-hidden />
      </button>
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
  const StickerBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${stickers.size} of ${MOVES.length} stickers`}>
      {MOVES.map((m) => (
        <span key={m.id} className={`grid size-9 place-items-center rounded-full text-xl ${stickers.has(m.id) ? (calmMode ? "" : "animate-in zoom-in duration-300") : "opacity-30"}`} style={{ background: stickers.has(m.id) ? "var(--color-sun)" : "transparent", boxShadow: stickers.has(m.id) ? "inset 0 0 0 2px var(--color-ink)" : "inset 0 0 0 2px var(--color-mist)" }} aria-hidden>{stickers.has(m.id) ? m.emoji : "·"}</span>
      ))}
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => { if (calmTimer.current) clearTimeout(calmTimer.current); setView("home"); say(SAM.home); }} className="glass-pill mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );

  if (view === "done") {
    return (
      <GameShell title="Feelings Friends" tools={tools} onExit={onExit}>
        <GameDone gameId="feelings" stars={3} coins={15} title="Your Feelings Book is full! 🎉" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  // option tile — a feeling-face where the option is a feeling, else a kind text tile (colour never the only signal)
  const Tile = (opt: string, onTap: () => void, big = false) => {
    const f = faceOf(opt);
    return (
      <button key={opt} type="button" onClick={onTap} className={`glass-card flex items-center gap-3 rounded-2xl text-left font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] ${big ? "flex-col justify-center px-3 py-5 text-center" : "px-4 py-3.5"}`} style={f ? { boxShadow: `inset 0 0 0 2.5px ${f.color}` } : undefined}>
        {f && <span className={big ? "text-5xl" : "text-3xl"} aria-hidden>{f.emoji}</span>}
        <span className={big ? "text-sm capitalize" : "flex-1 text-[15px]"}>{opt}</span>
      </button>
    );
  };

  return (
    <GameShell title="Feelings Friends" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {StickerBook}
        {coplay && view === "play" && sc && (
          <div className="glass-pill flex items-start gap-2 rounded-2xl px-3 py-2 text-sm font-medium backdrop-blur-md" style={{ color: "var(--color-ink)" }}>
            <Users className="mt-0.5 size-4 shrink-0" aria-hidden /> <span>{MOVE_BY_ID[sc.cat].coplay}</span>
          </div>
        )}

        {/* ---------- HOME ---------- */}
        {view === "home" && (
          <>
            <button type="button" onClick={startRotate} className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-extrabold text-slate-900 transition-transform active:scale-[0.98]">
              <Heart className="size-6" aria-hidden /> Play with Lensy
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              {MOVES.map((m) => (
                <button key={m.id} type="button" onClick={() => startMove(m.id)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]" style={stickers.has(m.id) ? { boxShadow: "inset 0 0 0 2px var(--color-sun)" } : undefined}>
                  <span className="text-4xl" aria-hidden>{m.emoji}</span>
                  <span className="text-center text-sm font-bold text-foreground">{m.label}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setCoplay((c) => !c)} className="glass-pill flex h-10 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md transition-transform active:scale-95" style={coplay ? { boxShadow: "inset 0 0 0 2px var(--color-ink)" } : undefined}>
              <Users className="size-4" aria-hidden /> Grown-up co-play {coplay ? "on" : "off"}
            </button>
          </>
        )}

        {/* ---------- PLAY ---------- */}
        {view === "play" && sc && (
          <>
            {/* the situation card (Hook) */}
            {phase !== "breathe" && (
              <div className="glass-card flex flex-col items-center gap-1.5 rounded-2xl px-5 py-5 text-center backdrop-blur-[12px] backdrop-saturate-150">
                <span className="text-3xl" aria-hidden>{MOVE_BY_ID[sc.cat].emoji}</span>
                <p className="font-display text-base font-bold text-foreground">{sc.situation}</p>
                <p className="text-sm font-semibold text-foreground/70">{sc.prompt}</p>
              </div>
            )}

            {/* Calm Corner — the deepened breathe-with-Lensy (the calm move's Apply) */}
            {phase === "breathe" && (
              <div className="glass-card flex flex-col items-center gap-4 rounded-2xl px-5 py-8 backdrop-blur-[12px] backdrop-saturate-150">
                <div className="grid place-items-center rounded-full" style={{ width: 130, height: 130, background: "radial-gradient(circle, rgba(98,184,75,0.45), rgba(98,184,75,0.12))", transform: `scale(${breath === "in" ? 1.35 : breath === "out" ? 0.7 : 1})`, transition: `transform ${CALM_STEPS[0].ms}ms ease-in-out` }} aria-hidden>
                  <span className="text-5xl">{breath === "out" ? "🕯️" : "🌸"}</span>
                </div>
                <p className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Wind className="size-5" aria-hidden />{breath === "in" ? "Smell the flower…" : breath === "out" ? "Blow the candle…" : "Breathe with Lensy"}</p>
              </div>
            )}

            {/* the interaction (Play) — only while asking */}
            {phase === "ask" && (
              <>
                {sc.cat === "big-no" ? (
                  // Big No — a big tactile button for the brave No; the other option stays small
                  <div className="flex flex-col gap-2.5">
                    <button type="button" onClick={() => choose(sc, sc.answer)} className="flex flex-col items-center justify-center gap-1 rounded-3xl bg-[var(--color-grow)] py-7 text-white ring-4 ring-[var(--color-ink)]/30 transition-transform active:scale-90">
                      <span className="text-4xl" aria-hidden>✋</span>
                      <span className="px-3 text-center text-lg font-extrabold">{sc.answer}</span>
                    </button>
                    {opts.filter((o) => o !== sc.answer).map((o) => (
                      <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-semibold text-foreground/70 backdrop-blur-md transition-transform active:scale-95">{o}</button>
                    ))}
                  </div>
                ) : sc.cat === "name" || sc.mechanic === "empathy-read" ? (
                  // feeling-face tiles
                  <div className={`grid gap-2.5 ${opts.length >= 3 ? "grid-cols-3" : "grid-cols-1"}`}>
                    {opts.map((o) => Tile(o, () => choose(sc, o), opts.length >= 3))}
                  </div>
                ) : (
                  // two kind choices (all-okay / calm / empathy-act / help)
                  <div className="grid grid-cols-1 gap-2.5">{opts.map((o) => Tile(o, () => choose(sc, o)))}</div>
                )}
              </>
            )}

            {/* gentle nudge — never a fail */}
            {phase === "wrong" && (
              <button type="button" onClick={() => setPhase("ask")} className="glass-pill flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foreground backdrop-blur-md transition-transform active:scale-95">Let's look again →</button>
            )}

            {/* the truth (UN→RE on a myth, else the relearn) + Next */}
            {phase === "right" && (
              <>
                {sc.myth ? (
                  <UnReBeat un={`Some people say “${sc.myth}” — but that isn't true. Let's rub it out.`} re={sc.relearn} />
                ) : (
                  <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {sc.relearn}</div>
                )}
                {sc.cat === "calm" && <ToolMoment tool="cool-down" line="That was a Cool-Down. You can use it any time." />}
                <button type="button" onClick={next} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
                  {qi + 1 >= queue.length ? "Finish ⭐" : "Next →"}
                </button>
              </>
            )}
            <p className="text-center text-xs text-foreground/55">{qi + 1} / {queue.length}</p>
            {phase !== "breathe" && HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
