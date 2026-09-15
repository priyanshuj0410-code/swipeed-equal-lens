"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, RotateCcw, Check, ChevronUp, Home } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { LensyQuestion, RevealGate, cleanLine, revealDelayMs } from "@/components/games/lensy-question";
import { AnswerCard, CornerBadge } from "@/components/games/answer-cells";
import { MatchBoard } from "@/components/games/match-board";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { prefersReducedMotion } from "@/lib/juice";
import { binStyles } from "@/components/games/v2-engine";
import { usePointerDrag, hitTestZone } from "@/components/games/interactions";
import {
  type CapstoneConfig, type CapLap, type CapRecap, type CapReflect,
  type CapMatchLap, type CapSortLap, type CapBuildLap, type CapSpotLap, type CapSwipeLap, type CapGalleryLap, type CapBranchLap, type CapStrikeLap, type CapRolePlayLap,
  glyphEmoji,
} from "@/content/games/capstone-schema";

// Shared rich capstone engine ("Capstone format v1") — the chapter graduation as a joyful, no-fail, no-score
// celebration: arrive & bloom → look back (the sticker gallery) → play back (victory laps, each a chapter
// truth re-cued through a different mechanic) → reflect (non-judged) → celebrate (certificate + graduation
// glyph). Driven by a typed Landing config (content/games/capstone-N.ts). Used by c1–c6.
//
// DESIGN PARITY (2026-06-23): the laps now inherit the post-Green-Light/Red-Light interaction model from the
// shared v2 engine — Lensy speaks in a CHAT BUBBLE (not a card); a stable THREE-ZONE layout (top progress +
// bubble · flexible middle · bottom-pinned Next + counter + tertiary Home) stops the content "dancing"; and
// the mechanics are DIRECT-MANIPULATION: swipe = drag the card up, sort = drag a chip into a big dropzone,
// match = draw a cord, strike-rewrite = scrub the myth away, build = drag onto the slate. Tap stays the verb
// for gallery / branch / role-play / spot / reflect (as in v2) and is the keyboard / screen-reader fallback for
// the gesture laps. Every lap is celebratory: a "wrong" move is a gentle nudge, never a buzzer.

const shuffle = <T,>(a: T[]): T[] => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const vibrate = (ms: number | number[]) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

const card = "glass-card rounded-2xl backdrop-blur-[12px] backdrop-saturate-150";

type LapProps<L> = { lap: L; say: (t: string, shown?: string) => void; onSolved: () => void; reduceMotion: boolean };

// — Arrival — (the bottom Next carries the CTA, so this is just the canvas-bloom card)
function ArrivalView({ config, say }: { config: CapstoneConfig; say: (t: string) => void }) {
  useEffect(() => { say(config.arrival); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className={`${card} flex flex-col items-center gap-3 px-5 py-7 text-center`}>
        <span className="text-6xl" aria-hidden>🎉</span>
        <p className="font-display text-lg font-bold text-foreground">{config.canvasPayoff}</p>
      </div>
    </div>
  );
}

// — Gallery (look back): tap each chapter flag to hear its big truth —
function GalleryLap({ lap, recap, say, onSolved }: { lap: CapGalleryLap; recap: CapRecap[] } & Omit<LapProps<CapGalleryLap>, "lap" | "reduceMotion">) {
  const flags = useMemo(() => lap.stickers.map((g) => recap.find((r) => r.glyph === g)).filter(Boolean) as CapRecap[], [lap, recap]);
  const [lit, setLit] = useState<Set<string>>(new Set());
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tap = (r: CapRecap) => {
    if (lit.has(r.glyph)) { say(r.bigTruth); return; }
    const nx = new Set(lit); nx.add(r.glyph); setLit(nx); celebrate("small");
    if (nx.size >= flags.length) { celebrate("big"); say(`${r.bigTruth} ${lap.celebrate}`); onSolved(); }
    else say(r.bigTruth);
  };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        {flags.map((r) => (
          <AnswerCard key={r.glyph} onClick={() => tap(r)} state={lit.has(r.glyph) ? "done" : "idle"} tint="var(--accent-amber)"
            className="rounded-2xl backdrop-blur-[12px] backdrop-saturate-150 flex flex-col items-center gap-1.5 px-3 py-4 text-center transition-transform active:scale-[0.97]">
            <span className="text-4xl" aria-hidden>{glyphEmoji(r.glyph)}</span>
            <span className="text-xs font-bold text-foreground">{r.game}</span>
            <Check className={`size-4 text-foreground ${lit.has(r.glyph) ? "" : "invisible"}`} aria-hidden />
          </AnswerCard>
        ))}
      </div>
      {lit.size < flags.length && <p className="text-center text-xs text-foreground/60">{lit.size} / {flags.length} · tap each flag</p>}
    </div>
  );
}

