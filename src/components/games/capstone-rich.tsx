"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from "react";
import { Volume2, VolumeX, RotateCcw, Check, ChevronUp, Home } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { prefersReducedMotion } from "@/lib/juice";
import { binStyles, MATCH_TINTS } from "@/components/games/v2-engine";
import { usePointerDrag, hitTestZone, ConnectorOverlay, type Cord } from "@/components/games/interactions";
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
const MATCH_GLYPHS = ["①", "②", "③", "④", "⑤", "⑥"];

const card = "glass-card rounded-2xl backdrop-blur-[12px] backdrop-saturate-150";

type LapProps<L> = { lap: L; say: (t: string) => void; onSolved: () => void; reduceMotion: boolean };

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
          <button key={r.glyph} type="button" onClick={() => tap(r)} className={`${card} flex flex-col items-center gap-1.5 px-3 py-4 text-center transition-transform active:scale-[0.97] ${lit.has(r.glyph) ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
            <span className="text-4xl" aria-hidden>{glyphEmoji(r.glyph)}</span>
            <span className="text-xs font-bold text-foreground">{r.game}</span>
            {lit.has(r.glyph) && <Check className="size-4 text-foreground" aria-hidden />}
          </button>
        ))}
      </div>
      {lit.size < flags.length && <p className="text-center text-xs text-foreground/60">{lit.size} / {flags.length} · tap each flag</p>}
    </div>
  );
}

// — Match: DRAW a cord from a left cell to its right cell (tap-a-left then tap-a-right is the fallback) —
function MatchLap({ lap, say, onSolved, reduceMotion }: LapProps<CapMatchLap>) {
  const [rights] = useState(() => shuffle(lap.pairs.map((p) => p.right)));
  const [matched, setMatched] = useState<string[]>([]);
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [live, setLive] = useState<Cord | null>(null);
  const [locked, setLocked] = useState<Cord[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const leftEls = useRef<Record<string, HTMLElement | null>>({});
  const rightEls = useRef<Record<string, HTMLElement | null>>({});
  const dragLeft = useRef<string | null>(null);
  useEffect(() => { say(lap.frame); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const rightOf = (left: string) => lap.pairs.find((p) => p.left === left)?.right;
  const tokenOf = (left: string) => MATCH_GLYPHS[matched.indexOf(left) % MATCH_GLYPHS.length];
  const anchor = (el: HTMLElement | null, side: "l" | "r") => {
    const w = wrap.current; if (!el || !w) return null;
    const r = el.getBoundingClientRect(), c = w.getBoundingClientRect();
    return { x: (side === "r" ? r.right : r.left) - c.left, y: r.top + r.height / 2 - c.top };
  };
  const recompute = useCallback(() => {
    const cords: Cord[] = [];
    matched.forEach((left, i) => {
      const r = rightOf(left); const a = anchor(leftEls.current[left], "r"); const b = r ? anchor(rightEls.current[r], "l") : null;
      if (a && b) cords.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, tint: MATCH_TINTS[i % MATCH_TINTS.length] });
    });
    setLocked(cords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);
  useEffect(() => { recompute(); const on = () => recompute(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [recompute]);
  const rightZones = () => rights.map((r) => ({ id: r, el: rightEls.current[r] }));
  const connect = (left: string, right: string) => {
    if (rightOf(left) === right) {
      const nm = [...matched, left]; setMatched(nm); setSelLeft(null); setWrong(false); celebrate("small");
      if (nm.length >= lap.pairs.length) { celebrate("big"); say(lap.celebrate); onSolved(); }
      else say(`${left} — ${right}. ✓`);
    } else { setWrong(true); setTimeout(() => setWrong(false), 700); }
  };
  const liveFrom = (left: string, x: number, y: number) => {
    const a = anchor(leftEls.current[left], "r"), w = wrap.current; if (!a || !w) return;
    const c = w.getBoundingClientRect(); setLive({ x1: a.x, y1: a.y, x2: x - c.left, y2: y - c.top, tint: "var(--color-ink)" });
  };
  const pointer = usePointerDrag({
    onStart: (s, e) => { const left = (e.currentTarget as HTMLElement).dataset.left ?? null; dragLeft.current = left; if (left) { setSelLeft(left); setWrong(false); liveFrom(left, s.x, s.y); } },
    onMove: (s) => { const left = dragLeft.current; if (!left) return; liveFrom(left, s.x, s.y); setHover(hitTestZone(s.x, s.y, rightZones(), 36)); },
    onEnd: (s) => { const left = dragLeft.current; dragLeft.current = null; const right = hitTestZone(s.x, s.y, rightZones(), 36); setLive(null); setHover(null); if (left && right) connect(left, right); },
    onTap: () => { dragLeft.current = null; setLive(null); setHover(null); },
  });
  const rightDone = (r: string) => lap.pairs.some((p) => p.right === r && matched.includes(p.left));
  const rightToken = (r: string) => { const left = lap.pairs.find((p) => p.right === r && matched.includes(p.left))?.left; return left ? tokenOf(left) : ""; };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2.5">
      <p className="text-center text-xs font-semibold text-foreground/60">{wrong ? "Not a match — try another. 💛" : "draw a line from each card to its match"}</p>
      {/* one grid with auto-rows:1fr so every cell (left & right) is the SAME height — tidy cords */}
      <div ref={wrap} className="relative">
        <div className="grid grid-cols-2 gap-2.5" style={{ gridAutoRows: "1fr" }}>
          {lap.pairs.map((p, i) => {
            const r = rights[i];
            return (
              <Fragment key={i}>
                <button type="button" data-left={p.left} ref={(el) => { leftEls.current[p.left] = el; }} disabled={matched.includes(p.left)} onClick={() => { setSelLeft(p.left); setWrong(false); }} {...pointer.handlers}
                  className={`glass-card flex touch-none items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-100 ${selLeft === p.left && !reduceMotion ? "animate-pulse" : ""}`}
                  style={matched.includes(p.left) ? { boxShadow: "inset 0 0 0 2.5px var(--prx-pos)" } : selLeft === p.left ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>
                  {matched.includes(p.left) ? `${tokenOf(p.left)} ${p.left}` : p.left}
                </button>
                <button type="button" ref={(el) => { rightEls.current[r] = el; }} disabled={rightDone(r)} onClick={() => { if (selLeft) connect(selLeft, r); }}
                  className="glass-card flex items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-100"
                  style={rightDone(r) ? { boxShadow: "inset 0 0 0 2.5px var(--prx-pos)" } : hover === r ? { boxShadow: "inset 0 0 0 3.5px var(--color-ink)" } : undefined}>
                  {rightDone(r) ? `${rightToken(r)} ${r}` : r}
                </button>
              </Fragment>
            );
          })}
        </div>
        <ConnectorOverlay cords={locked} live={live} />
      </div>
    </div>
  );
}

// — Sort: DRAG a chip into its bin (two bins → big dropzones top & bottom; tap-to-arm is the fallback) —
function SortLap({ lap, say, onSolved, reduceMotion }: LapProps<CapSortLap>) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
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
      const np = { ...placed, [itemId]: binId }; setPlaced(np); setSel(null); setWrong(false); celebrate("small");
      if (Object.keys(np).length >= lap.items.length) { celebrate("big"); say(lap.celebrate); onSolved(); }
    } else { setWrong(true); say("Try the other spot!"); }
  };
  const arm = (id: string) => { setSel(id); setWrong(false); };
  const pointer = usePointerDrag({
    onStart: (s, e) => { const id = (e.currentTarget as HTMLElement).dataset.id ?? null; dragId.current = id; if (id) { arm(id); setDrag({ id, x: s.x, y: s.y }); } },
    onMove: (s) => { const id = dragId.current; if (!id) return; setDrag({ id, x: s.x, y: s.y }); setHover(hitTestZone(s.x, s.y, zones(), 44)); },
    onEnd: (s) => { const id = dragId.current; dragId.current = null; const bin = hitTestZone(s.x, s.y, zones(), 44); setDrag(null); setHover(null); if (id && bin) place(id, bin); },
    onTap: () => { dragId.current = null; setDrag(null); setHover(null); },
  });
  const renderBin = (b: { id: string; label: string }, bi: number) => {
    const st = styles[bi];
    const inBin = lap.items.filter((it) => placed[it.id] === b.id);
    const armed = (!!sel && !drag) || hover === b.id;
    return (
      <button key={b.id} type="button" ref={(el) => { binEls.current[b.id] = el; }} onClick={() => { if (sel) place(sel, b.id); }}
        className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${hover === b.id ? "border-solid" : "border-dashed"}`}
        style={{ borderColor: st.tint, background: `color-mix(in srgb, ${st.tint} ${hover === b.id ? "24%" : "9%"}, transparent)` }}>
        <span className="text-3xl" aria-hidden>{st.emoji}</span>
        <span className="text-sm font-extrabold text-foreground">{b.label}{armed ? " ⤵" : ""}</span>
        {inBin.length > 0 && <div className="flex flex-wrap justify-center gap-1">{inBin.map((it) => <span key={it.id} className="rounded-full bg-[var(--color-sun)] px-2 py-0.5 text-[11px] font-bold text-slate-900">{it.text} ✓</span>)}</div>}
      </button>
    );
  };
  const chips = (
    <div className="flex flex-col gap-1.5">
      {sel && !drag && <p className="text-center text-xs font-semibold text-foreground/70" aria-hidden>Carrying “{itemText(sel)}” — drop it in a zone</p>}
      <div className="flex flex-wrap justify-center gap-2">
        {lap.items.filter((it) => !placed[it.id]).map((it) => (
          <button key={it.id} type="button" data-id={it.id} onClick={() => arm(it.id)} {...pointer.handlers}
            className={`glass-card touch-none rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 ${sel === it.id && !drag && !reduceMotion ? "animate-pulse" : ""} ${drag?.id === it.id ? "opacity-30" : ""}`}
            style={sel === it.id && !drag ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>{it.text}</button>
        ))}
      </div>
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Not there — try another zone. 💛</p>}
    </div>
  );
  const ghost = drag && !reduceMotion && (
    <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-sun)] px-3 py-2.5 text-sm font-bold text-slate-900 shadow-lg" style={{ left: drag.x, top: drag.y }}>{itemText(drag.id)}</div>
  );
  return lap.bins.length === 2 ? (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {renderBin(lap.bins[0], 0)}
      {chips}
      {renderBin(lap.bins[1], 1)}
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {chips}
      <div className="grid flex-1 grid-cols-2 gap-2.5">{lap.bins.map(renderBin)}</div>
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
    if (!lap.scene[i].trick) { say("That's lovely too — but find the special ones!"); return; }
    if (found.has(i)) return;
    const nx = new Set(found); nx.add(i); setFound(nx); celebrate("small");
    if (nx.size >= targets.length) { celebrate("big"); say(`${lap.why} ${lap.celebrate}`); onSolved(); }
  };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2">
      <div className="grid grid-cols-1 gap-2">
        {lap.scene.map((s, i) => (
          <button key={i} type="button" onClick={() => tap(i)} className={`${card} flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${found.has(i) ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
            <span className="text-xl" aria-hidden>{found.has(i) ? "🚩" : "🔎"}</span>
            <span className="flex-1">{s.text}</span>
          </button>
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
  useEffect(() => { say(`${lap.frame} ${lap.cue}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const THRESH = 96; // a real upward swipe, not a nudge
  const commit = () => {
    if (doneRef.current) return; doneRef.current = true; vibrate(12); celebrate("big"); say(`${lap.up} ${lap.celebrate}`); onSolved();
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
        <div className={`${card} animate-in fade-in slide-in-from-bottom-4 flex min-h-72 w-full flex-1 flex-col items-center justify-center gap-3 rounded-3xl px-6 py-12 text-center duration-300`} style={{ boxShadow: "6px 6px 0 0 var(--prx-pos)" }}>
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
        className="glass-card relative flex min-h-72 w-full flex-1 cursor-grab select-none items-center justify-center overflow-hidden rounded-3xl px-7 py-12 text-center text-[19px] font-bold leading-snug text-foreground backdrop-blur-[12px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing"
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
      <p className="text-center text-xs font-bold text-foreground/55">👆 swipe up to cheer it on · ↑ key</p>
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
    else { say(o.consequence); }
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
        <button key={i} type="button" disabled={solved} onClick={() => choose(i)} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] ${solved && picked === i ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
          <span className="text-2xl" aria-hidden>🔀</span><span className="flex-1">{o.text}{solved && picked === i && " ✓"}</span>
        </button>
      ))}
    </div>
  );
}

