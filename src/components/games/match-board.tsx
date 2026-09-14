"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AnswerCard } from "@/components/games/answer-cells";
import { usePointerDrag, hitTestZone, ConnectorOverlay, type Cord } from "@/components/games/interactions";
import { matchBoard } from "@/content/games/v2-schema";

// Match, shared by the lesson engine (MatchPlay) and the capstone engine (MatchLap). Draw a cord from a left card to
// its right card, or tap a left card and then a right one (the keyboard, screen-reader and ages 3-6 path). A wrong
// connection retracts with a nudge, never a fail.
//
// Playtesters solved boards at a glance because correct pairs sat straight across, so the right column is deranged
// against the left (matchBoard). Cells are identified by position, not label: two pairs that share a label used to
// disable each other's cell and strand the board (SWED-56).

/** Pair identity only, asserting nothing: the cord and badge colour of the nth connection. */
export const MATCH_TINTS = ["var(--prx-slot-1)", "var(--prx-slot-2)", "var(--prx-slot-3)", "var(--prx-slot-4)", "var(--prx-slot-5)", "var(--prx-slot-6)"];

/** A made connection: the left and right cells joined (each cell is its pair's index) and the pair it used up. */
type Link = { left: number; right: number; pair: number };

const CELL = "flex items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-100";

export function MatchBoard({ pairs, onMatch, onMiss }: {
  pairs: { left: string; right: string }[];
  /** a correct connection; `done` when it was the last */
  onMatch: (left: string, right: string, done: boolean) => void;
  onMiss: () => void;
}) {
  const [board] = useState(() => matchBoard(pairs.length));
  const [links, setLinks] = useState<Link[]>([]);
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [live, setLive] = useState<Cord | null>(null);
  const [locked, setLocked] = useState<Cord[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const leftEls = useRef<(HTMLElement | null)[]>([]);
  const rightEls = useRef<(HTMLElement | null)[]>([]);
  const dragLeft = useRef<number | null>(null);

  const anchor = (el: HTMLElement | null | undefined, side: "l" | "r") => {
    const w = wrap.current; if (!el || !w) return null;
    const r = el.getBoundingClientRect(), c = w.getBoundingClientRect();
    return { x: (side === "r" ? r.right : r.left) - c.left, y: r.top + r.height / 2 - c.top };
  };
  const recompute = useCallback(() => {
    const cords: Cord[] = [];
    links.forEach((k, i) => {
      const a = anchor(leftEls.current[k.left], "r"), b = anchor(rightEls.current[k.right], "l");
      if (a && b) cords.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, tint: MATCH_TINTS[i % MATCH_TINTS.length] });
    });
    setLocked(cords);
  }, [links]);
  useEffect(() => { recompute(); const on = () => recompute(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [recompute]);

  const connect = (l: number, r: number) => {
    const left = pairs[l].left, right = pairs[r].right;
    // Any unused pair with these two labels counts, so repeated labels can never leave a cell without a partner.
    const used = new Set(links.map((k) => k.pair));
    const pair = pairs.findIndex((p, i) => !used.has(i) && p.left === left && p.right === right);
    if (pair < 0) { onMiss(); return; }
    const next = [...links, { left: l, right: r, pair }];
    setLinks(next); setSelLeft(null);
    onMatch(left, right, next.length >= pairs.length);
  };
  const rightZones = () => board.right.map((r) => ({ id: String(r), el: rightEls.current[r] ?? null }));
  const liveFrom = (l: number, x: number, y: number) => {
    const a = anchor(leftEls.current[l], "r"), w = wrap.current; if (!a || !w) return;
    const c = w.getBoundingClientRect(); setLive({ x1: a.x, y1: a.y, x2: x - c.left, y2: y - c.top, tint: "var(--color-ink)" });
  };
  const cellOf = (e: { currentTarget: EventTarget }) => { const v = (e.currentTarget as HTMLElement).dataset.left; return v === undefined ? null : Number(v); };
  const zoneAt = (x: number, y: number) => { const id = hitTestZone(x, y, rightZones(), 36); return id === null ? null : Number(id); };
  const pointer = usePointerDrag({
    onStart: (s, e) => { const l = cellOf(e); dragLeft.current = l; if (l !== null) { setSelLeft(l); liveFrom(l, s.x, s.y); } },
    onMove: (s) => { const l = dragLeft.current; if (l === null) return; liveFrom(l, s.x, s.y); setHover(zoneAt(s.x, s.y)); },
    onEnd: (s) => { const l = dragLeft.current; dragLeft.current = null; const r = zoneAt(s.x, s.y); setLive(null); setHover(null); if (l !== null && r !== null) connect(l, r); },
    onTap: () => { dragLeft.current = null; setLive(null); setHover(null); }, // the left cell was armed in onStart; tap a right cell next
  });

  // A matched pair shares a numbered corner badge in its cord's colour, readable without the colour or the cord.
  const badge = (n: number) => (n < 0 ? {} : { badge: n + 1, badgeTint: MATCH_TINTS[n % MATCH_TINTS.length] });

  return (
    <div ref={wrap} className="relative">
      {/* one grid with auto-rows:1fr so every cell (left and right) is the same height: tidy, aligned cords */}
      <div className="grid grid-cols-2 gap-2.5" style={{ gridAutoRows: "1fr" }}>
        {board.left.map((l, row) => {
          const r = board.right[row];
          const leftLink = links.findIndex((k) => k.left === l), rightLink = links.findIndex((k) => k.right === r);
          return (
            <Fragment key={row}>
              <AnswerCard data-left={l} ref={(el) => { leftEls.current[l] = el; }} disabled={leftLink >= 0} onClick={() => setSelLeft(l)} {...pointer.handlers}
                state={leftLink >= 0 ? "done" : selLeft === l ? "selected" : "idle"} aria-pressed={leftLink >= 0 ? undefined : selLeft === l} {...badge(leftLink)}
                className={`touch-none ${CELL}`}>
                {pairs[l].left}
              </AnswerCard>
              <AnswerCard data-right={r} ref={(el) => { rightEls.current[r] = el; }} disabled={rightLink >= 0} onClick={() => { if (selLeft !== null) connect(selLeft, r); }}
                state={rightLink >= 0 ? "done" : hover === r ? "target" : "idle"} {...badge(rightLink)}
                className={CELL}>
                {pairs[r].right}
              </AnswerCard>
            </Fragment>
          );
        })}
      </div>
      <ConnectorOverlay cords={locked} live={live} />
    </div>
  );
}
