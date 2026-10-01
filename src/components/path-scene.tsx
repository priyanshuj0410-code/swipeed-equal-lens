"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { Check, Lock, Play, Trophy } from "lucide-react";
import { tokens } from "@equal-lens/brand"; // canvas-world brand colours: single source (retheme via the library)
import { NODES, CHAPTERS, type Chapter } from "@/content/path";
import { CANVAS_MYTHS, CHAPTER_CANVAS } from "@/content/chapter-canvas";
import { unlearnTool, useUnlearnTool, type UnlearnToolName } from "@/lib/unlearn-tool";
import { firstName } from "@/lib/personalize";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Card as GameCardT, Flag as FlagT } from "@/lib/types";

// Kenney "Platformer Kit" world (CC0): tiled grass-block land, blocky grass mountains, a
// planked winding path (platform tiles), Kenney grass tufts with GPU wind, Kenney clouds,
// stylized props, a following-shadow sun, and a light cinematic post chain.

const TOON_GRAD = (() => {
  const steps = [110, 165, 210, 245];
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => {
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  });
  const t = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
})();

const NODE_AMP = 3; // horizontal swing: nodes rest at x = ±NODE_AMP (closer to centre)
const NODE_DZ = 3.5; // vertical distance between consecutive nodes (half a sine period)
const SINE_START_Z = 18; // z of the first (bottom) node
const SINE_SAMPLES_PER_NODE = 12; // control points between nodes → smooth (not zigzag) sine
// Each node sits on a sine extremum; a crest+trough (2 empty extrema) is skipped at every chapter
// boundary so the chapter sign gets clear space. nodeSlots → the extremum index for each node.
function nodeSlots(ns: ReadonlyArray<{ chapter?: string }>): { slot: number[]; total: number } {
  const slot: number[] = [];
  let s = 0;
  for (let i = 0; i < ns.length; i++) {
    if (i > 0 && ns[i].chapter !== ns[i - 1].chapter) s += 2; // skip a crest + a trough
    slot[i] = s;
    s += 1;
  }
  return { slot, total: Math.max(1, s) };
}
const SINE_TOTAL = nodeSlots(NODES).total; // total extrema, including the chapter-gap slots
const CURVE = new THREE.CatmullRomCurve3(
  Array.from({ length: (SINE_TOTAL - 1) * SINE_SAMPLES_PER_NODE + 1 }, (_, k) => {
    const t = k / SINE_SAMPLES_PER_NODE; // slot space (integer t = an extremum; nodes sit on some)
    return new THREE.Vector3(NODE_AMP * Math.cos(Math.PI * t), 0, SINE_START_Z - t * NODE_DZ);
  }),
  false,
  "catmullrom",
  0.5
);
// World extent derived from the path, so scenery stretches to cover its full length.
const PATH_START_Z = SINE_START_Z;
const PATH_END_Z = SINE_START_Z - (SINE_TOTAL - 1) * NODE_DZ;
const PATH_MID_Z = (PATH_START_Z + PATH_END_Z) / 2;
const PATH_SPAN_Z = PATH_START_Z - PATH_END_Z;

export type NodeState = "completed" | "playable" | "soon" | "locked";
export type SceneNode = {
  id: string;
  label: string;
  state: NodeState;
  href?: string;
  emoji: string;
  hex: string; // thread tint (one colour per node)
  capstone?: boolean;
  game?: string; // dispatch id when built
  chapter?: string;
};

// Fallback nodes if the host doesn't pass real ones (the /path page derives them from
// the node table + saved progress and passes them in).
const DEFAULT_NODES: SceneNode[] = [
  { id: "glrl", label: "Green Light / Red Light", state: "playable", href: "/decks", emoji: "🚦", hex: "#5b8def" },
  { id: "n2", label: "Coming soon", state: "soon", emoji: "🌱", hex: "#7C3AED" },
  { id: "n3", label: "Coming soon", state: "soon", emoji: "💬", hex: "#EC4899" },
  { id: "n4", label: "Coming soon", state: "soon", emoji: "🤝", hex: "#0EA5E9" },
  { id: "n5", label: "Coming soon", state: "soon", emoji: "⭐", hex: "#EAB308" },
];
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const CANVAS_PAPER = tokens.light.paper; // #FBF9FF: from @equal-lens/brand
const CANVAS_DOT = tokens.light.mist; // #E7E0F1: from @equal-lens/brand
// Adult chapters (Ch.6-8) use the brand's dark [data-audience="adult"] flip. The DOM overlays inherit
// it from the CSS tokens; the 3D dotted-paper surfaces read these SHARED THREE.Colors, which the
// ThemeController lerps as the camera crosses from the kids' stretch into the adult one.
const CANVAS_PAPER_DARK = tokens.dark.paper; // #15101F
const CANVAS_DOT_DARK = tokens.dark.mist; // #3A2E4D
const _themePaper = new THREE.Color(CANVAS_PAPER); // the live paper colour, shared by every material
const _themeDot = new THREE.Color(CANVAS_DOT); // the live dot colour
const _LIGHT_PAPER = new THREE.Color(CANVAS_PAPER);
const _DARK_PAPER = new THREE.Color(CANVAS_PAPER_DARK);
const _LIGHT_DOT = new THREE.Color(CANVAS_DOT);
const _DARK_DOT = new THREE.Color(CANVAS_DOT_DARK);

// The brand's dark palette (tokens.dark). Applied as INLINE custom properties on <html> for the
// adult chapters: inline styles beat every selector and inherit to all descendants, so the DOM
// overlays flip reliably even though Tailwind v4's @import layering out-cascades the brand's own
// [data-audience="adult"] block. data-audience is still toggled for color-scheme + the brand's
// component-level dark rules (.note, …) and the app's derived-token block.
const ADULT_TOKENS: Record<string, string> = {
  "--color-paper": "#15101f",
  "--color-surface": "#221a30",
  "--color-mist": "#3a2e4d",
  "--color-ink": "#f1ecfa",
  "--color-brand": "#c9b8e6",
  "--color-brandsoft": "#b3a4d6",
  "--color-band": "#241b38",
  "--dot": "#2a2140",
};
function applyAudience(adult: boolean) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (adult) {
    el.setAttribute("data-audience", "adult");
    for (const k in ADULT_TOKENS) el.style.setProperty(k, ADULT_TOKENS[k]);
  } else {
    el.removeAttribute("data-audience");
    for (const k in ADULT_TOKENS) el.style.removeProperty(k);
  }
}

// ============================================================================================
// Dotted-paper ground: FRESH (no makePaperTex / no texture). The brand canvas: paper #FBF9FF with
// #ECE6F6 dots on a WORLD-SPACE grid, drawn procedurally in a shader. Each dot is computed from the
// world XZ position, so it stays a crisp anti-aliased circle at any distance or camera angle: no
// texture tiling, no stretching toward the horizon, no mip blur. Two knobs: GAP (spacing) + DOT (radius).
// ============================================================================================
function CanvasGround() {
  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uPaper: { value: _themePaper },
        uDot: { value: _themeDot },
        uGap: { value: 0.44 }, // world units between dots (smaller = finer/denser)
        uRadius: { value: 0.02 }, // dot radius in world units (smaller = finer dots)
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos;
        uniform vec3 uPaper;
        uniform vec3 uDot;
        uniform float uGap;
        uniform float uRadius;
        void main() {
          vec2 cell = fract(vWorldPos.xz / uGap) - 0.5;   // offset to the nearest grid point
          float d = length(cell) * uGap;                  // world-space distance to that dot centre
          float aa = 0.22 * fwidth(d) + 1e-5;             // sub-pixel edge → crisp dots
          float dot = 1.0 - smoothstep(uRadius - aa, uRadius + aa, d);
          gl_FragColor = vec4(mix(uPaper, uDot, dot), 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
    return m;
  }, []);
  useEffect(() => () => mat.dispose(), [mat]);
  return (
    <mesh material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PATH_MID_Z]}>
      <planeGeometry args={[1600, PATH_SPAN_Z + 900]} />
    </mesh>
  );
}

