"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock, Settings as SettingsIcon, Flame, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { Logo } from "@/components/logo";
import { EnvProp } from "@/components/scenery";
import { PATH, type PathNode } from "@/content/path";

type Pt = { x: number; y: number };
type Tile = { x: number; y: number; angle: number; along: number; across: number; key: number };

const offsetFor = (i: number) => Math.round(70 * Math.sin(i * 0.8));

const rnd = (i: number, n: number) => {
  const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// organic wobble for the grass banks (sum of sines -> natural undulation)
const bankNoise = (s: number, seed: number) =>
  11 * Math.sin(s * 0.05 + seed) + 6 * Math.sin(s * 0.11 + seed * 1.7) + 4 * Math.sin(s * 0.23 + seed * 0.4);

// Catmull-Rom through points -> smooth open path (no kinks).
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// Smooth CLOSED spline through a ring of points -> organic blob.
function closedSpline(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + " Z";
}

export function LearningPath() {
  const { profile } = useProfile();
  const wrapRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pathD, setPathD] = useState("");
  const [grassD, setGrassD] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [env, setEnv] = useState<
    Array<{ x: number; y: number; type: "tree" | "bush" | "rock" | "flower" | "tuft"; scale: number; flip: boolean; key: number }>
  >([]);

  useEffect(() => {
    function measure() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      const pts = circleRefs.current
        .filter((el): el is HTMLDivElement => Boolean(el))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
        });
      if (pts.length < 2) return;
      setPathD(smoothPath(pts));
      setDims({ w: wr.width, h: wr.height });
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 350);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  // Build the organic grass banks + lay irregular cobblestones along the curve.
  useEffect(() => {
    const path = roadRef.current;
    if (!path || !pathD) {
      setTiles([]);
      setGrassD("");
      return;
    }
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      return;
    }
    if (!len) return;

    const tangent = (s: number) => {
      const a = path.getPointAtLength(Math.max(0, s - 1.5));
      const b = path.getPointAtLength(Math.min(len, s + 1.5));
      let tx = b.x - a.x;
      let ty = b.y - a.y;
      const m = Math.hypot(tx, ty) || 1;
      return { tx: tx / m, ty: ty / m };
    };

    // --- grass banks (wobbly, varied width) ---
    const HALF = 54;
    const lefts: Pt[] = [];
    const rights: Pt[] = [];
    for (let s = 0; s <= len; s += 30) {
      const p = path.getPointAtLength(Math.min(s, len));
      const { tx, ty } = tangent(s);
      const nx = -ty;
      const ny = tx;
      const wl = HALF + bankNoise(s, 0.8);
      const wr = HALF + bankNoise(s, 4.2);
      lefts.push({ x: p.x + nx * wl, y: p.y + ny * wl });
      rights.push({ x: p.x - nx * wr, y: p.y - ny * wr });
    }
    setGrassD(closedSpline([...lefts, ...rights.reverse()]));

    // --- cobblestones (varied size, off-centre jitter, rotation wobble, slight overlap) ---
    const out: Tile[] = [];
    let pos = 14;
    let i = 0;
    while (pos < len - 8) {
      const p = path.getPointAtLength(pos);
      const { tx, ty } = tangent(pos);
      const nx = -ty;
      const ny = tx;
      const along = 32 + rnd(i, 1) * 18;
      const across = 58 + rnd(i, 2) * 30;
      const lat = (rnd(i, 4) - 0.5) * 18;
      const angle = (Math.atan2(ty, tx) * 180) / Math.PI + (rnd(i, 5) - 0.5) * 22;
      out.push({
        x: +(p.x + nx * lat).toFixed(1),
        y: +(p.y + ny * lat).toFixed(1),
        angle: +angle.toFixed(1),
        along: +along.toFixed(1),
        across: +across.toFixed(1),
        key: i,
      });
      pos += along * 0.72 + 7 + rnd(i, 3) * 7;
      i += 1;
    }
    setTiles(out);

    // --- roadside scenery (trees, bushes, flowers, rocks, tufts) ---
    const TYPES = ["tree", "bush", "flower", "rock", "tuft"] as const;
    const envOut: Array<{ x: number; y: number; type: (typeof TYPES)[number]; scale: number; flip: boolean; key: number }> = [];
    let ep = 64;
    let ei = 0;
    while (ep < len - 16) {
      const p = path.getPointAtLength(ep);
      const { tx, ty } = tangent(ep);
      const nx = -ty;
      const ny = tx;
      const side = ei % 2 === 0 ? 1 : -1;
      const off = HALF + 22 + rnd(ei, 6) * 30;
      envOut.push({
        x: +(p.x + nx * side * off).toFixed(1),
        y: +(p.y + ny * side * off).toFixed(1),
        type: TYPES[Math.floor(rnd(ei, 7) * TYPES.length)],
        scale: +(0.8 + rnd(ei, 8) * 0.55).toFixed(2),
        flip: side < 0,
        key: ei,
      });
      ep += 92 + rnd(ei, 9) * 70;
      ei += 1;
    }
    setEnv(envOut);
  }, [pathD, dims.w, dims.h]);

  let gi = -1;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6 pb-24 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">SwipeEd · The Equal Lens</p>
            <h1 className="text-lg font-bold leading-tight">Your path</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold shadow-sm ring-1 ring-border">
            <Flame className="size-3.5" style={{ color: "var(--flame)" }} aria-hidden /> {profile.bestStreak}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold shadow-sm ring-1 ring-border">
            <Star className="size-3.5" style={{ color: "var(--accent-amber)" }} fill="currentColor" aria-hidden /> {profile.coins}
          </span>
          <Link href="/settings" aria-label="Settings" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <SettingsIcon className="size-5" aria-hidden />
          </Link>
        </div>
      </header>

      <div ref={wrapRef} className="relative isolate flex flex-col gap-1">
        <svg width={dims.w} height={dims.h} className="pointer-events-none absolute left-0 top-0 z-0" aria-hidden>
          {/* invisible centreline used to sample positions */}
          <path ref={roadRef} d={pathD} fill="none" stroke="none" />
          {/* organic grass banks */}
          <path d={grassD} fill="var(--grass)" stroke="var(--grass-edge)" strokeWidth={7} strokeLinejoin="round" />
          {/* irregular cobblestones with a slight 3D lip */}
          {tiles.map((t) => (
            <g key={t.key}>
              <g transform={`translate(${t.x} ${t.y + 4}) rotate(${t.angle})`}>
                <rect x={-t.along / 2} y={-t.across / 2} width={t.along} height={t.across} rx={11} fill="var(--path-edge)" />
              </g>
              <g transform={`translate(${t.x} ${t.y}) rotate(${t.angle})`}>
                <rect
                  x={-t.along / 2}
                  y={-t.across / 2}
                  width={t.along}
                  height={t.across}
                  rx={11}
                  fill="var(--path-fill)"
                  stroke="var(--path-line)"
                  strokeWidth={1.5}
                />
              </g>
            </g>
          ))}
          {env.map((e) => (
            <EnvProp key={e.key} x={e.x} y={e.y} type={e.type} scale={e.scale} flip={e.flip} />
          ))}
        </svg>

        {PATH.map((section) => (
          <div key={section.title} className="relative z-10 flex flex-col gap-1">
            <div className="my-3 flex flex-col items-center gap-0.5 text-center">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
                {section.title}
              </span>
              <span className="text-[11px] text-muted-foreground">{section.subtitle}</span>
            </div>
            {section.nodes.map((node) => {
              gi += 1;
              const index = gi;
              return (
                <NodeRow
                  key={node.id}
                  node={node}
                  offset={offsetFor(index)}
                  registerRef={(el) => {
                    circleRefs.current[index] = el;
                  }}
                />
              );
            })}
          </div>
        ))}
        <p className="relative z-10 mt-5 text-center text-xs text-muted-foreground">More lessons are on the way ✨</p>
      </div>
    </div>
  );
}

