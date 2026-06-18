"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Lock, Settings as SettingsIcon, Flame, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { Logo } from "@/components/logo";
import { PATH, type PathNode } from "@/content/path";

type Pt = { x: number; y: number };
type LNode = { node: PathNode; i: number; x: number; y: number; scale: number };
type Header = { id: string; title: string; subtitle: string; x: number; y: number; scale: number };
type Tile = { x: number; y: number; angle: number; along: number; across: number; key: number };

// --- perspective dials (≈50° tilt feel) ---
const Y0 = 132; // near node (START) y
const NEAR_GAP = 150; // spacing between the two nearest nodes
const GAP_DECAY = 0.8; // gaps shrink with depth
const FAR_SCALE = 0.5; // size of the farthest node
const ROAD_HALF = 60; // road half-width at the near end
const AMP = 74; // weave amplitude

const offsetFor = (i: number) => 72 * Math.sin(i * 0.85);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, n: number) => {
  const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const bankNoise = (s: number, seed: number) =>
  10 * Math.sin(s * 0.05 + seed) + 6 * Math.sin(s * 0.11 + seed * 1.7) + 4 * Math.sin(s * 0.23 + seed * 0.4);

function crPoint(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

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
  const [w, setW] = useState(380);

  useEffect(() => {
    function measure() {
      if (wrapRef.current) setW(wrapRef.current.clientWidth);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const scene = useMemo(() => {
    const flat = PATH.flatMap((s) => s.nodes.map((node) => ({ node, section: s })));
    const N = flat.length;
    const cx = w / 2;

    // node layout: near (i=0) at top/big, receding down with shrinking gaps + scale
    const nodes: LNode[] = [];
    let y = Y0;
    for (let i = 0; i < N; i++) {
      const scale = 1 - (1 - FAR_SCALE) * (i / (N - 1));
      if (i > 0) y += NEAR_GAP * Math.pow(GAP_DECAY, i - 1);
      nodes.push({ node: flat[i].node, i, x: cx + offsetFor(i) * scale, y, scale });
    }

    // section headers, just above each section's first node
    const headers: Header[] = [];
    let seen = 0;
    for (const s of PATH) {
      const n = nodes[seen];
      headers.push({ id: s.title, title: s.title, subtitle: s.subtitle, x: cx, y: n.y - 70 * n.scale, scale: n.scale });
      seen += s.nodes.length;
    }

    // sample a smooth spline through node centres (with per-sample scale)
    const center = (k: number) => nodes[Math.max(0, Math.min(N - 1, k))];
    const samples: Array<Pt & { s: number }> = [];
    const K = 12;
    for (let seg = 0; seg < N - 1; seg++) {
      const p0 = center(seg - 1);
      const p1 = center(seg);
      const p2 = center(seg + 1);
      const p3 = center(seg + 2);
      for (let k = 0; k < K; k++) {
        const t = k / K;
        const c = crPoint(p0, p1, p2, p3, t);
        samples.push({ x: c.x, y: c.y, s: lerp(p1.scale, p2.scale, t) });
      }
    }
    samples.push({ x: nodes[N - 1].x, y: nodes[N - 1].y, s: nodes[N - 1].scale });

    // grass banks + cobbles from the samples
    const lefts: Pt[] = [];
    const rights: Pt[] = [];
    let arc = 0;
    const tiles: Tile[] = [];
    let acc = Infinity;
    let ti = 0;
    for (let j = 0; j < samples.length; j++) {
      const cur = samples[j];
      const prev = samples[Math.max(0, j - 1)];
      const nxt = samples[Math.min(samples.length - 1, j + 1)];
      let tx = nxt.x - prev.x;
      let ty = nxt.y - prev.y;
      const m = Math.hypot(tx, ty) || 1;
      tx /= m;
      ty /= m;
      const nx = -ty;
      const ny = tx;
      const half = ROAD_HALF * cur.s;
      lefts.push({ x: cur.x + nx * (half + bankNoise(arc, 0.8) * cur.s), y: cur.y + ny * (half + bankNoise(arc, 0.8) * cur.s) });
      rights.push({ x: cur.x - nx * (half + bankNoise(arc, 4.2) * cur.s), y: cur.y - ny * (half + bankNoise(arc, 4.2) * cur.s) });

      const d = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      arc += d;
      acc += d;
      const need = 30 * cur.s + 8;
      if (acc >= need) {
        acc = 0;
        const along = (28 + rnd(ti, 1) * 16) * cur.s;
        const across = (52 + rnd(ti, 2) * 22) * cur.s;
        const lat = (rnd(ti, 4) - 0.5) * 16 * cur.s;
        const angle = (Math.atan2(ty, tx) * 180) / Math.PI + (rnd(ti, 5) - 0.5) * 20;
        tiles.push({ x: cur.x + nx * lat, y: cur.y + ny * lat, angle, along, across, key: ti });
        ti += 1;
      }
    }
    const grassD = closedSpline([...lefts, ...rights.reverse()]);
    const height = nodes[N - 1].y + 90;
    return { nodes, headers, tiles, grassD, height, N };
  }, [w]);

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

      <div ref={wrapRef} className="relative w-full" style={{ height: scene.height }}>
        <svg width={w} height={scene.height} className="pointer-events-none absolute left-0 top-0" aria-hidden>
          <path d={scene.grassD} fill="var(--grass-edge)" stroke="none" transform="translate(0 2)" />
          <path d={scene.grassD} fill="var(--grass)" stroke="var(--grass-edge)" strokeWidth={2} strokeLinejoin="round" />
          {scene.tiles.map((t) => (
            <g key={t.key}>
              <g transform={`translate(${t.x.toFixed(1)} ${(t.y + 3).toFixed(1)}) rotate(${t.angle.toFixed(1)})`}>
                <rect x={-t.along / 2} y={-t.across / 2} width={t.along} height={t.across} rx={9} fill="var(--path-edge)" />
              </g>
              <g transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) rotate(${t.angle.toFixed(1)})`}>
                <rect x={-t.along / 2} y={-t.across / 2} width={t.along} height={t.across} rx={9} fill="var(--path-fill)" stroke="var(--path-line)" strokeWidth={1.2} />
              </g>
            </g>
          ))}
        </svg>

        {scene.headers.map((h) => (
          <div
            key={h.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 text-center"
            style={{ left: h.x, top: h.y, transform: `translate(-50%,-50%) scale(${h.scale.toFixed(3)})` }}
          >
            <span className="whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground shadow-sm">{h.title}</span>
            <span className="whitespace-nowrap text-[11px] text-muted-foreground">{h.subtitle}</span>
          </div>
        ))}

        {scene.nodes.map((n) => (
          <div
            key={n.node.id}
            className="absolute"
            style={{ left: n.x, top: n.y, transform: `translate(-50%,-50%) scale(${n.scale.toFixed(3)})`, zIndex: 100 - n.i }}
          >
            <NodeCoin node={n.node} />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">More lessons are on the way ✨</p>
    </div>
  );
}

function NodeCoin({ node }: { node: PathNode }) {
  const isActive = node.status === "active";
  const inner = (
    <div className="relative flex flex-col items-center gap-1.5">
      {isActive && (
        <span className="absolute -top-8 z-10 animate-bounce whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-md">
          Start
        </span>
      )}
      <div className="relative">
        {isActive && <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-primary/25" aria-hidden />}
        <div
          className={
            isActive
              ? "relative grid size-20 place-items-center rounded-full border-4 border-primary bg-card transition-transform group-active:scale-95"
              : "relative grid size-[4.5rem] place-items-center rounded-full border border-border bg-card"
          }
          style={isActive ? { boxShadow: "0 16px 32px -8px var(--primary)" } : { boxShadow: "0 12px 24px -8px rgb(0 0 0 / 0.3)" }}
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
      <span className={`max-w-[9rem] whitespace-nowrap text-center text-sm font-bold leading-tight ${isActive ? "" : "text-muted-foreground"}`}>
        {node.title}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{isActive ? node.kind : "Soon"}</span>
    </div>
  );

  return isActive && node.href ? (
    <Link href={node.href} className="group" aria-label={`${node.title} — start`}>
      {inner}
    </Link>
  ) : (
    <div aria-disabled title="Coming soon" className="cursor-not-allowed">
      {inner}
    </div>
  );
}
