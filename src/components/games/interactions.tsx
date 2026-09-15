"use client";

// Shared direct-manipulation primitives for the v2 mini-game engine. The interaction-model upgrade turns the
// "tap a thing, tap another thing" mechanics into real gestures (swipe a card, drag a chip into a bin, draw a
// cord plug→socket) WITHOUT losing accessibility: every gesture mechanic keeps its native <button> tap path as
// the keyboard / screen-reader / young-child (ages 3-6) fallback, and the pointer gesture is an additive layer.
//
// - usePointerDrag: ONE Pointer-Events hook (mouse + touch + pen, single code path). It captures the pointer
//   so a drag survives the finger leaving the element, tracks dx/dy + total path distance + velocity, and: via
//   an ~8px movement threshold: falls through to onTap when the press barely moved. That threshold is what
//   preserves the tap fallback in every mechanic: a quick tap still "arms" a chip exactly as before.
// - hitTestZone: maps a pointer x/y to the drop-zone under it (with a forgiving nearest-within-radius snap for
//   small fingers). Zones pass live element refs, so rects are read fresh (survives scroll/reflow/wrap).
// - ConnectorOverlay: an absolutely-positioned SVG layer (pointer-events:none) that draws the match cords.

import { useCallback, useRef, useState } from "react";

export type DragState = {
  startX: number; startY: number; // pointer-down client coords
  x: number; y: number; // current client coords
  dx: number; dy: number; // delta from start
  distance: number; // total path length travelled (for scrub gestures)
  vx: number; vy: number; // recent velocity (px/ms)
};

export type PointerDragOptions = {
  onStart?: (s: DragState, e: React.PointerEvent) => void;
  onMove?: (s: DragState, e: React.PointerEvent) => void;
  onEnd?: (s: DragState, e: React.PointerEvent) => void; // released after moving past the tap threshold
  onTap?: (e: React.PointerEvent) => void; // released without really moving (the retained tap path)
  tapThreshold?: number; // px of movement below which a release counts as a tap (default 8)
  disabled?: boolean;
};

// Spreadable pointer handlers + a live `dragging` flag. Caller owns its own visual transform + hit-testing.
export function usePointerDrag(opts: PointerDragOptions) {
  const { tapThreshold = 8, disabled } = opts;
  const state = useRef<DragState | null>(null);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    if (e.button !== 0 && e.pointerType === "mouse") return; // primary mouse button only
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* capture optional */ }
    const s: DragState = { startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, dx: 0, dy: 0, distance: 0, vx: 0, vy: 0 };
    state.current = s;
    last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    setDragging(true);
    opts.onStart?.(s, e);
  }, [disabled, opts]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = state.current; if (!s) return;
    const px = e.clientX, py = e.clientY;
    s.distance += Math.hypot(px - s.x, py - s.y);
    s.x = px; s.y = py; s.dx = px - s.startX; s.dy = py - s.startY;
    const l = last.current;
    if (l) { const dt = Math.max(1, e.timeStamp - l.t); s.vx = (px - l.x) / dt; s.vy = (py - l.y) / dt; }
    last.current = { x: px, y: py, t: e.timeStamp };
    opts.onMove?.(s, e);
  }, [opts]);

  const finish = useCallback((e: React.PointerEvent) => {
    try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch { /* already released */ }
    const s = state.current; if (!s) return;
    state.current = null; last.current = null; setDragging(false);
    if (Math.hypot(s.dx, s.dy) < tapThreshold) opts.onTap?.(e);
    else opts.onEnd?.(s, e);
  }, [opts, tapThreshold]);

  return { dragging, handlers: { onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish } };
}

export type Zone = { id: string; el: HTMLElement | null };

// The zone under (x,y); falls back to the nearest zone within `radius` px (forgiving for small fingers).
export function hitTestZone(x: number, y: number, zones: Zone[], radius = 36): string | null {
  for (const z of zones) {
    const r = z.el?.getBoundingClientRect();
    if (r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z.id;
  }
  let best: string | null = null, bestD = radius;
  for (const z of zones) {
    const r = z.el?.getBoundingClientRect(); if (!r) continue;
    const cx = Math.max(r.left, Math.min(x, r.right)), cy = Math.max(r.top, Math.min(y, r.bottom));
    const d = Math.hypot(x - cx, y - cy);
    if (d < bestD) { bestD = d; best = z.id; }
  }
  return best;
}

export type Cord = { x1: number; y1: number; x2: number; y2: number; tint: string };

// SVG overlay for match cords: a live drag cord (to the pointer) plus locked cords between matched cells.
// pointer-events:none so it never blocks the cells beneath it.
export function ConnectorOverlay({ cords, live }: { cords: Cord[]; live?: Cord | null }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden style={{ overflow: "visible" }}>
      {cords.map((c, i) => (
        <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={c.tint} strokeWidth={4} strokeLinecap="round" />
      ))}
      {live && <line x1={live.x1} y1={live.y1} x2={live.x2} y2={live.y2} stroke={live.tint} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 8" opacity={0.7} />}
    </svg>
  );
}
