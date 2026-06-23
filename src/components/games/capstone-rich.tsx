"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, RotateCcw, Check, ArrowRight, ChevronUp } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  type CapstoneConfig, type CapLap, type CapRecap, type CapReflect,
  type CapMatchLap, type CapSortLap, type CapBuildLap, type CapSpotLap, type CapSwipeLap, type CapGalleryLap, type CapBranchLap, type CapStrikeLap, type CapRolePlayLap,
  glyphEmoji,
} from "@/content/games/capstone-schema";

// Shared rich capstone engine ("Capstone format v1") — the chapter graduation as a joyful, no-fail, no-score
// celebration: arrive & bloom → look back (the sticker gallery) → play back (victory laps, each a chapter
// truth re-cued through a different mechanic) → reflect (non-judged) → celebrate (certificate + graduation
// glyph). Driven by a typed Landing config (content/games/capstone-N.ts). Reused by c1 (the reference) and c2.
// Every lap is celebratory: a "wrong" tap is a gentle nudge, never a buzzer.

const shuffle = <T,>(a: T[]): T[] => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);

const card = "glass-card rounded-2xl backdrop-blur-[12px] backdrop-saturate-150";
const NextBtn = ({ onClick, label = "Next" }: { onClick: () => void; label?: string }) => (
  <button type="button" onClick={onClick} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">
    {label} <ArrowRight className="size-5" aria-hidden />
  </button>
);