// — Match: DRAW a cord from each left card to its right card (MatchBoard, shared with the lesson engine) —
function MatchLap({ lap, say, onSolved }: Omit<LapProps<CapMatchLap>, "reduceMotion">) {
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-1 flex-col justify-start gap-2.5">
      <p className="text-center text-xs font-semibold text-foreground/60">draw a line from each card to its match</p>
      <MatchBoard
        pairs={lap.pairs}
        onMatch={(left, right, done) => { celebrate("small"); if (done) { celebrate("big"); say(lap.celebrate); onSolved(); } else say(`${left}: ${right}. ✓`); }}
        onMiss={() => say("Not a match. Try another.")}
      />
    </div>
  );
}

// — Sort: DRAG a chip into its bin (two bins → big dropzones top & bottom; tap-to-arm is the fallback) —
function SortLap({ lap, say, onSolved, reduceMotion }: LapProps<CapSortLap>) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [order] = useState(() => shuffle(lap.items));
  const [binOrder] = useState(() => shuffle(lap.bins)); // zones too, so a zone's place is never the answer
  const [sel, setSel] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const binEls = useRef<Record<string, HTMLElement | null>>({});
  const dragId = useRef<string | null>(null);
  const styles = useMemo(() => binStyles(lap.bins), [lap.bins]);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const itemText = (id: string) => lap.items.find((it) => it.id === id)?.text ?? "";
  const zones = () => lap.bins.map((b) => ({ id: b.id, el: binEls.current[b.id] }));
  const place = (itemId: string, binId: string) => {
    if (lap.key[itemId] === binId) {
      const np = { ...placed, [itemId]: binId }; setPlaced(np); setSel(null); celebrate("small");
      if (Object.keys(np).length >= lap.items.length) { celebrate("big"); say(lap.celebrate); onSolved(); }
    } else say("Try the other spot!");
  };
  const arm = (id: string) => setSel(id);
  const pointer = usePointerDrag({
    onStart: (s, e) => { const id = (e.currentTarget as HTMLElement).dataset.id ?? null; dragId.current = id; if (id) { arm(id); setDrag({ id, x: s.x, y: s.y }); } },
    onMove: (s) => { const id = dragId.current; if (!id) return; setDrag({ id, x: s.x, y: s.y }); setHover(hitTestZone(s.x, s.y, zones(), 44)); },
    onEnd: (s) => { const id = dragId.current; dragId.current = null; const bin = hitTestZone(s.x, s.y, zones(), 44); setDrag(null); setHover(null); if (id && bin) place(id, bin); },
    onTap: () => { dragId.current = null; setDrag(null); setHover(null); },
  });
  // A zone never grows: placed chips stay in their slot (marked with the zone's emoji) instead of moving in here.
  const renderBin = (b: { id: string; label: string }) => {
    const st = styles[lap.bins.indexOf(b)];
    const armed = (!!sel && !drag) || hover === b.id;
    return (
      <button key={b.id} type="button" ref={(el) => { binEls.current[b.id] = el; }} onClick={() => { if (sel) place(sel, b.id); }}
        className={`relative flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${armed ? "border-solid" : "border-dashed"}`}
        style={{ borderColor: st.tint, background: `color-mix(in srgb, ${st.tint} ${hover === b.id ? "24%" : "9%"}, transparent)` }}>
        <span className="text-3xl" aria-hidden>{st.emoji}</span>
        <span className="text-sm font-extrabold text-foreground">{b.label}</span>
        {armed && <CornerBadge>⤵</CornerBadge>}
      </button>
    );
  };
  const chips = (
    <div className="flex flex-col gap-1.5">
      <p className="line-clamp-2 min-h-8 text-center text-xs font-semibold leading-4 text-foreground/70" aria-hidden>{sel ? `Carrying “${itemText(sel)}”: drop it in a zone` : "Tap a card, then its zone"}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {order.map((it) => {
          const bi = placed[it.id] ? lap.bins.findIndex((b) => b.id === placed[it.id]) : -1;
          return bi >= 0 ? (
            <AnswerCard key={it.id} disabled state="done" tint={styles[bi].tint} badge={styles[bi].emoji} aria-label={`${it.text}: ${lap.bins[bi].label}`}
              className="rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] disabled:opacity-100">{it.text}</AnswerCard>
          ) : (
            <AnswerCard key={it.id} data-id={it.id} onClick={() => arm(it.id)} {...pointer.handlers} state={sel === it.id && !drag ? "selected" : "idle"} aria-pressed={sel === it.id}
              className={`touch-none rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 ${drag?.id === it.id ? "opacity-30" : ""}`}>{it.text}</AnswerCard>
          );
        })}
      </div>
    </div>
  );
  const ghost = drag && !reduceMotion && (
    <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-sun)] px-3 py-2.5 text-sm font-bold text-slate-900 shadow-lg" style={{ left: drag.x, top: drag.y }}>{itemText(drag.id)}</div>
  );
  return binOrder.length === 2 ? (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {renderBin(binOrder[0])}
      {chips}
      {renderBin(binOrder[1])}
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {chips}
      <div className="grid flex-1 grid-cols-2 gap-2.5">{binOrder.map((b) => renderBin(b))}</div>
    </div>
  );
}

