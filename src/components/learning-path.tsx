"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock, Settings as SettingsIcon, Flame, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { Logo } from "@/components/logo";
import { PATH, type PathNode } from "@/content/path";

type Pt = { x: number; y: number };
type Tile = { x: number; y: number; angle: number; along: number; across: number; key: number };

// Smooth winding offset (a gentle sine wave, both sides of centre).
const offsetFor = (i: number) => Math.round(66 * Math.sin(i * 0.8));

// Catmull-Rom spline through the points -> one smooth bezier (no kinks).
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function LearningPath() {
  const { profile } = useProfile();
  const wrapRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pathD, setPathD] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [tiles, setTiles] = useState<Tile[]>([]);

  // 1) Measure node centres -> smooth spline.
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

  // 2) Lay cobblestone tiles along the real curve (varied sizes, slight jitter).
  useEffect(() => {
    const path = roadRef.current;
    if (!path || !pathD) {
      setTiles([]);
      return;
    }
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      return;
    }
    if (!len) return;
    const rnd = (i: number, n: number) => {
      const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const out: Tile[] = [];
    let pos = 16;
    let i = 0;
    while (pos < len - 8) {
      const p = path.getPointAtLength(pos);
      const p2 = path.getPointAtLength(Math.min(pos + 1, len));
      const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
      const along = 30 + rnd(i, 1) * 16;
      const across = 50 + rnd(i, 2) * 14;
      out.push({
        x: +p.x.toFixed(1),
        y: +p.y.toFixed(1),
        angle: +angle.toFixed(1),
        along: +along.toFixed(1),
        across: +across.toFixed(1),
        key: i,
      });
      pos += along + 7 + rnd(i, 3) * 7;
      i += 1;
    }
    setTiles(out);
  }, [pathD, dims.w, dims.h]);

  let gi = -1;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6 pb-24 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">SwipeEd</p>
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
          {/* grass bed */}
          <path d={pathD} fill="none" stroke="var(--grass-edge)" strokeWidth={72} strokeLinecap="round" strokeLinejoin="round" />
          <path ref={roadRef} d={pathD} fill="none" stroke="var(--grass)" strokeWidth={62} strokeLinecap="round" strokeLinejoin="round" />
          {/* cobblestones (varied tiles, slight 3D lip) */}
          {tiles.map((t) => (
            <g key={t.key}>
              <g transform={`translate(${t.x} ${t.y + 3.5}) rotate(${t.angle})`}>
                <rect x={-t.along / 2} y={-t.across / 2} width={t.along} height={t.across} rx={10} fill="var(--path-edge)" />
              </g>
              <g transform={`translate(${t.x} ${t.y}) rotate(${t.angle})`}>
                <rect
                  x={-t.along / 2}
                  y={-t.across / 2}
                  width={t.along}
                  height={t.across}
                  rx={10}
                  fill="var(--path-fill)"
                  stroke="var(--path-line)"
                  strokeWidth={1.5}
                />
              </g>
            </g>
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
          Start
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
            <span className="text-3xl opacity-50 grayscale" aria-hidden>
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