function NodeRow({
  node,
  offset,
  registerRef,
}: {
  node: PathNode;
  offset: number;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const isActive = node.status === "active";

  const bubble = (
    <div className="relative flex flex-col items-center gap-1.5">
      {isActive && (
        <span className="absolute -top-7 z-10 animate-bounce rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-md">
          {node.id === "glrl" ? "Start" : "Play"}
        </span>
      )}
      <div className="relative">
        {isActive && <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-primary/25" aria-hidden />}
        <div
          ref={registerRef}
          className={
            isActive
              ? "relative grid size-20 place-items-center rounded-full border-4 border-primary bg-card transition-transform group-active:scale-95"
              : "relative grid size-[4.25rem] place-items-center rounded-full border border-border bg-card"
          }
          style={
            isActive
              ? { boxShadow: "0 16px 32px -8px var(--primary)" }
              : { boxShadow: "0 10px 22px -8px rgb(0 0 0 / 0.28)" }
          }
        >
          {node.id === "glrl" ? (
            <Logo className="size-11" />
          ) : (
            <span className={`text-3xl ${isActive ? "" : "opacity-50 grayscale"}`} aria-hidden>
              {node.emoji}
            </span>
          )}
          {!isActive && (
            <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
              <Lock className="size-3.5" aria-hidden />
            </span>
          )}
        </div>
      </div>
      <span className={`max-w-[8.5rem] text-center text-xs font-bold leading-tight ${isActive ? "" : "text-muted-foreground"}`}>
        {node.title}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{isActive ? node.kind : "Soon"}</span>
      {node.tag === "gender" && (
        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
          Equality
        </span>
      )}
    </div>
  );

  return (
    <div className="relative z-10 flex justify-center py-3" style={{ transform: `translateX(${offset}px)` }}>
      {isActive && node.href ? (
        <Link href={node.href} className="group" aria-label={`${node.title} — start`}>
          {bubble}
        </Link>
      ) : (
        <div aria-disabled title="Coming soon" className="cursor-not-allowed">
          {bubble}
        </div>
      )}
    </div>
  );
}