// — Build: DRAG each piece onto the slate (all pieces belong); tap is the fallback —
function BuildLap({ lap, say, onSolved, reduceMotion }: LapProps<CapBuildLap>) {
  const [display] = useState(() => (lap.mode === "sequence" ? shuffle(lap.pieces) : lap.pieces));
  const [added, setAdded] = useState<string[]>([]);
  const [drag, setDrag] = useState<{ piece: string; x: number; y: number } | null>(null);
  const [over, setOver] = useState(false);
  const slate = useRef<HTMLDivElement>(null);
  const dragP = useRef<string | null>(null);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const add = (p: string) => {
    if (added.includes(p)) return;
    const nx = [...added, p]; setAdded(nx); celebrate("small");
    if (nx.length >= lap.pieces.length) { celebrate("big"); say(lap.celebrate); onSolved(); }
  };
  const zones = () => [{ id: "slate", el: slate.current }];
  const pointer = usePointerDrag({
    onStart: (s, e) => { const p = (e.currentTarget as HTMLElement).dataset.piece ?? null; dragP.current = p; if (p) setDrag({ piece: p, x: s.x, y: s.y }); },
    onMove: (s) => { const p = dragP.current; if (!p) return; setDrag({ piece: p, x: s.x, y: s.y }); setOver(!!hitTestZone(s.x, s.y, zones(), 48)); },
    onEnd: (s) => { const p = dragP.current; dragP.current = null; const on = hitTestZone(s.x, s.y, zones(), 48); setDrag(null); setOver(false); if (p && on) add(p); },
    onTap: (e) => { const p = (e.currentTarget as HTMLElement).dataset.piece; if (p) add(p); },
  });
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div ref={slate} className={`${card} flex min-h-40 flex-1 flex-wrap content-start gap-2 p-3 transition-colors`} style={over ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>
        {added.length === 0 ? <span className="m-auto text-sm text-foreground/50">Drag pieces here…</span> :
          added.map((p) => <span key={p} className="rounded-xl bg-[var(--accent-amber)]/25 px-3 py-1.5 text-sm font-semibold text-foreground">{p} ✓</span>)}
      </div>
      {drag && !reduceMotion && (
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[var(--color-sun)] px-3 py-1.5 text-sm font-bold text-slate-900 shadow-lg" style={{ left: drag.x, top: drag.y }}>{drag.piece}</div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {display.filter((p) => !added.includes(p)).map((p) => (
          <button key={p} type="button" data-piece={p} {...pointer.handlers} className={`glass-card touch-none rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 ${drag?.piece === p ? "opacity-30" : ""}`}>{p}</button>
        ))}
      </div>
      <p className="text-center text-xs text-foreground/60">{added.length} / {lap.pieces.length} · drag them all in</p>
    </div>
  );
}

