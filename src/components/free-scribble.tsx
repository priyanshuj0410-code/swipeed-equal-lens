"use client";

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useUnlearnTool } from "@/lib/unlearn-tool";

// The free-draw layer for the path canvas. A plain full-viewport overlay (NOT a drei <Html> — that projected
// with the camera and drifted off-screen), fixed above the 3D path but below the page chrome. Active when a
// DRAW tool is selected:
//   • Relearn (pen)  → scribble coral "Grow" ink anywhere on the open paper.
//   • Unlearn (eraser) → rub out those free scribbles (destination-out). If you rub over a MYTH note instead,
//     the gesture is FORWARDED to that note so UN still erases myths (reveal-on-erase) — the free layer yields.
// pointer-events:none in Browse (so travel passes through). One finger draws/erases; two fingers are left for
// the path's own scroll. Strokes persist on screen and clear with the toolbar's Reset.
export function FreeScribble() {
  const { tool, resetSeq } = useUnlearnTool();
  const active = tool === "pen" || tool === "eraser";
  const erasing = tool === "eraser";
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const ptrs = useRef<Set<number>>(new Set());

  // size the backing store to the viewport; preserve existing strokes across a resize
  const fit = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bw = Math.max(1, Math.round(window.innerWidth * dpr));
    const bh = Math.max(1, Math.round(window.innerHeight * dpr));
    if (c.width === bw && c.height === bh) return;
    const ctx0 = c.getContext("2d");
    let snap: ImageData | null = null;
    try {
      if (ctx0 && c.width && c.height) snap = ctx0.getImageData(0, 0, c.width, c.height);
    } catch {}
    c.width = bw;
    c.height = bh;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (snap) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.putImageData(snap, 0, 0);
        ctx.restore();
      }
    }
  }, []);
  useEffect(() => {
    fit();
    const on = () => fit();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [fit]);
  // re-fit when a draw tool is selected (the canvas may not have been laid out / sized yet)
  useEffect(() => {
    if (active) fit();
  }, [active, fit]);
  // the toolbar Reset wipes the free scribbles too
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (ctx && c) ctx.clearRect(0, 0, c.width, c.height);
  }, [resetSeq]);

  // the canvas is fixed at the viewport origin, so clientX/clientY ARE its local coordinates. Pen lays down
  // coral ink (source-over); eraser rubs the free ink away (destination-out) with a fatter nib.
  const stroke = (x: number, y: number, erase: boolean) => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (erase) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 22;
    } else {
      ctx.globalCompositeOperation = "source-over";
      const grow = getComputedStyle(document.documentElement).getPropertyValue("--color-grow").trim() || "#ff6b4a";
      ctx.strokeStyle = grow;
      ctx.fillStyle = grow;
      ctx.lineWidth = 4;
    }
    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, erase ? 11 : 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    last.current = { x, y };
  };

  // If the eraser came down over a MYTH note, hand the whole gesture to that note's own ink canvas (so UN
  // still erases myths) and yield: keep the free layer click-through until the pointer lifts. Returns true
  // when it forwarded.
  const forwardToMyth = (e: ReactPointerEvent<HTMLCanvasElement>): boolean => {
    const c = ref.current;
    if (!c) return false;
    c.style.pointerEvents = "none"; // peek at what's under the free layer
    const below = document.elementFromPoint(e.clientX, e.clientY);
    const note = below?.closest?.(".canvas-myth, .myth-card") as HTMLElement | null;
    const ink = (note?.querySelector(".myth-ink") as HTMLElement | null) ?? (below?.classList?.contains("myth-ink") ? (below as HTMLElement) : null);
    if (!ink) {
      c.style.pointerEvents = "auto"; // nothing to forward to → erase free ink here
      return false;
    }
    // drive the note's eraser with the real pointer; it captures, so subsequent moves reach it directly.
    const pid = e.pointerId;
    ink.dispatchEvent(
      new PointerEvent("pointerdown", { pointerId: pid, clientX: e.clientX, clientY: e.clientY, pointerType: e.pointerType, isPrimary: e.isPrimary, bubbles: true, cancelable: true }),
    );
    const restore = () => {
      ptrs.current.delete(pid); // our own onUp won't fire while we're click-through — clean the pointer up here
      const cc = ref.current;
      if (cc) cc.style.pointerEvents = "auto";
      window.removeEventListener("pointerup", restore, true);
      window.removeEventListener("pointercancel", restore, true);
    };
    window.addEventListener("pointerup", restore, true);
    window.addEventListener("pointercancel", restore, true);
    return true;
  };

  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    ptrs.current.add(e.pointerId);
    if (!active) return;
    if (ptrs.current.size >= 2) {
      drawing.current = false; // two fingers → leave it for the path scroll (window listeners)
      last.current = null;
      return;
    }
    if (erasing && forwardToMyth(e)) return; // a myth is under the eraser → it erases instead
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    drawing.current = true;
    last.current = null;
    fit();
    stroke(e.clientX, e.clientY, erasing);
  };
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (ptrs.current.size >= 2) {
      if (drawing.current) {
        drawing.current = false;
        last.current = null;
      }
      return;
    }
    if (!drawing.current) return;
    stroke(e.clientX, e.clientY, erasing);
  };
  const onUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    ptrs.current.delete(e.pointerId);
    drawing.current = false;
    last.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // z-10: above the 3D path container (z-0), below the page chrome (toolbar/pills z-50, loader z-100)
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-10"
      style={{ width: "100%", height: "100%", touchAction: "none", pointerEvents: active ? "auto" : "none", cursor: erasing ? "cell" : "crosshair" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
    />
  );
}
