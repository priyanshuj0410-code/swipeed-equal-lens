"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock, Settings as SettingsIcon, Flame, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { Logo } from "@/components/logo";
import { PATH, type PathNode } from "@/content/path";

// Gentle serpentine: the nodes weave, and the dotted connector is drawn to follow them.
const OFFSETS = [0, 58, 30, -34, -64, -34, 30, 58];

export function LearningPath() {
  const { profile } = useProfile();
  const wrapRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pathD, setPathD] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });

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
      // Smooth S-curve through every node centre (control points at the vertical midpoint).
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const my = ((a.y + b.y) / 2).toFixed(1);
        d += ` C ${a.x.toFixed(1)} ${my}, ${b.x.toFixed(1)} ${my}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      setPathD(d);
      setDims({ w: wr.width, h: wr.height });
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    // re-measure once fonts settle (they change row heights)
    const t = setTimeout(measure, 350);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

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
        <svg
          width={dims.w}
          height={dims.h}
          className="pointer-events-none absolute left-0 top-0 z-0"
          aria-hidden
        >
          <path d={pathD} fill="none" stroke="var(--path-edge)" strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke="var(--path-fill)" strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke="var(--path-line)" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 18" strokeOpacity={0.75} />
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
                  offset={OFFSETS[index % OFFSETS.length]}
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
    <div className="relative z-10 flex justify-center py-2" style={{ transform: `translateX(${offset}px)` }}>
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