// — Spot: tap the on-theme items (every trick:true is a happy answer) —
function SpotLap({ lap, say, onSolved }: Omit<LapProps<CapSpotLap>, "reduceMotion">) {
  const targets = useMemo(() => lap.scene.map((s, i) => (s.trick ? i : -1)).filter((i) => i >= 0), [lap]);
  const [found, setFound] = useState<Set<number>>(new Set());
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tap = (i: number) => {
    if (!lap.scene[i].trick) { say("That's lovely too, but find the special ones!"); return; }
    if (found.has(i)) return;
    const nx = new Set(found); nx.add(i); setFound(nx); celebrate("small");
    if (nx.size >= targets.length) { celebrate("big"); say(`${lap.why} ${lap.celebrate}`); onSolved(); }
  };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2">
      <div className="grid grid-cols-1 gap-2">
        {lap.scene.map((s, i) => (
          <AnswerCard key={i} onClick={() => tap(i)} state={found.has(i) ? "done" : "idle"} tint="var(--accent-amber)"
            className="rounded-2xl backdrop-blur-[12px] backdrop-saturate-150 flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98]">
            <span className="text-xl" aria-hidden>{found.has(i) ? "🚩" : "🔎"}</span>
            <span className="flex-1">{s.text}</span>
          </AnswerCard>
        ))}
      </div>
      {found.size < targets.length && <p className="text-center text-xs text-foreground/60">{found.size} / {targets.length} · tap the special ones</p>}
    </div>
  );
}

