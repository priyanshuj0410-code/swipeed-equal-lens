"use client";

import { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { SceneNode } from "@/components/path-scene";
import type { Chapter } from "@/content/path";
import { CANVAS_THEMES, themeForChapterIndex, type CanvasTheme } from "@/lib/canvas-themes";

// Phase 6 — the 2.5D parallax sticker canvas (coexists behind ?world=canvas; see docs/world-canvas.md).
// A vertical winding doodle trail through the 5 chapter themes, sticker scenery on parallax layers, Lensy
// walking, dotted paper. Pure DOM/SVG/CSS — no WebGL. v1: stub stickers (simple shapes); official themed
// packs swap in later. Reduced-motion → static (no parallax).

const GAP = 152; // vertical spacing between nodes
const TOP = 130;
const BOT = 200;
const AMP = 96; // winding amplitude
const COLW = 320; // trail column width

const INK = "var(--color-ink)";
const reduced = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const rand = (s: number) => {
  const x = Math.sin(s * 99.71) * 10000;
  return x - Math.floor(x);
};

function PineSticker({ theme, size = 64 }: { theme: CanvasTheme; size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 48 60" style={{ filter: "drop-shadow(2px 3px 0 var(--color-ink))" }} aria-hidden>
      <rect x="20" y="44" width="8" height="13" rx="2" fill="#9c6b43" stroke={INK} strokeWidth="2.5" />
      <path d="M24 4 L40 26 H8 Z" fill={theme.tree} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 18 L42 44 H6 Z" fill={theme.treeDark} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function CloudSticker({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 80 48" style={{ filter: "drop-shadow(2px 3px 0 rgba(34,20,54,0.18))" }} aria-hidden>
      <g fill="#ffffff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <ellipse cx="40" cy="32" rx="34" ry="13" />
        <circle cx="26" cy="24" r="13" />
        <circle cx="46" cy="20" r="16" />
        <circle cx="60" cy="27" r="11" />
      </g>
    </svg>
  );
}

export function WorldCanvas({
  nodes,
  chapters,
  onSelectNode,
}: {
  nodes: SceneNode[];
  chapters: Chapter[];
  onSelectNode: (n: SceneNode) => void;
  playing: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const rm = reduced();

  const chapterIndex = useMemo(() => {
    const m: Record<string, number> = {};
    chapters.forEach((c, i) => (m[c.key] = i));
    return m;
  }, [chapters]);

  const layout = useMemo(
    () =>
      nodes.map((n, i) => ({
        node: n,
        x: AMP * Math.sin(i * 0.92),
        y: TOP + i * GAP,
        themeI: Math.min(chapterIndex[n.chapter ?? ""] ?? 0, CANVAS_THEMES.length - 1),
      })),
    [nodes, chapterIndex]
  );
  const trailH = TOP + nodes.length * GAP + BOT;
  const W = COLW + 2 * AMP;

  // Far scenery (parallax): scatter trees once; recolour with the current theme.
  const farTrees = useMemo(
    () => Array.from({ length: Math.ceil(nodes.length * 0.7) }, (_, i) => ({ left: 4 + rand(i + 1) * 92, top: rand(i + 7) * (trailH * 0.32 + 600), size: 34 + rand(i + 3) * 26 })),
    [nodes.length, trailH]
  );
  const clouds = useMemo(
    () => Array.from({ length: Math.ceil(nodes.length * 0.5) }, (_, i) => ({ left: rand(i + 11) * 88, top: rand(i + 5) * (trailH * 0.12 + 700), size: 64 + rand(i + 2) * 70, dur: 5 + rand(i) * 3 })),
    [nodes.length, trailH]
  );

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollTop + el.clientHeight / 2;
    const i = Math.min(Math.max(Math.round((center - TOP) / GAP), 0), nodes.length - 1);
    setThemeIdx(Math.min(chapterIndex[nodes[i]?.chapter ?? ""] ?? 0, CANVAS_THEMES.length - 1));
    if (!rm) {
      const sy = el.scrollTop;
      if (cloudRef.current) cloudRef.current.style.transform = `translateY(${-sy * 0.12}px)`;
      if (farRef.current) farRef.current.style.transform = `translateY(${-sy * 0.32}px)`;
    }
  };

  const theme = themeForChapterIndex(themeIdx);
  // day/night tint (inline, by device clock)
  const h = new Date().getHours();
  const tint = h >= 19 || h < 6 ? "rgba(28,22,58,0.42)" : h >= 17 ? "rgba(255,176,80,0.14)" : "transparent";
  // Lensy parks at the first playable node (else the first).
  const lensy = layout.find((l) => l.node.state === "playable") ?? layout[0];
  const trailPath = layout.map((l, i) => `${i === 0 ? "M" : "L"} ${W / 2 + l.x} ${l.y}`).join(" ");

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="fixed inset-0 z-0 overflow-y-auto overflow-x-hidden"
      style={{ background: `linear-gradient(180deg, ${theme.skyTop} 0%, ${theme.skyBottom} 60%, ${theme.ground} 100%)`, transition: "background 0.6s ease" }}
    >
      {/* dotted paper */}
      <div className="pointer-events-none fixed inset-0" style={{ backgroundImage: "radial-gradient(rgba(34,20,54,0.06) 1.4px, transparent 1.5px)", backgroundSize: "22px 22px" }} aria-hidden />

      {/* clouds — slow parallax */}
      <div ref={cloudRef} className="pointer-events-none fixed inset-x-0 top-0" style={{ height: `calc(100vh + ${trailH * 0.12}px)`, willChange: "transform" }} aria-hidden>
        {clouds.map((c, i) => (
          <div key={i} className={rm ? "absolute" : "absolute anim-float"} style={{ left: `${c.left}%`, top: c.top, animationDuration: `${c.dur}s` }}>
            <CloudSticker size={c.size} />
          </div>
        ))}
      </div>

      {/* far treeline — medium parallax (recolours with theme) */}
      <div ref={farRef} className="pointer-events-none fixed inset-x-0 top-0" style={{ height: `calc(100vh + ${trailH * 0.32}px)`, willChange: "transform" }} aria-hidden>
        {farTrees.map((t, i) => (
          <div key={i} className="absolute opacity-80" style={{ left: `${t.left}%`, top: t.top, transform: "translateX(-50%)" }}>
            <PineSticker theme={theme} size={t.size} />
          </div>
        ))}
      </div>

      {/* the trail content (scrolls 1×) */}
      <div className="relative mx-auto" style={{ width: W, height: trailH }}>
        {/* mid scenery — a couple of trees per node row, in flow (depth via size) */}
        {layout.map((l, i) =>
          i % 2 === 0 ? (
            <div key={`t${i}`} className="absolute" style={{ left: W / 2 - l.x - 116, top: l.y - 30 }} aria-hidden>
              <PineSticker theme={themeForChapterIndex(l.themeI)} size={56 + rand(i + 9) * 22} />
            </div>
          ) : null
        )}

        {/* the doodle trail */}
        <svg className="absolute inset-0" width={W} height={trailH} aria-hidden>
          <path d={trailPath} fill="none" stroke="var(--color-ink)" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.18} />
          <path d={trailPath} fill="none" stroke="var(--color-surface)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 16" opacity={0.9} />
        </svg>

        {/* node stickers */}
        {layout.map((l) => {
          const n = l.node;
          const soon = n.state === "soon";
          const done = n.state === "completed";
          return (
            <button
              key={n.id}
              type="button"
              disabled={soon}
              onClick={() => onSelectNode(n)}
              title={n.label}
              className="hover-pop absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-3xl disabled:cursor-default"
              style={{
                left: W / 2 + l.x,
                top: l.y,
                background: soon ? "#e9e6f0" : "var(--color-surface)",
                border: `3px solid ${soon ? "#b8b2c6" : n.hex}`,
                boxShadow: "3px 3px 0 0 var(--color-ink)",
                opacity: soon ? 0.7 : 1,
                filter: soon ? "grayscale(0.5)" : undefined,
              }}
            >
              <span aria-hidden>{n.emoji}</span>
              {done && (
                <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full" style={{ background: "var(--color-insight)", border: "2px solid var(--color-ink)" }}>
                  <Check className="size-3.5 text-white" aria-hidden />
                </span>
              )}
              {n.capstone && !soon && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg" aria-hidden>👑</span>
              )}
            </button>
          );
        })}

        {/* Lensy walks the trail */}
        {lensy && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/brand/lensy/lensy-wave.svg"
            alt=""
            aria-hidden
            className={rm ? "absolute -translate-x-1/2" : "absolute -translate-x-1/2 anim-bob"}
            style={{ left: W / 2 + lensy.x + 58, top: lensy.y - 8, width: 76, height: 76, objectFit: "contain" }}
          />
        )}
      </div>

      {/* day/night tint */}
      {tint !== "transparent" && <div className="pointer-events-none fixed inset-0" style={{ background: tint }} aria-hidden />}
    </div>
  );
}
