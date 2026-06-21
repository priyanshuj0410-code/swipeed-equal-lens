"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Toolbar, ToolbarButton, ToolbarSeparator, Note, NoteChip } from "@equal-lens/brand";

// Mascots served from public/ (copied from @equal-lens/brand/assets/mascots) — robust across bundlers.
const UN = "/brand/mascots/un.svg";
const RE = "/brand/mascots/re.svg";

export type Myth = { myth: string; truth: string; explanation?: string };
type Tool = "none" | "pen" | "eraser";
type Phase = "myth" | "erased" | "truth";
const TONES = ["yellow", "mint", "peach", "violet"] as const;
type Tone = (typeof TONES)[number];
type N = {
  id: number;
  x: number;
  y: number;
  tone: Tone;
  erase: number;
  reveal: number;
  phase: Phase;
  moved: boolean;
  data: Myth;
};

const PEN_COLORS = ["#FF7A5C", "#553286", "#2DD4BF", "#4FB0E8", "#221436"];
const ERASER_R = 16;
const NOTE_W = 224;
const NOTE_H = 170;
const MOBILE = 768;

export default function UnlearnRelearnCanvas({ myths }: { myths: Myth[] }) {
  const [tool, setTool] = useState<Tool>("none");
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [notes, setNotes] = useState<N[]>([]);
  const [hide, setHide] = useState(false);
  const [fine, setFine] = useState(false);
  const [mobile, setMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const toolRef = useRef<Tool>("none");
  const colorRef = useRef(color);
  const notesRef = useRef<N[]>([]);
  const hideRef = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; ox: number; oy: number; sx: number; sy: number } | null>(null);
  const nextId = useRef(0);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  useEffect(() => {
    hideRef.current = hide;
  }, [hide]);
  // simple staggered placement (swap in content-aware placement if you like)
  const placeSpots = useCallback((count: number) => {
    const W = document.documentElement.clientWidth;
    const cols = Math.max(1, Math.floor((W - 24) / (NOTE_W + 24)));
    const spots: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const c = i % cols,
        r = Math.floor(i / cols);
      spots.push({ x: 16 + c * (NOTE_W + 24) + (r % 2 ? 20 : 0), y: 130 + r * (NOTE_H + 28) });
    }
    return spots;
  }, []);
  const makeNote = useCallback(
    (data: Myth, i: number, x: number, y: number): N => ({
      id: nextId.current++,
      x,
      y,
      tone: TONES[i % TONES.length],
      erase: 0,
      reveal: 0,
      phase: "myth",
      moved: false,
      data,
    }),
    []
  );
  // seed notes once
  useEffect(() => {
    const isM = window.innerWidth < MOBILE;
    setMobile(isM);
    const spots = isM ? [] : placeSpots(myths.length);
    setNotes(myths.map((m, i) => makeNote(m, i, isM ? 0 : spots[i].x, isM ? 0 : spots[i].y)));
  }, [myths, makeNote, placeSpots]);
  // fine pointer (mouse) → show the custom cursor
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const upd = () => setFine(mq.matches);
    const raf = requestAnimationFrame(upd);
    mq.addEventListener("change", upd);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", upd);
    };
  }, []);
  // size the canvas to the whole document (DPR-aware, survives page growth)
  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = document.documentElement.clientWidth;
    const h = Math.max(document.body.scrollHeight, window.innerHeight);
    const prev = ctxRef.current?.getImageData(0, 0, c.width, c.height) ?? null;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    if (prev) {
      try {
        ctx.putImageData(prev, 0, 0);
      } catch {}
    }
  }, []);
  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTool("none");
    const onW = () => setMobile(window.innerWidth < MOBILE);
    window.addEventListener("resize", resize);
    window.addEventListener("resize", onW);
    window.addEventListener("keydown", onKey);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onW);
      window.removeEventListener("keydown", onKey);
    };
  }, [resize]);
  function stroke(a: { x: number; y: number } | null, b: { x: number; y: number }) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const eraser = toolRef.current === "eraser";
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.strokeStyle = ctx.fillStyle = eraser ? "rgba(0,0,0,1)" : colorRef.current;
    ctx.lineWidth = eraser ? ERASER_R * 2 : 5;
    ctx.beginPath();
    ctx.arc(b.x, b.y, eraser ? ERASER_R : 2.5, 0, Math.PI * 2);
    ctx.fill();
    if (a) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  const within = (n: N, px: number, py: number) => px >= n.x && px <= n.x + NOTE_W && py >= n.y && py <= n.y + NOTE_H;
  const noteAt = (px: number, py: number) => !hideRef.current && notesRef.current.some((n) => within(n, px, py));
  function touchNotes(px: number, py: number) {
    const t = toolRef.current;
    if (t === "none" || hideRef.current) return;
    setNotes((prev) =>
      prev.map((n) => {
        if (!within(n, px, py)) return n;
        if (t === "eraser" && n.phase === "myth") {
          const erase = Math.min(1, n.erase + 0.09);
          return { ...n, erase, phase: erase >= 1 ? "erased" : n.phase };
        }
        if (t === "pen" && n.phase === "erased") {
          const reveal = Math.min(1, n.reveal + 0.09);
          return { ...n, reveal, phase: reveal >= 1 ? "truth" : n.phase };
        }
        return n;
      })
    );
  }
  function tapNote(id: number) {
    const t = toolRef.current;
    if (t === "none") return;
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        if (t === "eraser" && n.phase === "myth") return { ...n, erase: 1, phase: "erased" };
        if (t === "pen" && n.phase === "erased") return { ...n, reveal: 1, phase: "truth" };
        return n;
      })
    );
  }
  function onDown(e: React.PointerEvent) {
    if (toolRef.current === "none") return;
    e.preventDefault();
    drawing.current = true;
    const p = { x: e.pageX, y: e.pageY };
    last.current = p;
    if (!(toolRef.current === "pen" && noteAt(p.x, p.y))) stroke(null, p);
    touchNotes(p.x, p.y);
  }
  function onMove(e: React.PointerEvent) {
    if (cursorRef.current) cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    if (!drawing.current || toolRef.current === "none") return;
    const p = { x: e.pageX, y: e.pageY };
    if (!(toolRef.current === "pen" && noteAt(p.x, p.y))) stroke(last.current, p);
    touchNotes(p.x, p.y);
    last.current = p;
  }
  const onUp = () => {
    drawing.current = false;
    last.current = null;
  };
  function noteDown(e: React.PointerEvent, n: N) {
    if (toolRef.current !== "none") return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: n.id, ox: n.x, oy: n.y, sx: e.pageX, sy: e.pageY };
  }
  function noteMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === d.id ? { ...n, x: d.ox + (e.pageX - d.sx), y: d.oy + (e.pageY - d.sy), moved: true } : n))
    );
  }
  const noteUp = () => {
    drag.current = null;
  };
  function addMyth() {
    const i = notesRef.current.length;
    const data = myths[i % myths.length];
    const spot = mobile ? { x: 0, y: 0 } : placeSpots(i + 1)[i];
    setNotes((p) => [...p, { ...makeNote(data, i, spot.x, spot.y), moved: !mobile }]);
  }
  function reset() {
    const c = canvasRef.current,
      ctx = ctxRef.current;
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    setNotes((p) => p.map((n) => ({ ...n, erase: 0, reveal: 0, phase: "myth" })));
  }
  const active = tool !== "none";
  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 30,
          pointerEvents: active ? "auto" : "none",
          cursor: active && fine ? "none" : "default",
          touchAction: active ? "none" : "auto",
        }}
      />
      {/* desktop: draggable notes */}
      {!mobile && !hide && (
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 20, width: "100%" }} aria-hidden>
          {notes.map((n) => (
            <Note
              key={n.id}
              tone={n.tone}
              onPointerDown={(e) => noteDown(e, n)}
              onPointerMove={noteMove}
              onPointerUp={noteUp}
              style={{ position: "absolute", left: n.x, top: n.y, pointerEvents: active ? "none" : "auto", touchAction: "none" }}
            >
              <NoteBody n={n} />
            </Note>
          ))}
        </div>
      )}
      {/* touch: tappable stacked list */}
      {mobile && !hide && notes.length > 0 && (
        <section style={{ position: "relative", zIndex: 30, maxWidth: 460, margin: "0 auto", padding: "48px 20px" }}>
          <h2 style={{ textAlign: "center", fontFamily: "var(--font-hand)", fontWeight: 800, fontSize: 24, color: "var(--color-ink)" }}>
            Bust these myths
          </h2>
          <p style={{ textAlign: "center", fontSize: 14, marginTop: 4, color: "var(--color-ink)", opacity: 0.6 }}>
            Tap <b>UN</b> below, then a card to erase it — then <b>RE</b> to reveal the truth.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 24 }}>
            {notes.map((n) => (
              <Note
                key={n.id}
                tone={n.tone}
                role="button"
                tabIndex={0}
                onClick={() => tapNote(n.id)}
                style={{ width: "100%", maxWidth: 320, cursor: "pointer", textAlign: "left" }}
              >
                <NoteBody n={n} />
              </Note>
            ))}
          </div>
        </section>
      )}
      {/* the tool dock (package Toolbar, docked bottom-center) */}
      <Toolbar dock style={{ maxWidth: "96vw", overflowX: "auto" }}>
        <ToolbarButton active={tool === "none"} onClick={() => setTool("none")} title="Browse">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
            <path d="M5 2 L5 20 L10 15 L13.5 22 L16 21 L12.5 14 L19 14 Z" />
          </svg>
          <span>Browse</span>
        </ToolbarButton>
        <ToolbarButton active={tool === "eraser"} onClick={() => setTool("eraser")} title="Unlearn">
          <img src={UN} alt="" style={{ height: 26, width: "auto" }} />
          <span>Unlearn</span>
        </ToolbarButton>
        <ToolbarButton active={tool === "pen"} onClick={() => setTool("pen")} title="Relearn">
          <img src={RE} alt="" style={{ height: 26, width: "auto" }} />
          <span>Relearn</span>
        </ToolbarButton>
        {tool === "pen" && (
          <span style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {PEN_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Pen colour ${c}`}
                style={{
                  height: 20,
                  width: 20,
                  flexShrink: 0,
                  borderRadius: 999,
                  cursor: "pointer",
                  border: `2px solid ${color === c ? "var(--color-ink)" : "#fff"}`,
                  background: c,
                }}
              />
            ))}
          </span>
        )}
        <ToolbarSeparator />
        <ToolbarButton onClick={() => setHide((v) => !v)} title={hide ? "Show notes" : "Hide notes"}>
          {hide ? "Show" : "Hide"}
        </ToolbarButton>
        <ToolbarButton onClick={addMyth} title="Add a myth">
          + myth
        </ToolbarButton>
        <ToolbarButton onClick={reset} title="Reset">
          reset
        </ToolbarButton>
      </Toolbar>
      {/* custom cursor: UN/RE mascot follows the pointer while a tool is active */}
      {active && fine && (
        <div ref={cursorRef} style={{ position: "fixed", left: 0, top: 0, zIndex: 60, pointerEvents: "none", transform: "translate(-300px,-300px)" }}>
          <span
            style={{
              position: "absolute",
              borderRadius: 999,
              transform: "translate(-50%,-50%)",
              ...(tool === "eraser"
                ? { width: ERASER_R * 2, height: ERASER_R * 2, border: "2px dashed rgba(34,20,54,.6)" }
                : { width: 8, height: 8, background: color }),
            }}
          />
          <img
            src={tool === "eraser" ? UN : RE}
            alt=""
            style={{ position: "absolute", height: 48, width: "auto", filter: "drop-shadow(0 4px 6px rgba(0,0,0,.3))" }}
          />
        </div>
      )}
    </>
  );
}

function NoteBody({ n }: { n: N }) {
  if (n.phase === "myth") {
    return (
      <>
        <NoteChip>myth</NoteChip>
        <p style={{ marginTop: 8, fontSize: 18, fontWeight: 700, lineHeight: 1.3, opacity: 1 - n.erase * 0.9, filter: `blur(${n.erase * 2.5}px)` }}>
          {n.data.myth}
        </p>
        <p style={{ marginTop: "auto", paddingTop: 8, fontSize: 12, opacity: 0.6 }}>rub me out with UN →</p>
      </>
    );
  }
  if (n.reveal === 0 && n.phase !== "truth") {
    return (
      <>
        <NoteChip truth>now relearn</NoteChip>
        <p style={{ marginTop: 8, fontSize: 16, opacity: 0.55 }}>reveal the truth with RE →</p>
      </>
    );
  }
  return (
    <>
      <NoteChip truth>{n.phase === "truth" ? "truth ✓" : "now relearn"}</NoteChip>
      <div style={{ opacity: n.phase === "truth" ? 1 : n.reveal }}>
        <p style={{ marginTop: 8, fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: "var(--color-brand)" }}>{n.data.truth}</p>
        <div style={{ marginTop: 4, height: 4, borderRadius: 999, background: "var(--color-grow)", width: `${(n.phase === "truth" ? 1 : n.reveal) * 90}%` }} />
        {n.phase === "truth" && n.data.explanation && <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>{n.data.explanation}</p>}
      </div>
    </>
  );
}