// — Arrival —
function ArrivalView({ config, say, onNext }: { config: CapstoneConfig; say: (t: string) => void; onNext: () => void }) {
  useEffect(() => { say(config.arrival); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={`${card} flex flex-col items-center gap-3 px-5 py-7 text-center`}>
        <span className="text-6xl" aria-hidden>🎉</span>
        <p className="font-display text-lg font-bold text-foreground">{config.canvasPayoff}</p>
      </div>
      <NextBtn onClick={onNext} label="Let's look back! ✨" />
    </>
  );
}

// — Gallery (look back): tap each chapter flag to hear its big truth —
function GalleryLap({ lap, recap, say, onNext }: { lap: CapGalleryLap; recap: CapRecap[]; say: (t: string) => void; onNext: () => void }) {
  const flags = useMemo(() => lap.stickers.map((g) => recap.find((r) => r.glyph === g)).filter(Boolean) as CapRecap[], [lap, recap]);
  const [lit, setLit] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tap = (r: CapRecap) => {
    if (lit.has(r.glyph)) { say(r.bigTruth); return; }
    const nx = new Set(lit); nx.add(r.glyph); setLit(nx); celebrate("small");
    if (nx.size >= flags.length) { setSolved(true); celebrate("big"); say(`${r.bigTruth} ${lap.celebrate}`); }
    else say(r.bigTruth);
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        {flags.map((r) => (
          <button key={r.glyph} type="button" onClick={() => tap(r)} className={`${card} flex flex-col items-center gap-1.5 px-3 py-4 text-center transition-transform active:scale-[0.97] ${lit.has(r.glyph) ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
            <span className="text-4xl" aria-hidden>{glyphEmoji(r.glyph)}</span>
            <span className="text-xs font-bold text-foreground">{r.game}</span>
            {lit.has(r.glyph) && <Check className="size-4 text-foreground" aria-hidden />}
          </button>
        ))}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">{lit.size} / {flags.length} · tap each flag</p>}
    </>
  );
}

// — Match: tap a left, then its right —
function MatchLap({ lap, say, onNext }: { lap: CapMatchLap; say: (t: string) => void; onNext: () => void }) {
  const rights = useMemo(() => shuffle(lap.pairs.map((p) => p.right)), [lap]);
  const [sel, setSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tapRight = (r: string) => {
    if (sel === null) return;
    if (lap.pairs[sel].right === r) {
      const nx = new Set(matched); nx.add(sel); setMatched(nx); setSel(null); setWrong(null); celebrate("small");
      if (nx.size >= lap.pairs.length) { setSolved(true); celebrate("big"); say(lap.celebrate); }
    } else { setWrong(r); setTimeout(() => setWrong(null), 600); }
  };
  return (
    <>
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-2">
          {lap.pairs.map((p, i) => (
            <button key={i} type="button" disabled={matched.has(i)} onClick={() => setSel(i)} className={`${card} px-3 py-3 text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${matched.has(i) ? "opacity-60 ring-2 ring-[var(--accent-amber)]" : sel === i ? "ring-2 ring-foreground" : ""}`}>
              {p.left}{matched.has(i) && " ✓"}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {rights.map((r) => {
            const done = lap.pairs.some((p, i) => matched.has(i) && p.right === r);
            return (
              <button key={r} type="button" disabled={done} onClick={() => tapRight(r)} className={`${card} px-3 py-3 text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${done ? "opacity-60 ring-2 ring-[var(--accent-amber)]" : wrong === r ? "ring-2 ring-[#E05C52]" : ""}`}>
                {r}{done && " ✓"}
              </button>
            );
          })}
        </div>
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">tap a card, then its match</p>}
    </>
  );
}

// — Sort: tap an item, then a bin —
function SortLap({ lap, say, onNext }: { lap: CapSortLap; say: (t: string) => void; onNext: () => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const unplaced = lap.items.filter((it) => !(it.id in placed));
  const tapBin = (binId: string) => {
    if (!sel) return;
    if (lap.key[sel] === binId) {
      const nx = { ...placed, [sel]: binId }; setPlaced(nx); setSel(null); celebrate("small");
      if (Object.keys(nx).length >= lap.items.length) { setSolved(true); celebrate("big"); say(lap.celebrate); }
    } else { say("Hmm, try the other spot!"); }
  };
  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {unplaced.map((it) => (
          <button key={it.id} type="button" onClick={() => setSel(it.id)} className={`${card} px-3 py-2 text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${sel === it.id ? "ring-2 ring-foreground" : ""}`}>{it.text}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {lap.bins.map((b) => (
          <button key={b.id} type="button" onClick={() => tapBin(b.id)} className={`${card} flex min-h-20 flex-col gap-1 p-3 text-left transition-transform active:scale-[0.98] ${sel ? "ring-2 ring-dashed ring-foreground/40" : ""}`}>
            <span className="text-xs font-bold uppercase tracking-wide text-foreground/60">{b.label}</span>
            {lap.items.filter((it) => placed[it.id] === b.id).map((it) => (
              <span key={it.id} className="rounded-lg bg-[var(--accent-amber)]/25 px-2 py-1 text-xs font-semibold text-foreground">{it.text} ✓</span>
            ))}
          </button>
        ))}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">tap an item, then where it belongs</p>}
    </>
  );
}

// — Build: tap each piece to add it (all pieces belong) —
function BuildLap({ lap, say, onNext }: { lap: CapBuildLap; say: (t: string) => void; onNext: () => void }) {
  const [added, setAdded] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const add = (p: string) => {
    if (added.includes(p)) return;
    const nx = [...added, p]; setAdded(nx); celebrate("small");
    if (nx.length >= lap.pieces.length) { setSolved(true); celebrate("big"); say(lap.celebrate); }
  };
  return (
    <>
      <div className={`${card} flex min-h-16 flex-wrap content-start gap-2 p-3`}>
        {added.length === 0 ? <span className="text-sm text-foreground/50">Tap below to add…</span> :
          added.map((p) => <span key={p} className="rounded-xl bg-[var(--accent-amber)]/25 px-3 py-1.5 text-sm font-semibold text-foreground">{p} ✓</span>)}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {lap.pieces.map((p) => (
          <button key={p} type="button" disabled={added.includes(p)} onClick={() => add(p)} className={`${card} px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${added.includes(p) ? "opacity-50" : ""}`}>{p}</button>
        ))}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">{added.length} / {lap.pieces.length} · add them all</p>}
    </>
  );
}

// — Spot: tap the on-theme items (every trick:true is a happy answer) —
function SpotLap({ lap, say, onNext }: { lap: CapSpotLap; say: (t: string) => void; onNext: () => void }) {
  const targets = useMemo(() => lap.scene.map((s, i) => (s.trick ? i : -1)).filter((i) => i >= 0), [lap]);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tap = (i: number) => {
    if (!lap.scene[i].trick) { say("That's lovely too — but find the special ones!"); return; }
    if (found.has(i)) return;
    const nx = new Set(found); nx.add(i); setFound(nx); celebrate("small");
    if (nx.size >= targets.length) { setSolved(true); celebrate("big"); say(`${lap.why} ${lap.celebrate}`); }
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        {lap.scene.map((s, i) => (
          <button key={i} type="button" onClick={() => tap(i)} className={`${card} px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${found.has(i) ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
            {s.text}{found.has(i) && " ✓"}
          </button>
        ))}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">{found.size} / {targets.length} · tap the special ones</p>}
    </>
  );
}

// — Swipe: cheer it on (one happy "swipe up") —
function SwipeLap({ lap, say, onNext }: { lap: CapSwipeLap; say: (t: string) => void; onNext: () => void }) {
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(`${lap.frame} ${lap.cue}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const cheer = () => { setSolved(true); celebrate("big"); say(`${lap.up} ${lap.celebrate}`); };
  return (
    <>
      <div className={`${card} flex flex-col items-center gap-2 px-5 py-6 text-center`}>
        <span className="text-3xl" aria-hidden>📣</span>
        <p className="font-display text-base font-bold text-foreground">{lap.cue}</p>
      </div>
      {solved ? <NextBtn onClick={onNext} /> : (
        <button type="button" onClick={cheer} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">
          <ChevronUp className="size-6" aria-hidden /> {lap.up}
        </button>
      )}
    </>
  );
}

// — Branch: "you know your move now" — pick the values-led best option (no buzzer) —
function BranchLap({ lap, say, onNext }: { lap: CapBranchLap; say: (t: string) => void; onNext: () => void }) {
  const [solved, setSolved] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const choose = (i: number) => {
    const o = lap.options[i];
    if (o.best) { setChosen(i); setSolved(true); celebrate("big"); say(`${o.consequence} ${lap.debrief} ${lap.celebrate}`); }
    else { say(o.consequence); }
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        {lap.options.map((o, i) => (
          <button key={i} type="button" disabled={solved} onClick={() => choose(i)} className={`${card} px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${solved && chosen === i ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
            {o.text}{solved && chosen === i && " ✓"}
          </button>
        ))}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">choose your move</p>}
    </>
  );
}

// — Strike-rewrite: rub out a myth you can now bust in your sleep, then see the truth (no-fail) —
function StrikeLap({ lap, say, onNext }: { lap: CapStrikeLap; say: (t: string) => void; onNext: () => void }) {
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(`${lap.frame} ${lap.myth.un}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bust = () => { setSolved(true); celebrate("big"); say(`${lap.myth.re} ${lap.myth.why} ${lap.celebrate}`); };
  return (
    <>
      <div className={`${card} flex flex-col items-center gap-2 px-5 py-6 text-center`}>
        <p className={`font-display text-base font-bold ${solved ? "text-foreground/40 line-through" : "text-foreground"}`}>{lap.myth.un}</p>
        {solved && <p className="text-sm font-semibold" style={{ color: "var(--color-grow)" }}>{lap.myth.re}</p>}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : (
        <button type="button" onClick={bust} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">
          <span aria-hidden>✏️</span> Rub out the myth
        </button>
      )}
    </>
  );
}

// — Role-play: say the line you've grown into; the values-led line cheers you on (no-fail) —
function RolePlayLap({ lap, say, onNext }: { lap: CapRolePlayLap; say: (t: string) => void; onNext: () => void }) {
  const [solved, setSolved] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  useEffect(() => { say(`${lap.frame} ${lap.setup}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const choose = (i: number) => {
    if (lap.yourLine[i].best) { setChosen(i); setSolved(true); celebrate("big"); say(lap.celebrate); }
    else { say("That's okay — try the bolder line, the one that speaks up."); }
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        {lap.yourLine.map((o, i) => (
          <button key={i} type="button" disabled={solved} onClick={() => choose(i)} className={`${card} px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${solved && chosen === i ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
            {o.text}{solved && chosen === i && " ✓"}
          </button>
        ))}
      </div>
      {solved ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">say your line</p>}
    </>
  );
}

function LapView({ lap, recap, say, onNext }: { lap: CapLap; recap: CapRecap[]; say: (t: string) => void; onNext: () => void }) {
  switch (lap.type) {
    case "gallery": return <GalleryLap lap={lap} recap={recap} say={say} onNext={onNext} />;
    case "match": return <MatchLap lap={lap} say={say} onNext={onNext} />;
    case "sort": return <SortLap lap={lap} say={say} onNext={onNext} />;
    case "build": return <BuildLap lap={lap} say={say} onNext={onNext} />;
    case "spot": return <SpotLap lap={lap} say={say} onNext={onNext} />;
    case "swipe": return <SwipeLap lap={lap} say={say} onNext={onNext} />;
    case "branch": return <BranchLap lap={lap} say={say} onNext={onNext} />;
    case "strike-rewrite": return <StrikeLap lap={lap} say={say} onNext={onNext} />;
    case "role-play": return <RolePlayLap lap={lap} say={say} onNext={onNext} />;
  }
}

// — Reflect: pick any (no wrong answer) —
function ReflectView({ reflect, say, onNext }: { reflect: CapReflect; say: (t: string) => void; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => { say(reflect.prompt); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pick = (o: string) => { setPicked(o); celebrate("small"); say(reflect.affirm); };
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        {reflect.options.map((o) => (
          <button key={o} type="button" onClick={() => pick(o)} className={`${card} px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${picked === o ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>{o}</button>
        ))}
      </div>
      {picked ? <NextBtn onClick={onNext} /> : <p className="text-center text-xs text-foreground/60">{"there's no wrong answer 💛"}</p>}
    </>
  );
}

// — Celebration: certificate + graduation glyph —
function CelebrationView({ config, say, onGraduate }: { config: CapstoneConfig; say: (t: string) => void; onGraduate: () => void }) {
  useEffect(() => { say(config.celebration.certificate); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={`${card} flex flex-col items-center gap-3 px-5 py-7 text-center`}>
        <span className="text-7xl" aria-hidden>{glyphEmoji(config.celebration.glyph)}</span>
        <p className="text-sm font-semibold text-foreground">{config.celebration.certificate}</p>
        <p className="text-xs text-foreground/70">{config.celebration.stickerBook}</p>
      </div>
      <div className={`${card} px-4 py-3`}>
        <p className="text-xs font-bold uppercase tracking-wide text-foreground/60">{"What's next"}</p>
        <p className="text-sm text-foreground">{config.preview}</p>
        <p className="mt-2 text-xs text-foreground/70">💬 {config.share}</p>
      </div>
      <button type="button" onClick={onGraduate} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">
        Get my graduation sticker! 🎓
      </button>
    </>
  );
}

export function RichCapstone({ config, onExit }: { config: CapstoneConfig; onExit: () => void }) {
  const seq = useMemo(() => [
    { kind: "arrival" as const },
    ...config.playback.map((lap) => ({ kind: "lap" as const, lap })),
    ...config.reflect.map((reflect) => ({ kind: "reflect" as const, reflect })),
    { kind: "celebration" as const },
  ], [config]);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(config.arrival);

  const say = useCallback((t: string) => { setBubble(t); speak(t, { muted }); }, [muted]);
  useEffect(() => () => stopSpeaking(), []);

  const next = () => { stopSpeaking(); setStep((s) => Math.min(s + 1, seq.length - 1)); };
  const reset = () => { stopSpeaking(); setStep(0); setDone(false); setBubble(config.arrival); say(config.arrival); };

  const tools = (
    <span className="flex items-center gap-2">
      {!muted && (
        <button type="button" aria-label="Hear it again" onClick={() => replay()} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
          <RotateCcw className="size-4" aria-hidden />
        </button>
      )}
      <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
        {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
      </button>
    </span>
  );

  if (done) {
    return (
      <GameShell title={`Capstone: ${config.capstone}`} tools={tools} onExit={onExit}>
        <GameDone gameId={config.gameId} stars={3} coins={config.coins ?? 25} title={config.doneTitle} blurb={config.preview} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  const cur = seq[step];
  return (
    <GameShell title={`Capstone: ${config.capstone}`} tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <div className="flex items-center gap-3">
          <Sam size={64} />
          <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-1" aria-label={`step ${step + 1} of ${seq.length}`}>
          {seq.map((_, i) => (<span key={i} className={`size-2 rounded-full ${i < step ? "bg-foreground/60" : i === step ? "bg-[var(--accent-amber)]" : "bg-foreground/20"}`} aria-hidden />))}
        </div>
        {cur.kind === "arrival" && <ArrivalView config={config} say={say} onNext={next} />}
        {cur.kind === "lap" && <LapView key={cur.lap.id} lap={cur.lap} recap={config.recap} say={say} onNext={next} />}
        {cur.kind === "reflect" && <ReflectView key={cur.reflect.id} reflect={cur.reflect} say={say} onNext={next} />}
        {cur.kind === "celebration" && <CelebrationView config={config} say={say} onGraduate={() => setDone(true)} />}
      </div>
    </GameShell>
  );
}