// — Strike-rewrite: SCRUB the myth away (drag back-and-forth, or Enter), then see the truth (no-fail) —
function StrikeLap({ lap, say, onSolved, reduceMotion }: LapProps<CapStrikeLap>) {
  const [progress, setProgress] = useState(0);
  const [solved, setSolved] = useState(false);
  const doneRef = useRef(false);
  const THRESH = 240;
  useEffect(() => { say(`${lap.frame} ${lap.myth.un}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const finish = () => { if (doneRef.current) return; doneRef.current = true; setSolved(true); vibrate(12); celebrate("big"); say(`${lap.myth.re} ${lap.myth.why} ${lap.celebrate}`); onSolved(); };
  const drag = usePointerDrag({
    tapThreshold: 4,
    onMove: (s) => { const p = Math.min(1, s.distance / THRESH); setProgress(p); if (p >= 1) finish(); },
  });
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setProgress(1); finish(); } };
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
      <div tabIndex={0} role="button" aria-label={`Rub out the myth: ${lap.myth.un}`} onKeyDown={onKeyDown} {...drag.handlers}
        className="glass-card relative flex min-h-48 flex-1 cursor-grab touch-none select-none items-center justify-center overflow-hidden rounded-3xl px-6 py-10 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing">
        <p className="text-[19px] font-bold leading-snug text-foreground" style={{ opacity: reduceMotion ? 1 : 1 - progress * 0.85, filter: reduceMotion ? undefined : `blur(${progress * 2.5}px)`, textDecoration: progress > 0.4 ? "line-through" : undefined }}>{lap.myth.un}</p>
        <span className="pointer-events-none absolute bottom-2 right-3 text-xs font-semibold text-foreground/40" aria-hidden>✏️ rub it out</span>
      </div>
      <p className="text-center text-xs font-semibold text-foreground/60">Scrub the myth away — or press Enter</p>
    </div>
  );
}

// — Role-play: say the line you've grown into; SHUFFLED, the values-led line cheers you on (no-fail) —
function RolePlayLap({ lap, say, onSolved }: Omit<LapProps<CapRolePlayLap>, "reduceMotion">) {
  const [lines] = useState(() => shuffle(lap.yourLine));
  const [solved, setSolved] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [nudge, setNudge] = useState(false);
  useEffect(() => { say(`${lap.frame} ${lap.setup}`); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const choose = (i: number) => {
    if (lines[i].best) { setChosen(i); setSolved(true); celebrate("big"); say(lap.celebrate); onSolved(); }
    else { setNudge(true); say("That's okay — now say the bolder line, the one that speaks up. 💪"); }
  };
  return (
    <div className="flex flex-1 flex-col justify-start gap-2.5">
      {lines.map((o, i) => (
        <button key={i} type="button" disabled={solved} onClick={() => choose(i)} aria-label={`Say: ${o.text}`} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] ${solved && chosen === i ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>
          <span className="text-2xl" aria-hidden>🗣️</span><span className="flex-1">{o.text}{solved && chosen === i && " ✓"}</span>
        </button>
      ))}
      {nudge && !solved && <p className="text-center text-xs font-semibold text-foreground/70">Say it loud and brave — pick the strong line! 💪</p>}
    </div>
  );
}

function LapView({ lap, recap, say, onSolved, reduceMotion }: { lap: CapLap; recap: CapRecap[] } & Omit<LapProps<CapLap>, "lap">) {
  switch (lap.type) {
    case "gallery": return <GalleryLap lap={lap} recap={recap} say={say} onSolved={onSolved} />;
    case "match": return <MatchLap lap={lap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />;
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
          <button key={o} type="button" onClick={() => pick(o)} className={`${card} px-4 py-3 text-left text-sm font-semibold text-foreground transition-transform active:scale-[0.98] ${picked === o ? "ring-2 ring-[var(--accent-amber)]" : ""}`}>{o}</button>
        ))}
      </div>
      {!picked && <p className="text-center text-xs text-foreground/60">{"there's no wrong answer 💛"}</p>}
    </div>
  );
}

// — Celebration: certificate + graduation glyph (terminal; its own graduate CTA) —
function CelebrationView({ config, say, onGraduate }: { config: CapstoneConfig; say: (t: string, bubbleText?: string) => void; onGraduate: () => void }) {
  // speak the full certificate, but keep the bubble short (the certificate is shown in full in its card below).
  useEffect(() => { say(config.celebration.certificate, "🎓 You did it! Your certificate's ready — stand tall, you've earned it."); /* once */ // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <button type="button" onClick={onGraduate} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-bold text-slate-900 transition-transform active:scale-95">
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
  const [bubble, setBubble] = useState(config.arrival);
  const [canNext, setCanNext] = useState(true); // arrival can advance immediately

  // say() speaks `t` (and mirrors it to the aria-live bubble). An optional `bubbleText` lets a long spoken line
  // (e.g. the graduation certificate) show a SHORT bubble while the full text is still spoken + shown in its card.
  const say = useCallback((t: string, bubbleText?: string) => { setBubble(bubbleText ?? t); speak(t, { muted }); }, [muted]);
  useEffect(() => () => stopSpeaking(), []);

  const cur = seq[step];

  // arrival is always ready; laps/reflect gate Next until solved. canNext is set when the step changes (in
  // next()/reset()) rather than in an effect, so there's no setState-in-effect cascade.
  const next = () => { stopSpeaking(); const ns = Math.min(step + 1, seq.length - 1); setStep(ns); setCanNext(seq[ns].kind === "arrival"); };
  const reset = () => { stopSpeaking(); setStep(0); setDone(false); setCanNext(true); setBubble(config.arrival); say(config.arrival); };
  const onSolved = useCallback(() => setCanNext(true), []);

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

  // Lensy's voice is a CHAT BUBBLE (soft mist fill + a little tail toward Sam), mirroring every say() with
  // aria-live for screen-reader / TTS-muted parity — exactly the v2 game chrome.
  const SamSays = (
    <div className="flex items-end gap-2">
      <Sam size={52} />
      <div className="relative min-w-0 flex-1">
        <span className="absolute -left-1 bottom-2.5 size-3 rotate-45 rounded-[3px]" style={{ background: "var(--color-mist)" }} aria-hidden />
        <span role="status" aria-live="polite" aria-atomic="true" className="relative inline-block max-h-[34vh] max-w-full overflow-y-auto rounded-2xl rounded-bl-md px-3.5 py-2.5 text-left text-[15px] font-semibold leading-snug" style={{ background: "var(--color-mist)", color: "var(--color-ink)" }}>{bubble}</span>
      </div>
    </div>
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
          {cur.kind === "lap" && <LapView key={cur.lap.id} lap={cur.lap} recap={config.recap} say={say} onSolved={onSolved} reduceMotion={reduceMotion} />}
          {cur.kind === "reflect" && <ReflectView key={cur.reflect.id} reflect={cur.reflect} say={say} onSolved={onSolved} />}
          {cur.kind === "celebration" && <CelebrationView config={config} say={say} onGraduate={() => setDone(true)} />}
        </div>

        {/* ---- BOTTOM (pinned) ---- */}
        {cur.kind !== "celebration" && (
          <div className="flex flex-col items-stretch gap-1.5">
            {canNext && (
              <button type="button" onClick={next} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
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