// — Swipe: cheer it on by SWIPING the card UP — it follows your finger, then once you've pulled it up far
// enough (or flicked it) it swooshes off the top and the "cheered!" card slides in. ROBUST: it commits during
// the drag (so a release can never leave it stuck), the commit animates a real fly-off (not an instant jump),
// and the lap then renders its done state (never a stuck empty box). ↑/Enter is the keyboard path.
function SwipeLap({ lap, say, onSolved, reduceMotion }: LapProps<CapSwipeLap>) {
  const [dy, setDy] = useState(0);
  const [flew, setFlew] = useState(false);
  const [solved, setSolved] = useState(false);
  const doneRef = useRef(false);
  useEffect(() => { say(`${lap.frame} ${lap.cue}`, lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const THRESH = 96; // a real upward swipe, not a nudge
  const commit = () => {
    if (doneRef.current) return; doneRef.current = true; vibrate(12); celebrate("big"); say(`${lap.up} ${lap.celebrate}`, lap.celebrate); onSolved();
    if (reduceMotion) { setSolved(true); }
    else { setFlew(true); setTimeout(() => setSolved(true), 320); } // fly the card off the top, THEN reveal the done card
  };
  const drag = usePointerDrag({
    onMove: (s) => { if (doneRef.current) return; setDy(Math.min(0, s.dy)); if (s.dy < -THRESH || s.vy < -0.6) commit(); }, // follows the finger up; catches + flies once past the swipe distance / on a flick
    onEnd: () => { if (!doneRef.current) setDy(0); }, // released before the swipe distance → spring back
    onTap: () => setDy(0),
  });
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") { e.preventDefault(); commit(); } };
  if (solved) {
    return (
      <div className="flex flex-1 flex-col">
        <div className={`${card} animate-in fade-in slide-in-from-bottom-4 flex min-h-72 w-full flex-1 flex-col items-center justify-center gap-3 rounded-3xl px-6 py-12 text-center duration-300`} style={{ borderColor: "var(--prx-pos)" }}>
          <span className="text-6xl" aria-hidden>💚</span>
          <p className="text-lg font-bold text-foreground">{lap.up}</p>
        </div>
      </div>
    );
  }
  const lifting = dy < -8 || flew;
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div tabIndex={0} role="group" aria-roledescription="card you swipe up to cheer on"
        aria-label={`${lap.cue}. Press Up arrow to cheer it on.`} onKeyDown={onKeyDown} {...drag.handlers}
        className="glass-card lift relative flex min-h-72 w-full flex-1 cursor-grab select-none items-center justify-center overflow-hidden rounded-3xl px-7 py-12 text-center text-[19px] font-bold leading-snug text-foreground backdrop-blur-[12px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing"
        style={{ transform: `translateY(${flew ? -880 : dy}px) rotate(${flew ? -4 : 0}deg)`, transition: flew ? "transform 0.32s cubic-bezier(0.33,0,0.2,1)" : drag.dragging ? "none" : reduceMotion ? "none" : "transform 0.2s ease-out", touchAction: "pan-x", boxShadow: lifting ? "0 -6px 0 0 var(--prx-pos)" : undefined }}>
        {lifting && (
          <>
            <div className="pointer-events-none absolute inset-0" style={{ background: "var(--prx-pos)", opacity: 0.16 }} aria-hidden />
            <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 text-7xl" style={{ opacity: 0.2 }} aria-hidden>💚</span>
            <span className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold text-[var(--prx-on-fill)] shadow-md" style={{ background: "var(--prx-pos)" }} aria-hidden><ChevronUp className="size-4" /> {lap.up}</span>
          </>
        )}
        <span className="relative z-10">{lap.cue}</span>
      </div>
      {/* the tap and screen-reader floor for a gesture a young child or a screen-reader user may not manage */}
      <button type="button" onClick={commit} disabled={flew}
        className="glass-pill press flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-foreground transition-transform active:scale-95 disabled:opacity-100">
        <ChevronUp className="size-4" aria-hidden /> Swipe up, or tap to cheer it on
      </button>
    </div>
  );
}

// — Branch: pick the values-led best option; SHUFFLED so there's no "tap the top" tell (no buzzer) —
function BranchLap({ lap, say, onSolved }: Omit<LapProps<CapBranchLap>, "reduceMotion">) {
  const [opts] = useState(() => shuffle(lap.options));
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const choose = (i: number) => {
    const o = opts[i]; setPicked(i);
    if (o.best) { setSolved(true); celebrate("big"); say(`${o.consequence} ${lap.debrief} ${lap.celebrate}`); onSolved(); }
    else say(o.consequence, "");
  };
  if (picked !== null && !solved) {
    return (
      <div className="flex flex-1 flex-col justify-start gap-2.5">
        <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {opts[picked].consequence}</div>
        <button type="button" onClick={() => setPicked(null)} className="glass-pill flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foreground backdrop-blur-md transition-transform active:scale-95">Try the values-led move →</button>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col justify-start gap-2.5">
      {opts.map((o, i) => (
        <AnswerCard key={i} disabled={solved} onClick={() => choose(i)} state={solved && picked === i ? "done" : "idle"} tint="var(--accent-amber)" badge={solved && picked === i ? "✓" : undefined}
          className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] disabled:opacity-100">
          <span className="text-2xl" aria-hidden>🔀</span><span className="flex-1">{o.text}</span>
        </AnswerCard>
      ))}
    </div>
  );
}

// — Strike-rewrite: SCRUB the myth away (drag back-and-forth, or Enter), then see the truth (no-fail) —
function StrikeLap({ lap, say, onSolved, reduceMotion }: LapProps<CapStrikeLap>) {
  const [progress, setProgress] = useState(0);
  const [solved, setSolved] = useState(false);
  const doneRef = useRef(false);
  const scrubbed = useRef(0); // distance from earlier strokes: lifting a finger never un-erases the myth
  const THRESH = 240;
  useEffect(() => { say(`${lap.frame} ${lap.myth.un}`, lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const finish = () => { if (doneRef.current) return; doneRef.current = true; setSolved(true); vibrate(12); celebrate("big"); say(`${lap.myth.re} ${lap.myth.why} ${lap.celebrate}`, lap.celebrate); onSolved(); };
  const drag = usePointerDrag({
    tapThreshold: 4,
    onMove: (s) => { const p = Math.min(1, (scrubbed.current + s.distance) / THRESH); setProgress(p); if (p >= 1) finish(); },
    onEnd: (s) => { scrubbed.current += s.distance; },
  });
  const eraseNow = () => { setProgress(1); finish(); };
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); eraseNow(); } };
  // Once the myth is rubbed out, the reveal is the SHARED UN/RE card (UN eraser → RE pencil), exactly like the
  // lesson engine's strike resolve — not plain text.
  if (solved) {
    return (
      <div className="flex flex-1 flex-col">
        <UnReBeat un={lap.myth.un} re={lap.myth.re} why={lap.myth.why} fill />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      {/* a click with detail 0 comes from a keyboard or screen reader, never from a finger scrubbing the card */}
      <div tabIndex={0} role="button" aria-label={`Rub out the myth: ${lap.myth.un}`} onKeyDown={onKeyDown} onClick={(e) => { if (e.detail === 0) eraseNow(); }} {...drag.handlers}
        className="glass-card lift relative flex min-h-48 flex-1 cursor-grab touch-none select-none items-center justify-center overflow-hidden rounded-3xl px-6 py-10 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing">
        <p className="text-[19px] font-bold leading-snug text-foreground" style={{ opacity: reduceMotion ? 1 : 1 - progress * 0.85, filter: reduceMotion ? undefined : `blur(${progress * 2.5}px)`, textDecoration: progress > 0.4 ? "line-through" : undefined }}>{lap.myth.un}</p>
        <span className="pointer-events-none absolute bottom-2 right-3 text-xs font-semibold text-foreground/40" aria-hidden>✏️ rub it out</span>
      </div>
      <p className="text-center text-xs font-semibold text-foreground/60">Scrub the myth away, or press Enter</p>
    </div>
  );
}

// — Role-play: say the line you've grown into; SHUFFLED, the values-led line cheers you on (no-fail) —
function RolePlayLap({ lap, say, onSolved }: Omit<LapProps<CapRolePlayLap>, "reduceMotion">) {
  const [lines] = useState(() => shuffle(lap.yourLine));
  const [solved, setSolved] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  useEffect(() => { say(`${lap.frame} ${lap.setup}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const choose = (i: number) => {
    if (lines[i].best) { setChosen(i); setSolved(true); celebrate("big"); say(lap.celebrate); onSolved(); }
    else say("That's okay. Now say the bolder line, the one that speaks up. 💪");
  };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2.5">
      {lines.map((o, i) => (
        <AnswerCard key={i} disabled={solved} onClick={() => choose(i)} aria-label={`Say: ${o.text}`} state={solved && chosen === i ? "done" : "idle"} tint="var(--accent-amber)" badge={solved && chosen === i ? "✓" : undefined}
          className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] disabled:opacity-100">
          <span className="text-2xl" aria-hidden>🗣️</span><span className="flex-1">{o.text}</span>
        </AnswerCard>
      ))}
    </div>
  );
}

function LapView({ lap, recap, say, onSolved, reduceMotion }: { lap: CapLap; recap: CapRecap[] } & Omit<LapProps<CapLap>, "lap">) {
  switch (lap.type) {
    case "gallery": return <GalleryLap lap={lap} recap={recap} say={say} onSolved={onSolved} />;
    case "match": return <MatchLap lap={lap} say={say} onSolved={onSolved} />;
    case "sort": return <SortLap lap={lap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />;
    case "build": return <BuildLap lap={lap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />;
    case "spot": return <SpotLap lap={lap} say={say} onSolved={onSolved} />;
    case "swipe": return <SwipeLap lap={lap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />;
    case "branch": return <BranchLap lap={lap} say={say} onSolved={onSolved} />;
    case "strike-rewrite": return <StrikeLap lap={lap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />;
    case "role-play": return <RolePlayLap lap={lap} say={say} onSolved={onSolved} />;
    // Exhaustiveness guard — same hole as v2-engine's Play(): a new CapLap type with no case here
    // would render nothing and never call onSolved, stranding the player mid-capstone. Compile error now.
    default: { const _exhaustive: never = lap; return _exhaustive; }
  }
}

// — Reflect: pick any (no wrong answer) —
function ReflectView({ reflect, say, onSolved }: { reflect: CapReflect; say: (t: string) => void; onSolved: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => { say(reflect.prompt); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pick = (o: string) => { setPicked(o); celebrate("small"); say(reflect.affirm); onSolved(); };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2">
      <div className="grid grid-cols-1 gap-2">
        {reflect.options.map((o) => (
          <AnswerCard key={o} onClick={() => pick(o)} state={picked === o ? "done" : "idle"} tint="var(--accent-amber)"
            className="rounded-2xl backdrop-blur-[12px] backdrop-saturate-150 px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98]">{o}</AnswerCard>
        ))}
      </div>
      {!picked && <p className="text-center text-xs text-foreground/60">{"there's no wrong answer 💛"}</p>}
    </div>
  );
}

// — Celebration: certificate + graduation glyph (terminal; its own graduate CTA) —
function CelebrationView({ config, say, onGraduate }: { config: CapstoneConfig; say: (t: string, bubbleText?: string) => void; onGraduate: () => void }) {
  // speak the full certificate, but keep the bubble short (the certificate is shown in full in its card below).
  useEffect(() => { say(config.celebration.certificate, "🎓 You did it! Your certificate's ready. Stand tall, you've earned it."); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-1 flex-col justify-start gap-3">
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
      <button type="button" onClick={onGraduate} className="cta flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">
        Get my graduation sticker! 🎓
      </button>
    </div>
  );
}

export function RichCapstone({ config, onExit }: { config: CapstoneConfig; onExit: () => void }) {
  const reduceMotion = prefersReducedMotion();
  const seq = useMemo(() => [
    { kind: "arrival" as const },
    ...config.playback.map((lap) => ({ kind: "lap" as const, lap })),
    ...config.reflect.map((reflect) => ({ kind: "reflect" as const, reflect })),
    { kind: "celebration" as const },
  ], [config]);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(() => cleanLine(config.arrival));
  const [heard, setHeard] = useState(""); // a spoken line shown elsewhere on screen, announced but not repeated on the feedback line
  // The first line a step speaks is its question and stays on the card; later lines go to the feedback line.
  const [question, setQuestion] = useState(() => cleanLine(config.arrival));
  // The step the card's question belongs to. A lap sets its question from its mount effect, a render after the
  // step changes, so focus waits until the new step's question is on the card.
  const stepRef = useRef(0);
  const [questionStep, setQuestionStep] = useState(0);
  const questionNext = useRef(true);
  const questionSpeech = useRef(cleanLine(config.arrival));
  const [revealed, setRevealed] = useState(true);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [canNext, setCanNext] = useState(true); // arrival can advance immediately

  // say() speaks `t` and shows it on the card or the feedback line. An optional `bubbleText` shows a shorter line
  // when part of `t` is already on screen in a card (a swipe cue, a myth, the certificate) while all of `t` is spoken.
  const say = useCallback((t: string, bubbleText?: string) => {
    const line = cleanLine(t), shown = bubbleText === undefined ? line : cleanLine(bubbleText);
    if (questionNext.current) { questionNext.current = false; questionSpeech.current = line; setQuestion(shown); setQuestionStep(stepRef.current); setHeard(""); }
    else setHeard(shown === line ? "" : line);
    setBubble(shown);
    speak(line, { muted });
  }, [muted]);
  useEffect(() => () => stopSpeaking(), []);

  const cur = seq[step];
  const gated = cur.kind === "lap" || cur.kind === "reflect";

  // arrival is always ready; laps/reflect gate Next until solved. canNext is set when the step changes (in
  // next()/reset()) rather than in an effect, so there's no setState-in-effect cascade.
  const next = () => {
    stopSpeaking(); const ns = Math.min(step + 1, seq.length - 1);
    questionNext.current = true; stepRef.current = ns;
    setRevealed(!(seq[ns].kind === "lap" || seq[ns].kind === "reflect"));
    setStep(ns); setCanNext(seq[ns].kind === "arrival");
  };
  const reset = () => { stopSpeaking(); questionNext.current = true; stepRef.current = 0; setRevealed(true); setStep(0); setDone(false); setCanNext(true); say(config.arrival); };
  const onSolved = useCallback(() => setCanNext(true), []);

  // Hold a lap's answers until its question has been read (a timer, so muting mid-line can't strand them).
  useEffect(() => {
    if (!gated || revealed) return;
    const t = window.setTimeout(() => setRevealed(true), revealDelayMs(question));
    return () => window.clearTimeout(t);
  }, [gated, revealed, question]);

  // Keyboard and screen-reader users continue without hunting for Next once a lap is done.
  useEffect(() => {
    if (gated && canNext) nextRef.current?.focus({ preventScroll: true });
  }, [gated, canNext, step]);

  const tools = (
    <span className="flex items-center gap-2">
      {!muted && (
        <button type="button" aria-label="Hear it again" onClick={() => (gated && !canNext ? speak(questionSpeech.current, { muted }) : replay())} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
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

  // Lensy's question card, the same chrome as the v2 games: the step's question stays on the card and later
  // lines (nudges, a lap's celebration) go to the feedback line beneath it.
  // The gallery reads out each chapter's big truth mid-lap; reserve the longest so tapping flags never shifts the grid.
  const reserve = cur.kind === "lap" && cur.lap.type === "gallery"
    ? cur.lap.stickers.flatMap((g) => { const r = config.recap.find((x) => x.glyph === g); return r ? [cleanLine(r.bigTruth)] : []; })
    : undefined;
  const SamSays = (
    <LensyQuestion
      text={question}
      feedback={bubble !== question ? bubble : ""}
      announce={heard}
      reserve={reserve}
      focusKey={gated && questionStep === step ? String(step) : undefined}
      onTap={gated && !revealed ? () => setRevealed(true) : undefined}
    />
  );
  // Progress = a compact strip of step dots at the very top (small, not a card).
  const Progress = (
    <div className="flex flex-wrap items-center justify-center gap-1.5" aria-label={`step ${step + 1} of ${seq.length}`}>
      {seq.map((_, i) => (<span key={i} className={`rounded-full ${i === step ? "size-2.5 bg-[var(--accent-amber)]" : "size-2"} ${i < step ? "bg-foreground/55" : i === step ? "" : "bg-foreground/20"}`} aria-hidden />))}
    </div>
  );
  // Home is a quiet, tertiary text button — leaves the capstone to the path.
  const HomeBtn = (
    <button type="button" onClick={onExit} className="mx-auto mt-1 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/50 transition-colors hover:text-foreground active:scale-95">
      <Home className="size-3.5" aria-hidden /> Home
    </button>
  );
  const nextLabel = cur.kind === "arrival" ? "Let's look back! ✨" : step >= seq.length - 2 ? "Finish ⭐" : "Next →";

  return (
    <GameShell title={`Capstone: ${config.capstone}`} tools={tools} onExit={onExit} align="fill">
      {/* Three pinned zones (top progress + Lensy · flexible middle · bottom Next + counter + Home) so the
          content stops "dancing" — the same stable shell as the v2 games. */}
      <div className="flex w-full max-w-sm flex-1 flex-col gap-3">
        {/* ---- TOP ---- */}
        {Progress}
        {SamSays}

        {/* ---- MIDDLE (grows; holds the current beat) ---- */}
        <div className="flex flex-1 flex-col justify-start gap-4 py-1">
          {cur.kind === "arrival" && <ArrivalView config={config} say={say} />}
          {/* A lap mounts at once (it speaks its question) but stays hidden until the question has been read. */}
          {gated && !revealed && <RevealGate onReveal={() => setRevealed(true)} />}
          {gated && (
            <div hidden={!revealed} className={`flex flex-1 flex-col gap-4 ${reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-2 duration-300"}`}>
              {cur.kind === "lap" && <LapView key={cur.lap.id} lap={cur.lap} recap={config.recap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />}
              {cur.kind === "reflect" && <ReflectView key={cur.reflect.id} reflect={cur.reflect} say={say} onSolved={onSolved} />}
            </div>
          )}
          {cur.kind === "celebration" && <CelebrationView config={config} say={say} onGraduate={() => setDone(true)} />}
        </div>

        {/* ---- BOTTOM (pinned) ---- */}
        {cur.kind !== "celebration" && (
          <div className="flex flex-col items-stretch gap-1.5">
            {canNext && (
              <button ref={nextRef} type="button" onClick={next} className="cta flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
                {nextLabel}
              </button>
            )}
            <p className="text-center text-xs text-foreground/55">{step + 1} / {seq.length}</p>
            {HomeBtn}
          </div>
        )}
        {cur.kind === "celebration" && <div className="flex flex-col">{HomeBtn}</div>}
      </div>
    </GameShell>
  );
}