// Progress trail (Nodes & Navigation spec §6): the route you've walked inks over in Grow Coral, a solid
// line drawn in BEHIND the player along the path; ahead stays dotted paper. Replaces any progress bar.
// uProgress = the furthest you've reached (a high-water mark, so reviewing earlier nodes never erases it).
function ProgressTrail({ progress }: { progress: React.MutableRefObject<number> }) {
  const maxRef = useRef(0);
  const { geometry, material } = useMemo(() => {
    const N = Math.max(2, Math.ceil(CURVE.getLength() / 0.5));
    const base = CURVE.getSpacedPoints(N); // arc-length spaced → uv.x = i/N matches the progress param
    // straight lead-in behind the start (uv.x < 0, always inked) so the line trails off the screen edge
    // instead of stopping mid-page when you're near the beginning.
    const pts: THREE.Vector3[] = [];
    const uvx: number[] = [];
    // lead-in continues the SINE below the first node (t < 0) so the trail keeps waving off the bottom
    // edge instead of a straight stub. Sampled at the main curve's density; always inked (uvx < 0).
    const LEAD_NODES = 2; // sine half-waves extended below the first node
    for (let t = -LEAD_NODES; t < -1e-6; t += 1 / SINE_SAMPLES_PER_NODE) {
      pts.push(new THREE.Vector3(NODE_AMP * Math.cos(Math.PI * t), 0, SINE_START_Z - t * NODE_DZ));
      uvx.push(-0.02);
    }
    for (let i = 0; i <= N; i++) {
      pts.push(base[i]);
      uvx.push(i / N);
    }
    const hw = 0.04; // half-width of the inked line (world units): very lean trail (1/4)
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const M = pts.length - 1;
    for (let i = 0; i <= M; i++) {
      const p = pts[i];
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(M, i + 1)];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      pos.push(p.x + nx * hw, 0.12, p.z + nz * hw);
      uv.push(uvx[i], 0);
      pos.push(p.x - nx * hw, 0.12, p.z - nz * hw);
      uv.push(uvx[i], 1);
      if (i < M) {
        const k = i * 2;
        idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uProgress: { value: 0 }, uColor: { value: new THREE.Color(tokens.violet[400]) } }, // subtle purple (#7F65A4)
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uProgress;
        uniform vec3 uColor;
        void main() {
          if (vUv.x > uProgress) discard;                                  // ahead of you = bare dotted paper
          float tip = smoothstep(0.0, 0.005, uProgress - vUv.x);           // soft 'just-inked' leading tip
          float across = 1.0 - smoothstep(0.6, 1.0, abs(vUv.y - 0.5) * 2.0); // soft line edges
          float a = tip * across;
          if (a < 0.02) discard;
          gl_FragColor = vec4(uColor, a);
          #include <colorspace_fragment>
        }
      `,
    });
    return { geometry: g, material: m };
  }, []);
  // eslint-disable-next-line react-hooks/immutability -- three.js objects are mutated per frame inside useFrame, the React Three Fiber pattern
  useFrame(() => {
    maxRef.current = Math.max(maxRef.current, clamp01(progress.current));
    // eslint-disable-next-line react-hooks/immutability -- three.js objects are mutated per frame inside useFrame, the React Three Fiber pattern
    material.uniforms.uProgress.value = maxRef.current;
  });
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );
  return <mesh geometry={geometry} material={material} renderOrder={1} />;
}

// Node u-positions along the curve. One node per sine extremum → uniform spacing, so node i sits
// exactly on control point i (a left/right turn of the wave). Each chapter wall/door sits at the
// midpoint between a capstone and the next chapter's first node. Also returns each door wall's u.
function chapterSpacedUs(nodes: SceneNode[]): { nodeU: number[]; wallU: number[]; wallCap: number[] } {
  const { slot, total } = nodeSlots(nodes);
  const span = Math.max(1, total - 1);
  const cl = (x: number) => Math.max(0, Math.min(1, x));
  const nodeU = nodes.map((_, i) => cl(slot[i] / span));
  return { nodeU, wallU: [], wallCap: [] }; // door walls removed: no wall positions
}

// The companion is now the brand flying ship (DOM/SVG, see Companion): no GLB to preload.

// --- node markers ----------------------------------------------------------------------
// Bubble colour comes from the node's thread hex; state changes the *treatment* (full vs
// greyed) and the icon: colour carries the thread, per the single-path design.
function nodeShades(hex: string, state: NodeState, capstone: boolean) {
  const c = new THREE.Color(hex);
  if (state === "soon" || state === "locked") c.lerp(new THREE.Color("#8b93a0"), capstone ? 0.22 : 0.72); // capstones stay gold; not-built/locked lessons grey out
  const hx = (x: THREE.Color) => `#${x.getHexString()}`;
  return {
    badge: hx(c.clone().lerp(new THREE.Color("#000000"), 0.12)),
    ring: hx(c.clone().lerp(new THREE.Color("#ffffff"), 0.55)),
    pedestal: hx(c.clone().lerp(new THREE.Color("#000000"), 0.28)),
  };
}

function NodeIcon({ state, capstone }: { state: NodeState; capstone: boolean }) {
  if (capstone) return <Trophy className="size-4" aria-hidden />;
  if (state === "completed") return <Check className="size-4" strokeWidth={3} aria-hidden />;
  if (state === "playable") return <Play className="size-4 translate-x-px" fill="currentColor" strokeWidth={0} aria-hidden />;
  return <Lock className="size-[0.8rem]" aria-hidden />;
}

// Render an emoji to a canvas (system colour-emoji font) -> texture for a 3D billboard.
function useEmojiTexture(emoji: string, grey = false) {
  const tex = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${Math.round(size * 0.78)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (grey) ctx.filter = "grayscale(1)"; // locked lessons render greyscale
    ctx.fillText(emoji, size / 2, size * 0.56);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [emoji, grey]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

// node ids whose completion beat (the earned-sticker 'drop') has already played: persisted, so it fires
// only on a NEW completion, never when a done node scrolls into view or on reload.
const _celebrated: Set<string> = (() => {
  try {
    return new Set<string>(JSON.parse((typeof localStorage !== "undefined" && localStorage.getItem("swipeed.celebrated")) || "[]"));
  } catch {
    return new Set<string>();
  }
})();
function _markCelebrated(id: string) {
  _celebrated.add(id);
  try {
    localStorage.setItem("swipeed.celebrated", JSON.stringify([..._celebrated]));
  } catch {
    /* ignore */
  }
}
function Node({
  node,
  u,
  progress,
  onSelect,
  reduced,
  canvas,
  active,
  playerName,
}: {
  node: SceneNode;
  u: number;
  progress: React.MutableRefObject<number>;
  onSelect?: (n: SceneNode) => void;
  reduced: boolean;
  canvas: boolean;
  active: boolean; // the single "play me next" node: gets Lensy + the re-sketching ring
  playerName?: string;
}) {
  const pos = useMemo(() => CURVE.getPointAt(u), [u]);
  const spr = useRef<THREE.Sprite>(null);
  const cap = !!node.capstone;
  const soon = node.state === "soon";
  const locked = node.state === "locked";
  const blocked = soon || locked; // non-interactive: not-built ("soon") OR prereq-gated ("locked")
  const completed = node.state === "completed";
  const tilt = completed ? ([...node.id].reduce((s, c) => s + c.charCodeAt(0), 0) % 9) - 4 : 0; // jaunty 'stuck-on' angle per node
  const greyEmoji = blocked && !cap; // capstones keep their gold; not-built/locked lessons grey out
  const tex = useEmojiTexture(node.emoji, greyEmoji);
  const st = nodeShades(node.hex, node.state, cap);
  const bob = node.state === "playable";
  const sprScale = canvas ? (cap ? 4.6 : 3.7) : cap ? 2.5 : 1.8;
  const [inView, setInView] = useState(false);
  const inViewRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  // completion beat: play the earned-sticker 'drop' once, only on a NEW completion (not reload / re-scroll)
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    if (canvas && completed && !_celebrated.has(node.id)) {
      _markCelebrated(node.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the beat follows the localStorage record of celebrated nodes
      setBeat(true);
      const t = setTimeout(() => setBeat(false), 950);
      return () => clearTimeout(t);
    }
  }, [canvas, completed, node.id]);
  useFrame((s) => {
    if (spr.current) {
      spr.current.position.y = canvas ? 0.35 : 0.2 + (bob && !reduced ? Math.sin(s.clock.elapsedTime * 1.6) * 0.18 : 0); // canvas: no bob (spec, stuck on, never hovering)
    }
    // reveal the name when the node is at / just ahead of the camera focus
    // (touch has no hover, so on-screen nodes label themselves)
    const ahead = u - progress.current;
    const vis = ahead > -0.03 && ahead < 0.09;
    if (vis !== inViewRef.current) {
      inViewRef.current = vis;
      setInView(vis);
    }
  });
  // progress is the camera rig's shared ref, so writing it from a handler is intended
  const focus = () => {
    // eslint-disable-next-line react-hooks/immutability -- see above
    progress.current = u; // camera glides to a focused/selected node
  };
  const select = () => {
    // eslint-disable-next-line react-hooks/immutability -- see above
    progress.current = u;
    if (!blocked) onSelect?.(node);
  };
  // ---- canvas skin: a real Equal Lens DOM sticker (drei <Html>) using the site's own .sticker-soft
  // recipe + brand tokens: so it auto dark-flips, always faces the camera, and reuses the actual CSS
  // (not a hand-painted texture). Lift shadow = 'tappable' (spec §2); Locked is flat/un-inked. The glyph
  // is the lesson emoji, a stand-in for the game's hand-drawn sticker motif. ----
  if (canvas) {
    return (
      <group position={[pos.x, 0.13, pos.z]}>
        <Html center position={[0, 0, 0]} distanceFactor={17.6} zIndexRange={[30, 0]}>
          <div className="pointer-events-none relative flex flex-col items-center">
            <button
              type="button"
              aria-label={`${node.label}, ${cap ? "capstone, " : ""}${locked ? "locked, finish earlier lessons first" : soon ? "coming soon" : node.state === "completed" ? "done" : "play"}`}
              disabled={blocked}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onFocus={() => {
                focus();
                setHovered(true);
              }}
              onBlur={() => setHovered(false)}
              onClick={select}
              style={completed ? { transform: `rotate(${tilt}deg)` } : undefined}
              className={`pointer-events-auto relative grid place-items-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--violet-200)] disabled:cursor-default ${cap ? "size-40 bg-[var(--color-sun)]" : "size-32 bg-[var(--color-paper)]"} ${blocked ? "node-locked" : completed ? "sticker-soft" : "sticker-soft hover-pop"}`}
            >
              <span className={`leading-none ${cap ? "text-[64px]" : "text-[52px]"} ${blocked ? "opacity-50 grayscale" : ""}`}>{node.emoji}</span>
              {/* up-next: a small Grow-Coral play mark. done: a coral 'earned' check badge stamped on the corner */}
              {!blocked && !active && !completed && (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[var(--color-grow)]" aria-hidden>
                  <svg viewBox="0 0 20 20" className="size-6">
                    <path d="M6 4 L6 16 L16 10 Z" fill="currentColor" />
                  </svg>
                </span>
              )}
              {completed && (
                <span className={`absolute -right-1 -top-1 grid size-9 place-items-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-grow)] text-[var(--color-paper)] ${beat ? "beat-badge" : ""}`} aria-hidden>
                  <svg viewBox="0 0 20 20" className="size-5">
                    <path d="M4 11 l4 4 l8 -10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
            {/* completion beat: a one-shot Unlearn→Relearn burst ring when this node has just been completed */}
            {beat && <span aria-hidden className="beat-burst pointer-events-none absolute left-1/2 top-1/2 rounded-full border-4" style={{ width: cap ? 170 : 142, height: cap ? 170 : 142 }} />}
            {/* Active node (spec §3/§5): the single 'play me next', a re-sketching Equal-Violet ring +
                Lensy perched with a 'Play?' bubble. The strongest on-brand play cue; replaces the play mark. */}
            {active && (
              <>
                <svg viewBox="0 0 160 160" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: cap ? 196 : 160, height: cap ? 196 : 160 }}>
                  <circle cx="80" cy="80" r="73" fill="none" stroke="var(--color-brand)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="459" className="sketch-ring" />
                </svg>
                <div className="pointer-events-none absolute -top-11 right-0 flex translate-x-1/4 flex-col items-center">
                  <span style={{ fontFamily: "var(--font-hand)" }} className="mb-0.5 whitespace-nowrap rounded-full border-2 border-[var(--violet-600)] bg-[var(--color-paper)] px-2 py-0.5 text-[13px] font-bold text-[var(--color-ink)]">
                    {firstName(playerName) ? `Play, ${firstName(playerName)}?` : "Play?"}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element -- a small decorative SVG; next/image does not optimise vectors */}
                  <img src="/brand/lensy/lensy-wave.svg" alt="" className="anim-bob w-16" />
                </div>
              </>
            )}
            <span
              style={{ fontFamily: "var(--font-hand)" }}
              className={`pointer-events-none absolute bottom-full mb-2.5 block select-none whitespace-nowrap rounded-md border-2 border-[var(--violet-600)] bg-[var(--color-paper)] px-2.5 py-1 text-[16.5px] font-bold text-[var(--color-ink)] transition-opacity duration-150 ${
                inView || hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {node.label}
            </span>
          </div>
        </Html>
      </group>
    );
  }
  return (
    <group position={[pos.x, 1.5, pos.z]}>
      <mesh position={[0, -1.0, 0]} castShadow receiveShadow scale={cap ? 1.22 : 1}>
        <cylinderGeometry args={[0.95, 1.05, 0.36, 24]} />
        <meshToonMaterial color={st.pedestal} gradientMap={TOON_GRAD} />
      </mesh>
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={cap ? 1.22 : 1}>
        <torusGeometry args={[1.05, 0.07, 8, 32]} />
        <meshToonMaterial color={st.ring} gradientMap={TOON_GRAD} emissive={st.ring} emissiveIntensity={soon ? 0 : cap ? 0.45 : 0.3} />
      </mesh>
      {/* lesson emoji billboard (replaces the gem); dimmed when not built */}
      <sprite ref={spr} scale={[sprScale, sprScale, sprScale]}>
        <spriteMaterial map={tex} transparent depthWrite={false} opacity={greyEmoji ? 0.5 : cap && soon ? 0.92 : 1} fog={false} />
      </sprite>
      {/* accessible DOM button overlay: tap / keyboard target + colour-blind-safe state badge.
          The lesson name shows above on hover / focus / in-view. */}
      <Html center position={[0, cap ? 1.7 : 1.35, 0]} distanceFactor={11} zIndexRange={[30, 0]}>
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            aria-label={`${node.label}, ${cap ? "capstone, " : ""}${node.state === "soon" ? "not built yet" : node.state}`}
            disabled={soon}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={focus}
            onClick={select}
            style={{ background: st.badge }}
            className={`peer pointer-events-auto flex items-center justify-center rounded-full text-foreground shadow-md ring-2 ring-foreground/85 transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110 focus-visible:ring-4 focus-visible:ring-white disabled:cursor-default disabled:opacity-95 ${cap ? "size-10" : "size-8"}`}
          >
            <NodeIcon state={node.state} capstone={cap} />
          </button>
          <span
            className={`glass-pill pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md backdrop-saturate-150 transition-opacity duration-150 ${
              inView ? "opacity-100" : "opacity-0 peer-hover:opacity-100 peer-focus-visible:opacity-100"
            }`}
          >
            {node.label}
          </span>
        </div>
      </Html>
    </group>
  );
}

// Chapter region signs floating above the first node of each chapter (the single path
// stays one path; these just label the 5 age-band regions along it). Each fades in only as
// you approach its chapter boundary and out once you've entered, like the node labels.
function ChapterBanner({ ch, u, p, progress }: { ch: Chapter; u: number; p: THREE.Vector3; progress: React.MutableRefObject<number> }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(false);
  useFrame(() => {
    const ahead = u - progress.current;
    const vis = ahead > -0.045 && ahead < 0.07; // near the boundary only
    if (vis !== ref.current) {
      ref.current = vis;
      setInView(vis);
    }
  });
  return (
    <Html center position={[p.x, p.y, p.z]} distanceFactor={26} zIndexRange={[60, 40]}>
      <div
        className={`glass-pill pointer-events-none flex select-none flex-col items-center whitespace-nowrap rounded-xl px-3 py-1 text-center backdrop-blur-md backdrop-saturate-150 transition-opacity duration-300 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-xs font-bold leading-tight">{ch.title}</span>
        <span className="text-[10px] font-medium leading-tight opacity-85">{ch.subtitle}</span>
      </div>
    </Html>
  );
}

function ChapterBanners({ chapters, nodes, progress }: { chapters: Chapter[]; nodes: SceneNode[]; progress: React.MutableRefObject<number> }) {
  const marks = useMemo(() => {
    const { slot, total } = nodeSlots(nodes);
    const span = Math.max(1, total - 1);
    return chapters
      .map((ch) => {
        const idx = nodes.findIndex((n) => n.chapter === ch.key);
        if (idx < 0) return null;
        // sit the sign ON the curve, centred in the empty crest+trough gap before the chapter's
        // first node (Ch.1 has no gap, so it rides the lead-in tail). A zero-crossing → x = 0.
        const t = idx === 0 ? -0.5 : slot[idx] - 1.5;
        const p = new THREE.Vector3(0, 0.13, SINE_START_Z - t * NODE_DZ);
        return { ch, u: t / span, p };
      })
      .filter((m): m is { ch: Chapter; u: number; p: THREE.Vector3 } => m !== null);
  }, [chapters, nodes]);
  return (
    <>
      {marks.map(({ ch, u, p }) => (
        <ChapterBanner key={ch.key} ch={ch} u={u} p={p} progress={progress} />
      ))}
    </>
  );
}

const _hashStr = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

// Chapter "canvas dressing" (Chapter Canvas Theming doc): each chapter's myths scattered as
// struck-through sticky notes along that chapter's stretch of the path: bias drawn on the page
// (teal UN strike) with the truth RE writes (coral) below. A curated few per chapter; windowed so
// only the nearby notes mount.
function CanvasContent({ nodes, progress, pointers }: { nodes: SceneNode[]; progress: React.MutableRefObject<number>; pointers: React.MutableRefObject<Map<number, number>> }) {
  const { tool, hide, resetSeq } = useUnlearnTool();
  const placed = useMemo(() => {
    const us = chapterSpacedUs(nodes).nodeU;
    const chKeys = CHAPTERS.map((c) => c.key); // index i -> chapter (i + 1)
    const chZ = new Map<number, { lo: number; hi: number }>();
    nodes.forEach((n, i) => {
      const ci = chKeys.indexOf(n.chapter ?? "");
      if (ci < 0) return;
      const z = CURVE.getPointAt(us[i]).z;
      const e = chZ.get(ci + 1) ?? { lo: z, hi: z };
      e.lo = Math.max(e.lo, z); // larger z = lower (bottom of the section)
      e.hi = Math.min(e.hi, z); // smaller z = higher (top)
      chZ.set(ci + 1, e);
    });
    const tones = ["note--yellow", "note--mint", "note--peach", "note--violet"];
    const out: { id: string; x: number; z: number; rot: number; tone: string; myth: string; truth: string; explanation?: string }[] = [];
    for (const cc of CHAPTER_CANVAS) {
      const range = chZ.get(cc.chapter);
      const all = CANVAS_MYTHS.filter((m) => m.chapter === cc.chapter);
      if (!range || !all.length) continue;
      const step = Math.max(1, Math.round(all.length / 6)); // ~6 myths per chapter (sparse)
      const ms = all.filter((_, i) => i % step === 0);
      const zBot = range.lo - NODE_DZ * 1.4; // margins keep notes clear of the chapter sign + boundary
      const zTop = range.hi + NODE_DZ * 1.4;
      ms.forEach((m, j) => {
        const f = ms.length > 1 ? j / (ms.length - 1) : 0.5;
        const h = _hashStr(m.id);
        out.push({
          id: m.id,
          x: (j % 2 === 0 ? 1 : -1) * (8 + (h % 5)), // 8-12 to the side, clear of the ±3 path swing
          z: zBot + (zTop - zBot) * f,
          rot: (h % 9) - 4,
          tone: tones[h % tones.length],
          myth: m.myth,
          truth: m.truth,
          explanation: m.explanation,
        });
      });
    }
    return out;
  }, [nodes]);

  // persistent phase per myth id (survives the scroll-window unmount); reset by the toolbar. The ink layer
  // (MythInk) owns the partial erase/draw progress and calls advance() when a stage (myth→erased→truth) completes.
  const [phases, setPhases] = useState<Record<string, MythPhase>>({});
  const [seenReset, setSeenReset] = useState(resetSeq);
  if (seenReset !== resetSeq) {
    setSeenReset(resetSeq);
    setPhases({});
  }
  const advance = useCallback((id: string) => {
    setPhases((p) => {
      const cur = p[id] ?? "myth";
      if (cur === "truth") return p; // UN rubs the myth out AND reveals the truth (RE is the free pen now)
      return { ...p, [id]: "truth" as MythPhase };
    });
  }, []);

  // re-render as the camera scrolls so the visible window slides
  const [cz, setCz] = useState(() => CURVE.getPointAt(clamp01(progress.current)).z); // seed the window at the start
  const czRef = useRef(cz);
  useFrame(() => {
    const z = CURVE.getPointAt(clamp01(progress.current)).z;
    if (Math.abs(z - czRef.current) > 3) {
      czRef.current = z;
      setCz(z);
    }
  });
  if (hide) return null;
  const vis = placed.filter((m) => m.z <= cz + 12 && m.z >= cz - 12);
  return (
    <>
      {vis.map((m) => {
        const ph: MythPhase = phases[m.id] ?? "myth";
        // the note only takes ink for the matching tool+phase: UN erases the myth, RE draws over the erased space
        const inkMode: "erase" | null = ph === "myth" && tool === "eraser" ? "erase" : null;
        return (
          <group key={m.id} position={[m.x, 0.14, m.z]}>
            {/* capture only when this note can be erased (UN + myth phase); otherwise let RE ground-ink pass through */}
            <Html center distanceFactor={21.6} zIndexRange={[18, 6]} style={{ pointerEvents: inkMode ? "auto" : "none" }}>
              <div
                className={`note ${m.tone} myth-card select-none`}
                style={{ transform: `rotate(${m.rot}deg)`, cursor: inkMode ? "crosshair" : "default", touchAction: "none" }}
              >
                <MythNoteBody phase={ph} m={m} tool={tool} />
                {inkMode && <MythInk key={`${m.id}-${inkMode}`} mode={inkMode} pointers={pointers} onComplete={() => advance(m.id)} />}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

type MythPhase = "myth" | "erased" | "truth";

// The UN/RE ink layer over a myth note: REAL drawing on the path canvas. UN (erase): rub the eraser across
// the myth and it wipes away under your finger (the note's own paper paints over the words). RE (draw):
// scribble the truth in coral "Grow" ink in the cleared space. No-fail: a tap counts, and ~half the note
// erased (or a few strokes drawn) completes the stage. Two fingers never draw; they scroll the path (the
// shared pointers map). The note's DOM text stays under the canvas for screen readers (canvas is aria-hidden).
function MythInk({ mode, pointers, onComplete }: { mode: "erase" | "draw"; pointers: React.MutableRefObject<Map<number, number>>; onComplete: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cells = useRef<Set<number>>(new Set()); // coarse coverage grid (which COLS×ROWS cells were touched)
  const last = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const done = useRef(false);
  const COLS = 6;
  const ROWS = 4;
  const need = mode === "erase" ? 12 : 5; // erase ~half the 24 cells; draw a few strokes

  // size the backing store to the note's on-screen box (it lives inside a scaled R3F <Html>); the size
  // guard means we only clear when the box actually changes, so accumulated ink survives between strokes.
  const fit = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const w = c.clientWidth || r.width || 1;
    const h = c.clientHeight || r.height || 1;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (c.width !== bw || c.height !== bh) {
      c.width = bw;
      c.height = bh;
    }
    const ctx = c.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);
  useEffect(() => {
    fit();
  }, [fit]);

  const stamp = (clientX: number, clientY: number) => {
    const c = ref.current;
    if (!c || done.current) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const r = c.getBoundingClientRect();
    const w = c.clientWidth || r.width;
    const h = c.clientHeight || r.height;
    const x = ((clientX - r.left) / r.width) * w;
    const y = ((clientY - r.top) / r.height) * h;
    const gx = Math.max(0, Math.min(COLS - 1, Math.floor((x / w) * COLS)));
    const gy = Math.max(0, Math.min(ROWS - 1, Math.floor((y / h) * ROWS)));
    cells.current.add(gy * COLS + gx);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (mode === "erase") {
      // paint the surface behind the words to "rub them out": a sticky-note's own paper (its bg colour),
      // or (for a loose myth scribbled straight on the canvas) the page's paper token.
      const bg = getComputedStyle(c.parentElement as HTMLElement).backgroundColor;
      const paper = getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim() || "#fbf7ef";
      const col = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : paper;
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 24;
    } else {
      const grow = getComputedStyle(document.documentElement).getPropertyValue("--color-grow").trim() || "#ff6b4a";
      ctx.strokeStyle = grow;
      ctx.fillStyle = grow;
      ctx.lineWidth = 4.5;
    }
    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, mode === "erase" ? 13 : 3.2, 0, Math.PI * 2);
    ctx.fill();
    last.current = { x, y };
    if (cells.current.size >= need && !done.current) {
      done.current = true;
      onComplete();
    }
  };

  const onDown = (e: React.PointerEvent) => {
    if (pointers.current.size >= 2) return; // two fingers down → leave it for the path scroll
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    drawing.current = true;
    last.current = null;
    fit();
    stamp(e.clientX, e.clientY);
  };
  const onMove = (e: React.PointerEvent) => {
    if (pointers.current.size >= 2) {
      // a second finger arrived mid-stroke → stop drawing and release, so the gesture scrolls the path
      if (drawing.current) {
        drawing.current = false;
        last.current = null;
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
      }
      return;
    }
    if (!drawing.current) return;
    e.stopPropagation();
    stamp(e.clientX, e.clientY);
  };
  const onUp = (e: React.PointerEvent) => {
    drawing.current = false;
    last.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return <canvas ref={ref} className="myth-ink" aria-hidden onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />;
}

function MythNoteBody({
  phase,
  m,
  tool,
}: {
  phase: MythPhase;
  m: { myth: string; truth: string; explanation?: string };
  tool: UnlearnToolName;
}) {
  if (phase === "myth") {
    return (
      <>
        <span className="note__chip">myth</span>
        {/* the words stay in the DOM (for screen readers); the UN ink canvas paints over them as you rub */}
        <p className="myth-text">{m.myth}</p>
        <span className="myth-hint">{tool === "eraser" ? "rub me out →" : "pick UN to rub me out →"}</span>
      </>
    );
  }
  if (phase === "erased") {
    return (
      <>
        <span className="note__chip note__chip--truth">now relearn</span>
        <span className="myth-hint">{tool === "pen" ? "draw the truth →" : "pick RE to draw the truth →"}</span>
      </>
    );
  }
  return (
    <>
      <span className="note__chip note__chip--truth">truth ✓</span>
      <p className="myth-text myth-truth">{m.truth}</p>
      {m.explanation && <p className="myth-expl">{m.explanation}</p>}
    </>
  );
}

const DOODLE_MARKS = ["sparkle", "star", "heart", "squiggle", "spiral", "swirl", "zigzag", "arrow"];
// Brand accent palette for the marks: coral / sun / teal / violet / sky, so the scatter reads as the
// colourful, delicate hand-drawn texture from the marketing site (not one heavy violet block).
const DOODLE_ACCENTS = ["var(--color-grow)", "var(--color-sun)", "var(--color-insight)", "var(--violet-400)", "var(--color-sky)"];

type Decor =
  | { kind: "mark"; id: string; x: number; z: number; rot: number; mark: string; size: number; accent: string }
  | { kind: "myth"; id: string; x: number; z: number; rot: number; text: string; truth: string; explanation?: string }
  | { kind: "truth"; id: string; x: number; z: number; rot: number; text: string };

// Ambient chapter decor (Chapter Canvas Theming doc): the brand's signature scatter, small, multi-
// colour hand-drawn marks PLUS loose text scribbled straight onto the paper: myths struck-through in
// coral, relearned truths in violet (just like the marketing hero). The struck MYTHS here are interactive
// just like the sticky notes: with a tool selected you rub them out (UN) and draw the truth (RE); marks and
// the standalone truth scribbles stay decorative. Uses myths OFFSET from the sticky-note subset so nothing duplicates.
function ChapterDoodles({ nodes, progress, pointers }: { nodes: SceneNode[]; progress: React.MutableRefObject<number>; pointers: React.MutableRefObject<Map<number, number>> }) {
  // the loose "written on canvas" myths are interactive too (not just the sticky notes): with UN you rub the
  // struck myth out, with RE you draw the truth in the cleared space → the truth scribble reveals. Phase
  // persists across the scroll-window re-renders; the toolbar's reset clears it.
  const { tool, resetSeq } = useUnlearnTool();
  const [phases, setPhases] = useState<Record<string, MythPhase>>({});
  const [seenReset, setSeenReset] = useState(resetSeq);
  if (seenReset !== resetSeq) {
    setSeenReset(resetSeq);
    setPhases({});
  }
  const advance = useCallback((id: string) => {
    setPhases((p) => {
      const cur = p[id] ?? "myth";
      if (cur === "truth") return p; // UN rubs the myth out AND reveals the truth (RE is the free pen now)
      return { ...p, [id]: "truth" as MythPhase };
    });
  }, []);
  const placed = useMemo<Decor[]>(() => {
    const us = chapterSpacedUs(nodes).nodeU;
    const chKeys = CHAPTERS.map((c) => c.key);
    const chZ = new Map<number, { lo: number; hi: number }>();
    nodes.forEach((n, i) => {
      const ci = chKeys.indexOf(n.chapter ?? "");
      if (ci < 0) return;
      const z = CURVE.getPointAt(us[i]).z;
      const e = chZ.get(ci + 1) ?? { lo: z, hi: z };
      e.lo = Math.max(e.lo, z);
      e.hi = Math.min(e.hi, z);
      chZ.set(ci + 1, e);
    });
    // Lanes dodge the path crests (x=±3) and the note band (|x|≥8). Marks are small, so they can sit
    // on/near the path (centre lanes); the wider text stays in the nearer side gaps.
    const MARK_LANES = [0, 2.4, -2.4, 4.8, -4.8];
    const TEXT_LANES = [-6, 6, -4.3, 4.3];
    const MIN_DZ = 2.6; // vertical breathing room between consecutive decor items
    const out: Decor[] = [];
    type Item = { kind: "mark" | "myth" | "truth"; id: string; mark?: string; text?: string; truth?: string; explanation?: string };
    for (const cc of CHAPTER_CANVAS) {
      const range = chZ.get(cc.chapter);
      if (!range) continue;
      const zBot = range.lo;
      const zTop = range.hi;
      const span = Math.abs(zBot - zTop);
      const zAt = (f: number) => zBot + (zTop - zBot) * f;

      // assemble this chapter's decor content (positions assigned by the ladder below)
      const items: Item[] = [];
      const markCount = Math.min(5, Math.max(3, cc.doodles?.length ?? 4));
      for (let j = 0; j < markCount; j++) {
        const h = _hashStr(`${cc.chapter}-mark-${j}`);
        items.push({ kind: "mark", id: `mk-${cc.chapter}-${j}`, mark: DOODLE_MARKS[h % DOODLE_MARKS.length] });
      }
      // sticky notes take i % step === 0, so this pool (i % step !== 0) never duplicates them
      const all = CANVAS_MYTHS.filter((m) => m.chapter === cc.chapter);
      const step = Math.max(2, Math.round(all.length / 6));
      const pool = all.filter((_, i) => i % step !== 0);
      pool.slice(0, 3).forEach((m) => items.push({ kind: "myth", id: `sc-${m.id}`, text: m.myth, truth: m.truth, explanation: m.explanation }));
      pool.slice(Math.max(3, pool.length - 2)).forEach((m) => items.push({ kind: "truth", id: `af-${m.id}`, text: m.truth }));

      // deterministic interleave, then cap the count so the ladder keeps >= MIN_DZ between items
      items.sort((a, b) => (_hashStr(a.id) % 997) - (_hashStr(b.id) % 997));
      const use = items.slice(0, Math.max(2, Math.min(items.length, Math.floor(span / MIN_DZ))));

      // ladder: one unique z-slot per item; lanes cycle per family so neighbours never share x
      let mi = 0;
      let ti = 0;
      use.forEach((it, k) => {
        const h = _hashStr(it.id);
        const z = zAt((k + 0.5) / use.length);
        if (it.kind === "mark") {
          out.push({
            kind: "mark",
            id: it.id,
            x: MARK_LANES[mi++ % MARK_LANES.length] + ((h % 7) - 3) * 0.18,
            z,
            rot: (h % 50) - 25,
            mark: it.mark!,
            size: 24 + (h % 18), // 24-42: small & delicate
            accent: DOODLE_ACCENTS[h % DOODLE_ACCENTS.length],
          });
        } else {
          const x = TEXT_LANES[ti++ % TEXT_LANES.length] + ((h % 5) - 2) * 0.12;
          const rot = (h % 12) - 6;
          if (it.kind === "myth") {
            out.push({ kind: "myth", id: it.id, x, z, rot, text: it.text!, truth: it.truth ?? "", explanation: it.explanation });
          } else {
            out.push({ kind: "truth", id: it.id, x, z, rot, text: it.text! });
          }
        }
      });
    }
    return out;
  }, [nodes]);
  const [cz, setCz] = useState(() => CURVE.getPointAt(clamp01(progress.current)).z);
  const czRef = useRef(cz);
  useFrame(() => {
    const z = CURVE.getPointAt(clamp01(progress.current)).z;
    if (Math.abs(z - czRef.current) > 4) {
      czRef.current = z;
      setCz(z);
    }
  });
  const vis = placed.filter((m) => m.z <= cz + 13 && m.z >= cz - 13);
  return (
    <>
      {vis.map((m) => {
        if (m.kind === "mark") {
          return (
            <group key={m.id} position={[m.x, 0.12, m.z]}>
              <Html center distanceFactor={22} zIndexRange={[8, 2]} style={{ pointerEvents: "none" }}>
                <div
                  className="doodle-mark"
                  style={{
                    width: m.size,
                    height: m.size,
                    backgroundColor: m.accent,
                    WebkitMaskImage: `url(/brand/doodles/${m.mark}.svg)`,
                    maskImage: `url(/brand/doodles/${m.mark}.svg)`,
                    transform: `rotate(${m.rot}deg)`,
                  }}
                />
              </Html>
            </group>
          );
        }
        if (m.kind === "truth") {
          return (
            <group key={m.id} position={[m.x, 0.12, m.z]}>
              <Html center distanceFactor={22} zIndexRange={[8, 2]} style={{ pointerEvents: "none" }}>
                <span className="canvas-scribble is-truth" style={{ transform: `rotate(${m.rot}deg)` }}>{m.text}</span>
              </Html>
            </group>
          );
        }
        // myth: interactive: erase the struck myth (UN), draw the truth (RE), then it reveals
        const ph: MythPhase = phases[m.id] ?? "myth";
        const inkMode: "erase" | null = ph === "myth" && tool === "eraser" ? "erase" : null;
        return (
          <group key={m.id} position={[m.x, 0.12, m.z]}>
            {/* raise the interactive myths above the decorative scatter so they're tappable while a tool is active */}
            <Html center distanceFactor={22} zIndexRange={inkMode ? [17, 5] : [8, 2]} style={{ pointerEvents: inkMode ? "auto" : "none" }}>
              <div className="canvas-myth" style={{ transform: `rotate(${m.rot}deg)`, cursor: inkMode ? "crosshair" : "default", touchAction: "none" }}>
                {ph === "truth" ? (
                  <span className="canvas-scribble is-truth">{m.truth}</span>
                ) : (
                  // keep the words in the DOM (visibility:hidden in the erased phase preserves the draw box)
                  <span className="canvas-scribble is-myth" style={{ visibility: ph === "erased" ? "hidden" : "visible" }}>{m.text}</span>
                )}
                {inkMode && <MythInk key={`${m.id}-${inkMode}`} mode={inkMode} pointers={pointers} onComplete={() => advance(m.id)} />}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

// Free scribble that lives IN THE WORLD (so it sticks to the dotted paper and scrolls with it, instead of
// being glued to the camera like a screen overlay). RE draws coral ink onto the ground plane; UN rubs whole
// strokes out. We draw via an invisible ground-level plane whose R3F pointer events hand us the world-space
// hit point (e.point), and render each stroke as a drei <Line> just above the paper. Myth notes (DOM, on top)
// keep handling their own area, so there's no overlap to forward. Two fingers / wheel still scroll the path.
function FreeInk({ pointers }: { pointers: React.MutableRefObject<Map<number, number>> }) {
  const { tool, resetSeq } = useUnlearnTool();
  const active = tool === "pen" || tool === "eraser";
  const erasing = tool === "eraser";
  const [strokes, setStrokes] = useState<[number, number, number][][]>([]);
  const [current, setCurrent] = useState<[number, number, number][]>([]);
  const drawing = useRef(false);
  const [seenReset, setSeenReset] = useState(resetSeq);
  if (seenReset !== resetSeq) {
    setSeenReset(resetSeq);
    setStrokes([]);
    setCurrent([]);
  }
  useEffect(() => {
    if (resetSeq > 0) {
      drawing.current = false;
    }
  }, [resetSeq]);
  const grow = useMemo(() => getComputedStyle(document.documentElement).getPropertyValue("--color-grow").trim() || "#ff6b4a", []);
  const Y = 0.08; // ink floats just above the paper, below the nodes/notes
  const ERASE_R2 = 1.4 * 1.4; // world-space erase radius²

  const erodeAt = useCallback((x: number, z: number) => {
    setStrokes((prev) => prev.filter((s) => !s.some((p) => (p[0] - x) ** 2 + (p[2] - z) ** 2 < ERASE_R2)));
  }, [ERASE_R2]);

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (!active || pointers.current.size >= 2) return; // two fingers → leave it for the path scroll
    e.stopPropagation();
    drawing.current = true;
    if (erasing) erodeAt(e.point.x, e.point.z);
    else setCurrent([[e.point.x, Y, e.point.z]]);
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drawing.current) return;
    if (pointers.current.size >= 2) {
      drawing.current = false;
      setCurrent((c) => {
        if (c.length > 1) setStrokes((s) => [...s, c]);
        return [];
      });
      return;
    }
    if (erasing) erodeAt(e.point.x, e.point.z);
    else setCurrent((c) => [...c, [e.point.x, Y, e.point.z]]);
  };
  const finish = () => {
    drawing.current = false;
    setCurrent((c) => {
      if (c.length > 1) setStrokes((s) => [...s, c]);
      return [];
    });
  };

  if (!active && strokes.length === 0) return null;
  return (
    <>
      {active && (
        // invisible, raycastable ground plane; R3F gives us e.point (world hit) directly: no manual raycast
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, Y - 0.02, PATH_MID_Z]} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={finish} onPointerLeave={finish}>
          <planeGeometry args={[1600, PATH_SPAN_Z + 900]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {strokes.map((pts, i) => (pts.length > 1 ? <Line key={i} points={pts} color={grow} lineWidth={3} /> : null))}
      {current.length > 1 && <Line points={current} color={grow} lineWidth={3} />}
    </>
  );
}

const NODE_WINDOW = 5; // only ~5 levels rendered at a time; the window slides as you scroll
function Nodes({
  nodes,
  progress,
  onSelect,
  reduced,
  canvas,
  focusIndex,
  playerName,
}: {
  nodes: SceneNode[];
  progress: React.MutableRefObject<number>;
  onSelect?: (n: SceneNode) => void;
  reduced: boolean;
  canvas: boolean;
  focusIndex?: number;
  playerName?: string;
}) {
  const total = nodes.length;
  const us = useMemo(() => chapterSpacedUs(nodes).nodeU, [nodes]);
  // exactly one Active node = the next in the chain: the first still-playable lesson AT OR AFTER the
  // chosen-age entry point (so the glow sits on the user's band, not a revision node), else the first playable
  const activeIndex = useMemo(() => {
    const f = focusIndex ?? 0;
    const fwd = nodes.findIndex((n, i) => i >= f && n.state === "playable");
    return fwd >= 0 ? fwd : nodes.findIndex((n) => n.state === "playable");
  }, [nodes, focusIndex]);
  const [start, setStart] = useState(0);
  const startRef = useRef(0);
  useFrame(() => {
    if (total <= NODE_WINDOW) return;
    // focus = the node nearest the camera's position along the curve (node spacing is non-uniform)
    let focus = 0;
    let best = Infinity;
    for (let i = 0; i < total; i++) {
      const dd = Math.abs(us[i] - progress.current);
      if (dd < best) {
        best = dd;
        focus = i;
      }
    }
    const s = Math.max(0, Math.min(focus - 2, total - NODE_WINDOW));
    if (s !== startRef.current) {
      startRef.current = s;
      setStart(s);
    }
  });
  const from = total <= NODE_WINDOW ? 0 : start;
  const items = nodes.slice(from, from + NODE_WINDOW);
  return (
    <>
      {items.map((node, k) => {
        const i = from + k;
        return <Node key={node.id} node={node} u={us[i]} progress={progress} onSelect={onSelect} reduced={reduced} canvas={canvas} active={canvas && i === activeIndex} playerName={playerName} />;
      })}
    </>
  );
}

// The companion: a brand flying ship with a flickering rocket flame, riding the path at the
// player's position (DOM overlay, drei <Html>). Banks into the curve as the sine weaves.
function Companion({ progress }: { progress: React.MutableRefObject<number> }) {
  const grp = useRef<THREE.Group>(null);
  const ship = useRef<HTMLDivElement>(null);
  useFrame(() => {
    const u = clamp01(progress.current);
    const p = CURVE.getPointAt(u);
    if (grp.current) grp.current.position.set(p.x, 0.15, p.z);
    if (ship.current) {
      const tan = CURVE.getTangentAt(u);
      const ang = Math.atan2(tan.x, -tan.z) * (180 / Math.PI); // 0 = up the screen, + leans right
      ship.current.style.transform = `rotate(${ang.toFixed(1)}deg)`;
    }
  });
  return (
    <group ref={grp}>
      <Html center distanceFactor={16} zIndexRange={[44, 24]} style={{ pointerEvents: "none" }}>
        <div ref={ship} className="pointer-events-none relative select-none" style={{ width: 82, transformOrigin: "50% 55%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ship/ship-flying.svg" alt="" draggable={false} style={{ width: 82, display: "block" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/ship/ship-flame.svg"
            alt=""
            draggable={false}
            className="flame-flicker"
            style={{ position: "absolute", left: "50%", top: "60%", width: 40, marginLeft: -20, zIndex: -1 }}
          />
        </div>
      </Html>
    </group>
  );
}

// Flat paper background, no fog (the canvas world is season-independent). Uses the shared _themePaper
// instance so the ThemeController's retint also drives the scene clear colour.
function CanvasBackground() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- the scene is a three.js object owned by React Three Fiber
    scene.fog = null;
    scene.background = _themePaper;
  }, [scene]);
  return null;
}

// Theme controller: flips the world to the brand's dark "adult" palette across the Ch.5→Ch.6
// boundary. It lerps the shared dotted-paper colours (3D) and toggles [data-audience="adult"] on
// <html> so the DOM overlays (toolbar, nodes, banners, background) inherit the dark token flip too.
function ThemeController({ progress, adultStartU }: { progress: React.MutableRefObject<number>; adultStartU: number }) {
  const isAdult = useRef(false);
  useFrame(() => {
    // hysteresis so a scroll parked exactly on the boundary doesn't strobe the attribute
    const adult = isAdult.current
      ? progress.current >= adultStartU - 0.012
      : progress.current >= adultStartU + 0.012;
    _themePaper.lerp(adult ? _DARK_PAPER : _LIGHT_PAPER, 0.08);
    _themeDot.lerp(adult ? _DARK_DOT : _LIGHT_DOT, 0.08);
    if (adult !== isAdult.current) {
      isAdult.current = adult;
      applyAudience(adult);
    }
  });
  return null;
}

function FollowCam({ progress }: { progress: React.MutableRefObject<number> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useRef(new THREE.Vector3(0, 0, 0));
  // eslint-disable-next-line react-hooks/immutability -- three.js objects are mutated per frame inside useFrame, the React Three Fiber pattern
  useFrame(() => {
    const portrait = size.width / size.height < 1;
    const u = clamp01(progress.current);
    const p = CURVE.getPointAt(u);
    // Duolingo-style scroll: the camera tracks straight UP the centre line (x = 0, no yaw) so the
    // sine weaves left/right in frame. Near-top-down (~7° tilt) keeps the dotted paper flat + circular.
    const back = portrait ? 2 : 1.5;
    const height = portrait ? 24 : 18;
    camera.position.lerp(new THREE.Vector3(0, height, p.z + back), 0.12);
    look.current.lerp(new THREE.Vector3(0, 0, p.z + back - 3), 0.12);
    camera.lookAt(look.current);
    const fov = portrait ? 52 : 46;
    if (Math.abs(camera.fov - fov) > 0.01) {
      // eslint-disable-next-line react-hooks/immutability -- three.js objects are mutated per frame inside useFrame, the React Three Fiber pattern
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

// ---- in-place card game: a liquid-glass card floating in front of the camera ----------
export type GameLabels = { left: string; right: string };
export type GameView = { card: GameCardT; phase: "play" | "reveal"; correct: boolean; points: number; exiting: FlagT | null; labels: GameLabels };

export function PathScene({
  nodes = DEFAULT_NODES,
  chapters = [],
  onSelectNode,
  playing = false,
  focusIndex,
  playerName,
}: {
  nodes?: SceneNode[];
  chapters?: Chapter[];
  onSelectNode?: (n: SceneNode) => void;
  /** true while ANY game (swipe or engine) is being played in place: freezes the camera & hides nodes */
  playing?: boolean;
  /** node index to focus on load (the chosen age band's entry node); falls back to first playable */
  focusIndex?: number;
  /** the learner's name, for the "Play, <name>?" cue on the active node */
  playerName?: string;
}) {
  // focus on load: the chosen age-band node when given, else the first playable lesson, else first completed
  const startU = useMemo(() => {
    const us = chapterSpacedUs(nodes).nodeU;
    if (focusIndex != null && focusIndex >= 0 && focusIndex < nodes.length) return us[focusIndex];
    let i = nodes.findIndex((n) => n.state === "playable");
    if (i < 0) i = nodes.findIndex((n) => n.state === "completed");
    return i >= 0 ? us[i] : 0;
  }, [nodes, focusIndex]);
  const progress = useRef(startU);
  // live map of every pointer currently on the screen (pointerId -> clientY). Shared with the interactive
  // myth notes so the canvas can offer "one finger draws, two fingers scroll": drawing never locks travel.
  const pointersRef = useRef<Map<number, number>>(new Map());
  // u where the world flips to the adult (dark) theme: midway between the last kids node and the
  // first adult one (Ch.6+). >1 (never) when there are no adult chapters.
  const adultStartU = useMemo(() => {
    const i = nodes.findIndex((n) => /Ch\.[678]/.test(n.chapter ?? ""));
    if (i <= 0) return 2;
    const us = chapterSpacedUs(nodes).nodeU;
    return (us[i] + us[i - 1]) / 2;
  }, [nodes]);
  // set the initial theme instantly (no lerp) for a deep-link/return into the adult stretch; always
  // clear the flag when leaving the path so other pages stay in the kids theme.
  useEffect(() => {
    const adult = progress.current >= adultStartU;
    _themePaper.copy(adult ? _DARK_PAPER : _LIGHT_PAPER);
    _themeDot.copy(adult ? _DARK_DOT : _LIGHT_DOT);
    applyAudience(adult);
    return () => applyAudience(false);
  }, [adultStartU]);
  const reduced = useReducedMotion();
  // staged load (keeps mobile from uploading everything in one frame):
  // 0 = sky + land + mountains, 1 = + the path & nodes, 2 = + streamed foliage.
  const [phase, setPhase] = useState(0);
  // freeze the on-rails camera while a card game is being played
  const playingRef = useRef(false);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const p1 = setTimeout(() => setPhase((p) => Math.max(p, 1)), 220);
    const p2 = setTimeout(() => setPhase((p) => Math.max(p, 2)), 750);
    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
    };
  }, []);

  useEffect(() => {
    const pts = pointersRef.current; // pointerId -> clientY for every finger down right now
    let lastSingleY: number | null = null; // single-finger Browse-drag anchor
    let lastAvgY: number | null = null; // two-finger scroll anchor
    const avgY = () => {
      if (!pts.size) return null;
      let s = 0;
      pts.forEach((y) => (s += y));
      return s / pts.size;
    };
    // freeze path travel while a full-screen overlay (the Toolkit / a tool / breathing) is open
    const overlayOpen = () => document.documentElement.dataset.overlay === "1";
    const onWheel = (e: WheelEvent) => {
      if (playingRef.current || overlayOpen()) return; // a wheel (incl. a trackpad two-finger swipe) travels
      progress.current = clamp01(progress.current - e.deltaY * 0.0008); // even while a draw tool is active
    };
    const onDown = (e: PointerEvent) => {
      if (overlayOpen()) return;
      pts.set(e.pointerId, e.clientY);
      if (pts.size >= 2) {
        lastAvgY = avgY(); // entering two-finger: re-anchor scroll, abandon any single-finger drag
        lastSingleY = null;
        return;
      }
      // single finger drives the path only in Browse mode, so a draw tool can paint on a note instead
      lastSingleY = playingRef.current || unlearnTool.get().tool !== "none" ? null : e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (overlayOpen()) return;
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, e.clientY);
      // TWO-FINGER SCROLL: works in every mode (Browse AND while a draw tool is active): drawing never
      // locks travel. One finger draws/erases a myth; two fingers scroll the path.
      if (pts.size >= 2) {
        const a = avgY();
        if (a != null && lastAvgY != null && !playingRef.current) {
          progress.current = clamp01(progress.current + (a - lastAvgY) * 0.0014);
        }
        lastAvgY = a;
        return;
      }
      if (lastSingleY == null) return; // single-finger drag (Browse only)
      progress.current = clamp01(progress.current + (e.clientY - lastSingleY) * 0.0012);
      lastSingleY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      lastAvgY = pts.size >= 2 ? avgY() : null;
      lastSingleY = null;
    };
    // CAPTURE phase so these run BEFORE the myth notes' React handlers: a note reads pointersRef.size to
    // decide draw-vs-scroll, and a note's stopPropagation can never swallow two-finger travel.
    const capOpts = { passive: true, capture: true } as const;
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown, capOpts);
    window.addEventListener("pointermove", onMove, capOpts);
    window.addEventListener("pointerup", onUp, capOpts);
    window.addEventListener("pointercancel", onUp, capOpts);
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const timers = [setTimeout(fire, 80), setTimeout(fire, 300)];
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown, { capture: true });
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onUp, { capture: true });
      window.removeEventListener("pointercancel", onUp, { capture: true });
      pts.clear();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      camera={{ position: [0, 24, 30], fov: 52 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* flat #FBF9FF paper background, no fog */}
      <CanvasBackground />
      {/* the brand world: a WORLD-space dotted-paper plane (scrolls as you travel), the inked
          progress trail, and the capstone sun-clearings */}
      <CanvasGround />
      <ProgressTrail progress={progress} />
      <FollowCam progress={progress} />
      <ThemeController progress={progress} adultStartU={adultStartU} />
      {/* soft, season-free lighting: enough to light Sam (the only lit 3D object) */}
      <hemisphereLight args={["#ffffff", "#e7e0f1", 1.1]} />
      <directionalLight position={[6, 14, 8]} intensity={1.15} />
      {/* phase 1: nodes + chapter signs (hidden while a level is being played).
          Nodes first so the chapter banners (rendered after) stack ABOVE the node labels. */}
      {phase >= 1 && !playing && (
        <>
          <FreeInk pointers={pointersRef} />
          <ChapterDoodles nodes={nodes} progress={progress} pointers={pointersRef} />
          <CanvasContent nodes={nodes} progress={progress} pointers={pointersRef} />
          <Nodes nodes={nodes} progress={progress} onSelect={onSelectNode} reduced={reduced} canvas focusIndex={focusIndex} playerName={playerName} />
          <ChapterBanners chapters={chapters} nodes={nodes} progress={progress} />
          <Suspense fallback={null}>
            <Companion progress={progress} />
          </Suspense>
        </>
      )}
    </Canvas>
  );
}
