"use client";

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useUnlearnTool } from "@/lib/unlearn-tool";

// Free scribble on the canvas with the Relearn pen. A plain full-viewport coral-ink overlay (NOT a drei
// <Html> — that projected with the camera and drifted off-screen), fixed above the 3D path but below the
// page chrome. Active ONLY when the pen tool is selected (pointer-events:none otherwise, so Browse travel +
// Unlearn erasing pass straight through to the world beneath). One finger draws; two fingers are left for
// the path's own scroll (it tracks its pointers and yields when a second lands). Strokes persist on screen
// and clear with the toolbar's Reset.
export function FreeScribble() {
  const { tool, resetSeq } = useUnlearnTool();
  const active = tool === "pen";
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
  // re-fit when the pen is selected (the canvas may not have been laid out / sized yet)
  useEffect(() => {
    if (active) fit();
  }, [active, fit]);
  // the toolbar Reset wipes the free scribbles too
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (ctx && c) ctx.clearRect(0, 0, c.width, c.height);
  }, [resetSeq]);

  // the canvas is fixed at the viewport origin, so clientX/clientY ARE its local coordinates
  const stroke = (x: number, y: number) => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const grow = getComputedStyle(document.documentElement).getPropertyValue("--color-grow").trim() || "#ff6b4a";
    ctx.strokeStyle = grow;
    ctx.fillStyle = grow;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    last.current = { x, y };
  };
  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    ptrs.current.add(e.pointerId);
    if (!active) return;
    if (ptrs.current.size >= 2) {
      drawing.current = false; // two fingers → leave it for the path scroll (window listeners)
      last.current = null;
      return;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    drawing.current = true;
    last.current = null;
    fit();
    stroke(e.clientX, e.clientY);
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
    stroke(e.clientX, e.clientY);
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
      style={{ width: "100%", height: "100%", touchAction: "none", pointerEvents: active ? "auto" : "none" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
    />
  );
}
