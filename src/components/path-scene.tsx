"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Check, Lock, Play, Trophy } from "lucide-react";
import { tokens } from "@equal-lens/brand"; // canvas-world brand colours — single source (retheme via the library)
import { NODES, CHAPTERS, type Chapter } from "@/content/path";
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

// Path: a smooth vertical sine (Duolingo-style winding trail). Travel runs bottom → top (z
// decreases); every node rests on a left/right turn (a sine crest/trough at x = ±NODE_AMP). The
// curve is sampled densely along a real cosine so the peaks are ROUNDED (not a pointy zigzag), and
// a node lands exactly on each extremum. The canvas camera scrolls straight up the centre line (see
// FollowCam), so the wave weaves L/R in frame. Tune: NODE_AMP = swing, NODE_DZ = vertical gap.
const PATH_SCALE = 3; // scenery density only (tree/prop counts); the curve below is in world units
const NODE_AMP = 3; // horizontal swing — nodes rest at x = ±NODE_AMP (closer to centre)
const NODE_DZ = 3.5; // vertical distance between consecutive nodes (half a sine period)
const SINE_START_Z = 18; // z of the first (bottom) node
const SINE_NODE_COUNT = NODES.length; // one node per sine extremum
const SINE_SAMPLES_PER_NODE = 12; // control points between nodes → smooth (not zigzag) sine
const CURVE = new THREE.CatmullRomCurve3(
  Array.from({ length: (SINE_NODE_COUNT - 1) * SINE_SAMPLES_PER_NODE + 1 }, (_, k) => {
    const t = k / SINE_SAMPLES_PER_NODE; // node-index space (integer t = a node, on an extremum)
    return new THREE.Vector3(NODE_AMP * Math.cos(Math.PI * t), 0, SINE_START_Z - t * NODE_DZ);
  }),
  false,
  "catmullrom",
  0.5
);
// World extent derived from the (scaled) path, so scenery stretches to cover its full length.
const PATH_START_Z = SINE_START_Z;
const PATH_END_Z = SINE_START_Z - (SINE_NODE_COUNT - 1) * NODE_DZ;
const PATH_MID_Z = (PATH_START_Z + PATH_END_Z) / 2;
const PATH_SPAN_Z = PATH_START_Z - PATH_END_Z;

// Chapter-4 (winter) path segment: Holiday-Kit props are scattered only here, and the
// Platformer trees/flowers are excluded here (so winter reads festive, not white blobs).
const _WINTER_CH = CHAPTERS.find((c) => /Ages 12/.test(c.title)) ?? CHAPTERS[3];
const _wTotal = NODES.length || 1;
const _clampU = (u: number) => Math.max(0, Math.min(1, u));
const _wzA = CURVE.getPointAt(_clampU((_WINTER_CH.startOrder - 0.7) / _wTotal)).z;
const _wzB = CURVE.getPointAt(_clampU((_WINTER_CH.endOrder - 0.3) / _wTotal)).z;
const WINTER_Z_MAX = Math.max(_wzA, _wzB) + 26;
const WINTER_Z_MIN = Math.min(_wzA, _wzB) - 26;
const inWinter = (z: number) => z <= WINTER_Z_MAX && z >= WINTER_Z_MIN;

export type NodeState = "completed" | "playable" | "soon";
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
const PATH_PTS = Array.from({ length: 90 * PATH_SCALE }, (_, i) => CURVE.getPointAt(i / (90 * PATH_SCALE - 1)));

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distToPathSq(x: number, z: number) {
  let m = Infinity;
  for (const p of PATH_PTS) {
    const dx = p.x - x;
    const dz = p.z - z;
    const d = dx * dx + dz * dz;
    if (d < m) m = d;
  }
  return m;
}

type Placement = { x: number; z: number; s: number; r: number; tx: number; tz: number };

// Smooth value noise -> organic density field (clumps + clearings).
function hash2(x: number, z: number) {
  const h = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return h - Math.floor(h);
}
function valueNoise(x: number, z: number) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  const n00 = hash2(xi, zi);
  const n10 = hash2(xi + 1, zi);
  const n01 = hash2(xi, zi + 1);
  const n11 = hash2(xi + 1, zi + 1);
  return n00 * (1 - u) * (1 - v) + n10 * u * (1 - v) + n01 * (1 - u) * v + n11 * u * v;
}
function densityNoise(x: number, z: number) {
  return 0.6 * valueNoise(x, z) + 0.3 * valueNoise(x * 2.1 + 5.2, z * 2.1 + 1.3) + 0.15 * valueNoise(x * 4.3 - 2.1, z * 4.3 + 7.7);
}

// Organic scatter: denser where the noise field is high, with bare patches where it's
// low; random rotation + lean (tx/tz) per instance so nothing lines up in rows.
function organicScatter(count: number, seed: number, clearance: number, freq: number, zRange?: [number, number]): Placement[] {
  const rng = mulberry32(seed);
  const out: Placement[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 80) {
    tries++;
    const x = (rng() * 2 - 1) * 52;
    const z = zRange ? zRange[0] + rng() * (zRange[1] - zRange[0]) : PATH_START_Z + 18 - rng() * (PATH_SPAN_Z + 44);
    if (distToPathSq(x, z) < clearance * clearance) continue;
    const dens = densityNoise(x * freq, z * freq);
    if (rng() > dens * dens * 1.8) continue; // accept ∝ density² -> clumps + clearings
    out.push({ x, z, s: rng(), r: rng() * Math.PI * 2, tx: rng() - 0.5, tz: rng() - 0.5 });
  }
  return out;
}

// --- GLB helpers -----------------------------------------------------------------------
function bakedMesh(scene: THREE.Object3D) {
  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.Material | null = null;
  scene.updateMatrixWorld(true);
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && !geometry) {
      geometry = mesh.geometry.clone();
      geometry.applyMatrix4(mesh.matrixWorld); // bake local transform -> base at origin
      material = mesh.material as THREE.Material;
    }
  });
  return { geometry: geometry!, material: material! };
}


// --- sky / clouds ----------------------------------------------------------------------
// ============================================================================================
// Canvas / doodle skin
// The world re-drawn on paper: a canvas ground with tree doodles, a canvas sky with cloud
// doodles, and the path inked onto the ground. Every surface is a runtime <canvas> texture
// (CanvasTexture) so the world literally *is* a canvas. Mounted when PathScene's `skin ===
// "canvas"`; the realistic R3F world stays the default. Brand: Ink #221436 outlines, flat fills,
// dotted paper. v1 = stub doodles drawn in code; richer themed packs can swap in later.
// ============================================================================================
const DOODLE_INK = "#221436";
const DOODLE_GREEN = "#54bd77";
const DOODLE_GREEN_DK = "#2f8f57";

function roundRectPath(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// The brand canvas: dotted paper. Matches The Equal Lens site exactly — paper #FBF9FF with a 28px
// grid of soft violet dots (--dot #ECE6F6), no grain. This is the surface for both the land and the
// sky, so the whole world reads as one sheet of the site's dotted paper.
const PAPER = "#FBF9FF";
const PAPER_DOT = "#ECE6F6";
const PAPER_TILE_DOTS = 8; // dots per tile edge — used to convert a world dot-spacing into texture repeat
// One seamless tile of the brand dotted paper: pure paper, no grain, no tint. Small dot radius +
// supersampling keep the dots crisp and fine (not blobs) once tiled across the big ground/sky.
function makePaperTex(dotR = 0.7, paper = PAPER, dot = PAPER_DOT) {
  const grid = 24; // logical px between dots
  const size = grid * PAPER_TILE_DOTS;
  const ss = 3; // supersample so small dots stay sharp
  const c = document.createElement("canvas");
  c.width = c.height = size * ss;
  const g = c.getContext("2d")!;
  g.scale(ss, ss);
  g.fillStyle = paper;
  g.fillRect(0, 0, size, size);
  g.fillStyle = dot;
  for (let y = grid / 2; y < size; y += grid)
    for (let x = grid / 2; x < size; x += grid) {
      g.beginPath();
      g.arc(x, y, dotR, 0, 6.2832);
      g.fill();
    }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
// Texture repeat for a surface `worldSpan` units long with dots ~`dotWorld` units apart.
// Fine like the site: small, tightly-spaced dots. (Tune this one number if dots want bigger/smaller.)
const paperRepeatFor = (worldSpan: number, dotWorld = 0.16) => worldSpan / (PAPER_TILE_DOTS * dotWorld);

// The 8 hand-drawn doodle marks from the site (Doodles.tsx), drawn to textures — the brand's
// easter-egg "the whole site is a canvas" confetti, scattered across the sky in the 4 accents.
type DoodleMark = "squiggle" | "sparkle" | "spiral" | "arrow" | "heart" | "star" | "zigzag" | "swirl";
const DOODLE_DEFS: Record<DoodleMark, { w: number; h: number; fills?: string[]; strokes?: [string, number][] }> = {
  squiggle: { w: 60, h: 24, strokes: [["M3 14 Q12 2 21 14 T39 14 T57 14", 4]] },
  sparkle: { w: 40, h: 40, fills: ["M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z"] },
  spiral: { w: 40, h: 40, strokes: [["M20 20 m0 0 a4 4 0 1 1 -6 2 a9 9 0 1 1 14 3 a14 14 0 1 1 -22 -5", 3.5]] },
  arrow: { w: 54, h: 40, strokes: [["M4 22 C18 2 32 2 44 16", 3.5], ["M36 9 L46 15 L39 25", 3.5]] },
  heart: { w: 30, h: 28, fills: ["M15 26 C2 17 4 5 15 11 C26 5 28 17 15 26 Z"] },
  star: { w: 34, h: 34, fills: ["M17 2 L21 13 L33 13 L23 20 L27 32 L17 24 L7 32 L11 20 L1 13 L13 13 Z"] },
  zigzag: { w: 56, h: 20, strokes: [["M3 10 L13 3 L23 17 L33 3 L43 17 L53 10", 4]] },
  swirl: { w: 50, h: 40, strokes: [["M4 20 C4 8 22 8 22 20 C22 30 10 30 12 20 C14 12 26 12 30 22 C33 30 44 28 46 18", 3.5]] },
};
function makeDoodleMarkTex(name: DoodleMark, color: string) {
  const def = DOODLE_DEFS[name];
  const S = 128;
  const pad = 16;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const sc = Math.min((S - 2 * pad) / def.w, (S - 2 * pad) / def.h);
  g.translate((S - def.w * sc) / 2, (S - def.h * sc) / 2);
  g.scale(sc, sc);
  g.lineCap = "round";
  g.lineJoin = "round";
  g.fillStyle = color;
  g.strokeStyle = color;
  for (const d of def.fills ?? []) g.fill(new Path2D(d));
  for (const [d, wd] of def.strokes ?? []) {
    g.lineWidth = wd;
    g.stroke(new Path2D(d));
  }
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

// a hand-drawn tree (flat fill + chunky Ink outline): a lumpy round canopy or a stacked pine.
function makeTreeDoodleTex(kind: "round" | "pine") {
  const W = 256, H = 320;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.fillStyle = "#a9743f";
  roundRectPath(g, W / 2 - 15, H - 96, 30, 86, 9);
  g.fill();
  g.lineWidth = 9;
  g.strokeStyle = DOODLE_INK;
  g.stroke();
  if (kind === "pine") {
    const tri = (cy: number, half: number, h: number) => {
      g.beginPath();
      g.moveTo(W / 2, cy - h);
      g.lineTo(W / 2 + half, cy);
      g.lineTo(W / 2 - half, cy);
      g.closePath();
      g.fillStyle = DOODLE_GREEN;
      g.fill();
      g.lineWidth = 11;
      g.strokeStyle = DOODLE_INK;
      g.stroke();
    };
    tri(H - 78, 96, 116);
    tri(H - 140, 80, 104);
    tri(H - 196, 62, 92);
  } else {
    const cx = W / 2, cy = H - 150, R = 96, bumps = 9;
    g.beginPath();
    const segs = bumps * 10;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const rr = R * (0.9 + 0.1 * Math.sin(a * bumps));
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr * 0.92;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
    g.fillStyle = DOODLE_GREEN;
    g.fill();
    g.lineWidth = 11;
    g.strokeStyle = DOODLE_INK;
    g.stroke();
    g.save();
    g.clip();
    g.globalAlpha = 0.45;
    g.fillStyle = DOODLE_GREEN_DK;
    g.beginPath();
    g.arc(cx + 34, cy + 40, R, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

function makeCloudDoodleTex() {
  const W = 256, H = 150;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(34, 116);
  g.bezierCurveTo(6, 116, 8, 74, 46, 70);
  g.bezierCurveTo(48, 38, 100, 36, 110, 62);
  g.bezierCurveTo(126, 28, 188, 34, 188, 68);
  g.bezierCurveTo(228, 60, 240, 104, 210, 116);
  g.closePath();
  g.fillStyle = "#ffffff";
  g.fill();
  g.lineWidth = 9;
  g.strokeStyle = DOODLE_INK;
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

// the trail, inked: a sandy band with Ink edges + a dashed centre line (tiles along its length).
function makePathStrokeTex() {
  const W = 128, H = 64;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#efe6d2";
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 220; i++) {
    g.fillStyle = `rgba(120,90,40,${Math.random() * 0.06})`;
    g.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4);
  }
  g.lineCap = "round";
  g.strokeStyle = DOODLE_INK;
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, 5);
  g.lineTo(W, 5);
  g.moveTo(0, H - 5);
  g.lineTo(W, H - 5);
  g.stroke();
  g.strokeStyle = "rgba(34,20,54,0.4)";
  g.lineWidth = 4;
  g.setLineDash([14, 16]);
  g.beginPath();
  g.moveTo(0, H / 2);
  g.lineTo(W, H / 2);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

const CANVAS_PAPER = tokens.light.paper; // #FBF9FF — from @equal-lens/brand
const CANVAS_DOT = tokens.light.mist; // #E7E0F1 — from @equal-lens/brand
const CANVAS_INK = tokens.light.ink; // #221436 — hand-drawn outline / Ink

// Canvas skin — the sky: the brand dotted paper on the distant backdrop, drawn in SCREEN space.
// Knobs: uPx (pixel spacing) + uDotPx (dot radius px).
function CanvasSky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uPaper: { value: new THREE.Color(CANVAS_PAPER) },
          uDot: { value: new THREE.Color(CANVAS_DOT) },
          uPx: { value: 45.0 }, // dot spacing (×1.5 — more space between dots)
          uDotPx: { value: 2.0 }, // dot radius (×2 — bigger dots)
        },
        vertexShader: `
          void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          uniform vec3 uPaper;
          uniform vec3 uDot;
          uniform float uPx;
          uniform float uDotPx;
          void main() {
            vec2 cell = fract(gl_FragCoord.xy / uPx) - 0.5;
            float d = length(cell) * uPx;
            float dot = 1.0 - smoothstep(uDotPx - 0.6, uDotPx + 0.6, d);
            gl_FragColor = vec4(mix(uPaper, uDot, dot), 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    []
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return (
    <mesh material={mat} position={[0, 0, PATH_MID_Z]}>
      <sphereGeometry args={[560, 32, 16]} />
    </mesh>
  );
}

// ============================================================================================
// Dotted-paper ground — FRESH (no makePaperTex / no texture). The brand canvas: paper #FBF9FF with
// #ECE6F6 dots on a WORLD-SPACE grid, drawn procedurally in a shader. Each dot is computed from the
// world XZ position, so it stays a crisp anti-aliased circle at any distance or camera angle — no
// texture tiling, no stretching toward the horizon, no mip blur. Two knobs: GAP (spacing) + DOT (radius).
// ============================================================================================
function CanvasGround() {
  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uPaper: { value: new THREE.Color(CANVAS_PAPER) },
        uDot: { value: new THREE.Color(CANVAS_DOT) },
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

// Progress trail (Nodes & Navigation spec §6): the route you've walked inks over in Grow Coral — a solid
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
    const hw = 0.04; // half-width of the inked line (world units) — very lean trail (1/4)
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
      uniforms: { uProgress: { value: 0 }, uColor: { value: new THREE.Color(tokens.accent.grow) } }, // Grow Coral
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
  useFrame(() => {
    maxRef.current = Math.max(maxRef.current, clamp01(progress.current));
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

// Capstone "clearings" (Nodes & Navigation spec §6): a chapter's capstone isn't a plain node — the path
// opens into a wider sun-tinted glade drawn on the paper (a celebratory landing), with the capstone
// sticker sitting in it. Flat on the page (not a panel) — just a soft sun patch + a thin Equal-Violet ring.
function CapstoneClearings({ nodes }: { nodes: SceneNode[] }) {
  const spots = useMemo(() => {
    const us = chapterSpacedUs(nodes).nodeU;
    return nodes.map((n, i) => (n.capstone ? CURVE.getPointAt(us[i]) : null)).filter((p): p is THREE.Vector3 => !!p);
  }, [nodes]);
  return (
    <>
      {spots.map((p, i) => (
        <group key={i} position={[p.x, 0.07, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <circleGeometry args={[6.5, 48]} />
            <meshBasicMaterial color={tokens.accent.sun} transparent opacity={0.18} toneMapped={false} depthWrite={false} />
          </mesh>
          <mesh>
            <ringGeometry args={[6.2, 6.55, 64]} />
            <meshBasicMaterial color={tokens.violet[600]} transparent opacity={0.55} toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ============================================================================================
// Canvas corridor — a long winding hallway that follows the path: floor + two side walls + ceiling,
// all swept along CURVE so the whole corridor curves with the path. Every surface is the brand dotted
// paper (#FBF9FF + #E7E0F1 dots on a world-unit UV grid). Soft ambient occlusion darkens the four
// corner seams where the surfaces meet — and because those seams are real straight geometry, the room
// edges read clean + straight (a white-room corner, not a vignette).
// Knobs: CORRIDOR_W (half-width) · CORRIDOR_H (height) · uCorner (AO depth) · uFalloff (AO spread).
// ============================================================================================
const CORRIDOR_W = 16; // half-width — the corridor is 2*W wide
const CORRIDOR_H = 15; // ceiling height above the floor
const DOOR_HALF_W = 3.5; // doorway half-width (the opening is 2× this, centred on the path)
const DOOR_H = 9; // doorway height

// Node u-positions along the curve. One node per sine extremum → uniform spacing, so node i sits
// exactly on control point i (a left/right turn of the wave). Each chapter wall/door sits at the
// midpoint between a capstone and the next chapter's first node. Also returns each door wall's u.
function chapterSpacedUs(nodes: SceneNode[]): { nodeU: number[]; wallU: number[]; wallCap: number[] } {
  const total = nodes.length;
  const span = Math.max(1, total - 1);
  const cl = (x: number) => Math.max(0, Math.min(1, x));
  const nodeU = nodes.map((_, i) => cl(i / span));
  const wallU: number[] = [];
  const wallCap: number[] = []; // the capstone node index each wall sits after
  nodes.forEach((n, i) => {
    if (n.capstone && i < total - 1) {
      wallU.push(cl((i + 0.5) / span)); // midway between the capstone and the next chapter's first node
      wallCap.push(i);
    }
  });
  return { nodeU, wallU, wallCap };
}
// the live corridor mesh (canvas skin only) — used to occlude DOM node/banner overlays behind walls.
// A module-level callback ref sidesteps any ref-forwarding-through-props subtlety.
let _corridorMesh: THREE.Mesh | null = null;
const _doorMeshes: THREE.Mesh[] = []; // swinging door panels — they also occlude DOM overlays while shut
const _openDoors = new Set<number>(); // door u's the player has opened (Enter) — releases the travel gate
const _CURVE_LEN = CURVE.getLength();
const _DOOR_GATE_U = 7 / _CURVE_LEN; // clamp travel this far past a shut door's u → camera halts just shy of it
const _COMPANION_DOOR_CLEAR = 1.2 / _CURVE_LEN; // the companion halts this far (world units) before a shut door
let _doorUs: number[] = []; // every door's u (published by CorridorDoors) — drives the camera + companion gates
function _frontShutDoorU(): number {
  // u of the nearest still-shut door, or Infinity if all opened (doors open in order along the path)
  let g = Infinity;
  for (const u of _doorUs) if (!_openDoors.has(u)) g = Math.min(g, u);
  return g;
}
const CORRIDOR_DOOR_TONE = 0.95; // the "door wall" across the corridor after each capstone (doors added later)
function CanvasCorridor({ nodes }: { nodes: SceneNode[] }) {
  const geometry = useMemo(() => {
    // floor hidden — this mesh only builds the chapter door-walls now
    const W = CORRIDOR_W;
    const H = CORRIDOR_H;
    const W2 = 2 * W;
    const pos: number[] = [];
    const uv: number[] = [];
    const ext: number[] = [];
    const tone: number[] = [];
    const wall: number[] = [];
    const idx: number[] = [];
    // a canvas wall across the corridor at each chapter boundary, FRAMED around a central doorway
    // (two jambs + a header); the swinging door panel itself is rendered separately by <CorridorDoors>.
    const cL = W - DOOR_HALF_W; // doorway across-range [cL, cR] (centred on the path), height [0, DOOR_H]
    const cR = W + DOOR_HALF_W;
    chapterSpacedUs(nodes).wallU.forEach((u) => {
      const p = CURVE.getPointAt(u);
      const tan = CURVE.getTangentAt(u);
      const tl = Math.hypot(tan.x, tan.z) || 1;
      const nx = -tan.z / tl;
      const nz = tan.x / tl;
      // across-coord a (0=+nW edge … 2W=-nW edge), height h → a wall vertex
      const vtx = (a: number, h: number) => {
        pos.push(p.x + nx * (W - a), p.y + h, p.z + nz * (W - a));
        uv.push(a, h);
        ext.push(H);
        tone.push(CORRIDOR_DOOR_TONE);
        wall.push(1);
      };
      const quad = (a0: number, a1: number, h0: number, h1: number) => {
        const s = pos.length / 3;
        vtx(a0, h0);
        vtx(a1, h0);
        vtx(a0, h1);
        vtx(a1, h1);
        idx.push(s, s + 1, s + 2, s + 2, s + 1, s + 3);
      };
      quad(0, cL, 0, H); // left jamb
      quad(cR, W2, 0, H); // right jamb
      quad(cL, cR, DOOR_H, H); // header above the doorway
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute("aExtent", new THREE.Float32BufferAttribute(ext, 1));
    g.setAttribute("aTone", new THREE.Float32BufferAttribute(tone, 1));
    g.setAttribute("aWall", new THREE.Float32BufferAttribute(wall, 1));
    g.setIndex(idx);
    return g;
  }, [nodes]);
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uPaper: { value: new THREE.Color(CANVAS_PAPER) },
        uDot: { value: new THREE.Color(CANVAS_DOT) },
        uGap: { value: 0.3 },
        uRadius: { value: 0.013 },
        uCorner: { value: 0.9 }, // softer corner shadow (closer to 1 = gentler)
        uFalloff: { value: 5.0 }, // spread the corner shadow further out
      },
      vertexShader: `
        attribute float aExtent;
        attribute float aTone;
        attribute float aWall;
        varying vec2 vUv;
        varying float vExtent;
        varying float vTone;
        varying float vWall;
        varying vec3 vWorld;
        void main() {
          vUv = uv;
          vExtent = aExtent;
          vTone = aTone;
          vWall = aWall;
          vWorld = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vExtent;
        varying float vTone;
        varying float vWall;
        varying vec3 vWorld;
        uniform vec3 uPaper;
        uniform vec3 uDot;
        uniform float uGap;
        uniform float uRadius;
        uniform float uCorner;
        uniform float uFalloff;
        void main() {
          // Consistent dots: floor/ceiling use a flat WORLD-XZ grid; walls use (along-path, height).
          // (Sweeping the dot UV along the path stretches them across the floor on curves.)
          vec2 dc = vWall > 0.5 ? vec2(vUv.x, vWorld.y) : vWorld.xz;
          vec2 cell = fract(dc / uGap) - 0.5;
          float d = length(cell) * uGap;
          float aa = 0.22 * fwidth(d) + 1e-5;
          float dot = 1.0 - smoothstep(uRadius - aa, uRadius + aa, d);
          vec3 col = mix(uPaper, uDot, dot);
          col *= vTone;                                   // per-surface tone → a crisp, sharp corner edge
          // soft, spread AO toward the nearest corner seam (this surface's two V-edges)
          float cd = min(vUv.y, vExtent - vUv.y);
          col *= mix(uCorner, 1.0, smoothstep(0.0, uFalloff, cd));
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh
      ref={(m) => {
        _corridorMesh = m;
      }}
      geometry={geometry}
      material={material}
    />
  );
}

// Swinging canvas doors — one per chapter-boundary wall, filling its doorway. Each hinges on one side
// and swings open as the camera nears, so you travel through the doorway, never the solid wall. Dots are
// drawn in the door's LOCAL coords (so they stay fixed on the panel as it swings), with an inset panel
// shade + an Ink handle so it reads as a door.
function makeDoorMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uPaper: { value: new THREE.Color(CANVAS_PAPER) },
      uDot: { value: new THREE.Color(CANVAS_DOT) },
      uInk: { value: new THREE.Color("#221436") },
      uGap: { value: 0.3 },
      uRadius: { value: 0.013 },
      uW: { value: DOOR_HALF_W * 2 },
      uH: { value: DOOR_H },
      uTone: { value: 0.98 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 uPaper;
      uniform vec3 uDot;
      uniform vec3 uInk;
      uniform float uGap;
      uniform float uRadius;
      uniform float uW;
      uniform float uH;
      uniform float uTone;
      void main() {
        vec2 wpos = vUv * vec2(uW, uH);          // local door coords in world units → consistent dots
        vec2 cell = fract(wpos / uGap) - 0.5;
        float d = length(cell) * uGap;
        float aa = 0.22 * fwidth(d) + 1e-5;
        float dot = 1.0 - smoothstep(uRadius - aa, uRadius + aa, d);
        vec3 col = mix(uPaper, uDot, dot) * uTone;
        float edge = min(min(vUv.x, 1.0 - vUv.x) * uW, min(vUv.y, 1.0 - vUv.y) * uH);
        col *= mix(0.82, 1.0, smoothstep(0.0, 0.5, edge)); // soft inset → recessed panel
        float hd = distance(wpos, vec2(uW - 0.6, uH * 0.46));
        col = mix(uInk, col, smoothstep(0.16, 0.24, hd)); // ink handle near the free edge
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

function DoorPanel({ u, hinge, quat, chapter, material, progress }: { u: number; hinge: THREE.Vector3; quat: THREE.Quaternion; chapter?: Chapter; material: THREE.ShaderMaterial; progress: React.MutableRefObject<number> }) {
  const swing = useRef<THREE.Group>(null);
  const open = useRef(0);
  const [opened, setOpened] = useState(() => _openDoors.has(u));
  const [near, setNear] = useState(false);
  const nearRef = useRef(false);
  const panelRef = useRef<THREE.Mesh>(null);
  useEffect(() => {
    const m = panelRef.current;
    if (!m) return;
    _doorMeshes.push(m); // so labels behind a shut door are occluded by it (not just the wall frame)
    return () => {
      const i = _doorMeshes.indexOf(m);
      if (i >= 0) _doorMeshes.splice(i, 1);
    };
  }, []);
  useFrame((_, dt) => {
    const target = opened ? 1 : 0; // the door only opens on Enter — never automatically
    open.current += (target - open.current) * Math.min(1, dt * 3); // gentle swing
    if (swing.current) swing.current.rotation.y = -open.current * (Math.PI / 2 + 0.12);
    const n = !opened && Math.abs(progress.current - u) < _DOOR_GATE_U + 0.02; // you've reached the door (where travel halts)
    if (n !== nearRef.current) {
      nearRef.current = n;
      setNear(n);
    }
  });
  return (
    <group position={hinge} quaternion={quat}>
      <group ref={swing}>
        <mesh ref={panelRef} material={material} position={[DOOR_HALF_W, DOOR_H / 2, 0]}>
          <planeGeometry args={[DOOR_HALF_W * 2, DOOR_H]} />
        </mesh>
      </group>
      {near && chapter && (
        <Html center position={[DOOR_HALF_W, DOOR_H * 0.62, 0]} distanceFactor={12} zIndexRange={[55, 35]}>
          <div className="flex select-none flex-col items-center gap-2">
            <div className="glass-pill whitespace-nowrap rounded-xl px-3 py-1 text-center backdrop-blur-md backdrop-saturate-150">
              <div className="text-xs font-bold leading-tight">{chapter.title}</div>
              {chapter.subtitle ? <div className="text-[10px] font-medium leading-tight opacity-85">{chapter.subtitle}</div> : null}
            </div>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setOpened(true);
                _openDoors.add(u); // release the travel gate past this door
              }}
              className="pointer-events-auto rounded-full border-[2.5px] border-ink bg-sun px-4 py-1.5 text-sm font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Enter →
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

function CorridorDoors({ nodes, chapters, progress }: { nodes: SceneNode[]; chapters: Chapter[]; progress: React.MutableRefObject<number> }) {
  const material = useMemo(() => makeDoorMaterial(), []);
  useEffect(() => () => material.dispose(), [material]);
  const doors = useMemo(() => {
    const { wallU, wallCap } = chapterSpacedUs(nodes);
    return wallU.map((u, k) => {
      const nextNode = nodes[wallCap[k] + 1]; // the door leads into the next chapter
      const chapter = nextNode ? chapters.find((c) => c.key === nextNode.chapter) : undefined;
      const p = CURVE.getPointAt(u);
      const tan = CURVE.getTangentAt(u);
      tan.y = 0;
      tan.normalize();
      const nx = -tan.z;
      const nz = tan.x;
      const hinge = new THREE.Vector3(p.x + nx * DOOR_HALF_W, p.y, p.z + nz * DOOR_HALF_W); // cL edge, on the floor
      // local X = across the doorway (-n), Y = up, Z = the closed door's normal (tangent)
      const basis = new THREE.Matrix4().makeBasis(new THREE.Vector3(-nx, 0, -nz), new THREE.Vector3(0, 1, 0), new THREE.Vector3(tan.x, 0, tan.z));
      const quat = new THREE.Quaternion().setFromRotationMatrix(basis);
      return { u, hinge, quat, chapter };
    });
  }, [nodes, chapters]);
  useEffect(() => {
    _doorUs = doors.map((d) => d.u); // publish for the camera + companion gates
    return () => {
      _doorUs = [];
    };
  }, [doors]);
  useFrame(() => {
    // travel gate: you can't glide past a shut door — clamp progress just short of the nearest closed one
    const door = _frontShutDoorU();
    if (door < Infinity && progress.current > door + _DOOR_GATE_U) progress.current = door + _DOOR_GATE_U;
  });
  return (
    <>
      {doors.map((d, i) => (
        <DoorPanel key={i} u={d.u} hinge={d.hinge} quat={d.quat} chapter={d.chapter} material={material} progress={progress} />
      ))}
    </>
  );
}

// A single thin drawn horizon line where the paper land meets the paper sky (replaces the old fog
// tint). A large, thin Ink band that follows the camera so it always sits at the horizon all around.
function CanvasHorizon() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = state.camera.position.x;
      ref.current.position.z = state.camera.position.z;
    }
  });
  return (
    <mesh ref={ref} renderOrder={2}>
      <cylinderGeometry args={[500, 500, 3, 120, 1, true]} />
      <meshBasicMaterial color={DOODLE_INK} side={THREE.DoubleSide} fog={false} depthWrite={false} transparent opacity={0.85} />
    </mesh>
  );
}

// Brand doodle confetti — the 8 marks in the 4 accents, floating across the sky (billboards).
const SKY_DOODLES: { name: DoodleMark; color: string }[] = [
  { name: "sparkle", color: "#FFC94D" },
  { name: "squiggle", color: "#2DD4BF" },
  { name: "star", color: "#FF7A5C" },
  { name: "swirl", color: "#7F65A4" },
  { name: "spiral", color: "#7F65A4" },
  { name: "sparkle", color: "#FF7A5C" },
  { name: "star", color: "#FFC94D" },
  { name: "zigzag", color: "#2DD4BF" },
  { name: "heart", color: "#FF7A5C" },
  { name: "squiggle", color: "#2DD4BF" },
  { name: "sparkle", color: "#FFC94D" },
  { name: "arrow", color: "#7F65A4" },
];
function DoodleMarks() {
  const texes = useMemo(() => SKY_DOODLES.map((d) => makeDoodleMarkTex(d.name, d.color)), []);
  useEffect(() => () => texes.forEach((t) => t.dispose()), [texes]);
  const marks = useMemo(() => {
    const rng = mulberry32(303);
    const n = Math.round(SKY_DOODLES.length * PATH_SCALE);
    return Array.from({ length: n }, (_, i) => ({
      i: i % SKY_DOODLES.length,
      x: (rng() - 0.5) * 300,
      y: 24 + rng() * 64,
      z: PATH_START_Z - rng() * PATH_SPAN_Z,
      s: 5.5 + rng() * 5,
    }));
  }, []);
  return (
    <group>
      {marks.map((m, k) => (
        <sprite key={k} position={[m.x, m.y, m.z]} scale={[m.s, m.s, 1]}>
          <spriteMaterial map={texes[m.i]} transparent depthWrite={false} fog={false} opacity={0.95} />
        </sprite>
      ))}
    </group>
  );
}

function DoodleClouds() {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => makeCloudDoodleTex(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const clouds = useMemo(() => {
    const rng = mulberry32(91);
    const arr: { x: number; y: number; z: number; s: number }[] = [];
    const n = Math.round(20 * PATH_SCALE);
    for (let i = 0; i < n; i++) {
      arr.push({ x: (rng() - 0.5) * 360, y: 48 + rng() * 46, z: PATH_START_Z - rng() * PATH_SPAN_Z, s: 22 + rng() * 22 });
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.004;
  });
  return (
    <group ref={ref}>
      {clouds.map((c, i) => (
        <sprite key={i} position={[c.x, c.y, c.z]} scale={[c.s, c.s * 0.6, 1]}>
          <spriteMaterial map={tex} transparent depthWrite={false} fog={false} opacity={0.96} />
        </sprite>
      ))}
    </group>
  );
}

function DoodleTrees() {
  const round = useMemo(() => makeTreeDoodleTex("round"), []);
  const pine = useMemo(() => makeTreeDoodleTex("pine"), []);
  useEffect(
    () => () => {
      round.dispose();
      pine.dispose();
    },
    [round, pine]
  );
  const trees = useMemo(() => {
    const rng = mulberry32(404);
    const out: { x: number; z: number; h: number; pine: boolean; flip: boolean }[] = [];
    let tries = 0;
    while (out.length < 170 && tries < 6000) {
      tries++;
      const x = (rng() * 2 - 1) * 62;
      const z = PATH_START_Z + 20 - rng() * (PATH_SPAN_Z + 44);
      if (distToPathSq(x, z) < 64) continue; // ~8u clearance from the trail
      const near = distToPathSq(x, z) < 676; // within ~26u → a touch smaller
      out.push({ x, z, h: (near ? 5.5 : 6.8) + rng() * 3, pine: rng() < 0.45, flip: rng() < 0.5 });
    }
    return out;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (
        <sprite key={i} position={[t.x, t.h * 0.5, t.z]} scale={[t.h * 0.8 * (t.flip ? -1 : 1), t.h, 1]}>
          <spriteMaterial map={t.pine ? pine : round} alphaTest={0.5} depthWrite />
        </sprite>
      ))}
    </group>
  );
}

function DrawnPath() {
  const { geometry, tex } = useMemo(() => {
    const N = Math.max(2, Math.ceil(CURVE.getLength() / 1.5));
    const pts = CURVE.getSpacedPoints(N);
    const hw = 2.7;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    let cum = 0;
    for (let i = 0; i <= N; i++) {
      const p = pts[i];
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(N, i + 1)];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      if (i > 0) {
        const pp = pts[i - 1];
        cum += Math.hypot(p.x - pp.x, p.z - pp.z);
      }
      pos.push(p.x + nx * hw, 0.09, p.z + nz * hw);
      pos.push(p.x - nx * hw, 0.09, p.z - nz * hw);
      const u = cum / 6;
      uv.push(u, 0, u, 1);
      if (i < N) {
        const k = i * 2;
        idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return { geometry: g, tex: makePathStrokeTex() };
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      tex.dispose();
    },
    [geometry, tex]
  );
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} fog polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
    </mesh>
  );
}

// The companion is now the brand flying ship (DOM/SVG, see Companion) — no GLB to preload.

// --- node markers ----------------------------------------------------------------------
// Bubble colour comes from the node's thread hex; state changes the *treatment* (full vs
// greyed) and the icon — colour carries the thread, per the single-path design.
function nodeShades(hex: string, state: NodeState, capstone: boolean) {
  const c = new THREE.Color(hex);
  if (state === "soon") c.lerp(new THREE.Color("#8b93a0"), capstone ? 0.22 : 0.72); // capstones stay gold; not-built lessons grey out
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

const _occOrigin = new THREE.Vector3();
const _occTarget = new THREE.Vector3();
const _occDir = new THREE.Vector3();
const _occRay = new THREE.Raycaster();
// Is a corridor wall — or a shut door panel — between the camera and this world point? Used to hide DOM
// node/banner labels that would otherwise draw on top of the wall they're really behind.
function _wallOccludes(camPos: THREE.Vector3, tx: number, ty: number, tz: number): boolean {
  if (!_corridorMesh) return false;
  _occOrigin.copy(camPos);
  _occTarget.set(tx, ty, tz);
  _occDir.subVectors(_occTarget, _occOrigin);
  const dist = _occDir.length();
  _occRay.set(_occOrigin, _occDir.normalize());
  _occRay.far = Math.max(0.1, dist - 0.6);
  const targets = _doorMeshes.length ? [_corridorMesh, ..._doorMeshes] : [_corridorMesh];
  return _occRay.intersectObjects(targets, false).length > 0;
}

// node ids whose completion beat (the earned-sticker 'drop') has already played — persisted, so it fires
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
}: {
  node: SceneNode;
  u: number;
  progress: React.MutableRefObject<number>;
  onSelect?: (n: SceneNode) => void;
  reduced: boolean;
  canvas: boolean;
  active: boolean; // the single "play me next" node — gets Lensy + the re-sketching ring
}) {
  const pos = useMemo(() => CURVE.getPointAt(u), [u]);
  const spr = useRef<THREE.Sprite>(null);
  const cap = !!node.capstone;
  const soon = node.state === "soon";
  const completed = node.state === "completed";
  const tilt = completed ? ([...node.id].reduce((s, c) => s + c.charCodeAt(0), 0) % 9) - 4 : 0; // jaunty 'stuck-on' angle per node
  const greyEmoji = soon && !cap; // capstones keep their gold; not-built lessons grey out
  const tex = useEmojiTexture(node.emoji, greyEmoji);
  const st = nodeShades(node.hex, node.state, cap);
  const bob = node.state === "playable";
  const sprScale = canvas ? (cap ? 4.6 : 3.7) : cap ? 2.5 : 1.8;
  const [inView, setInView] = useState(false);
  const inViewRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [occluded, setOccluded] = useState(false); // a corridor wall is between this node's label and the camera
  const occRef = useRef(false);
  // completion beat: play the earned-sticker 'drop' once, only on a NEW completion (not reload / re-scroll)
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    if (canvas && completed && !_celebrated.has(node.id)) {
      _markCelebrated(node.id);
      setBeat(true);
      const t = setTimeout(() => setBeat(false), 950);
      return () => clearTimeout(t);
    }
  }, [canvas, completed, node.id]);
  useFrame((s) => {
    if (spr.current) {
      spr.current.position.y = canvas ? 0.35 : 0.2 + (bob && !reduced ? Math.sin(s.clock.elapsedTime * 1.6) * 0.18 : 0); // canvas: no bob (spec — stuck on, never hovering)
    }
    // reveal the name when the node is at / just ahead of the camera focus
    // (touch has no hover, so on-screen nodes label themselves)
    const ahead = u - progress.current;
    const vis = ahead > -0.03 && ahead < 0.09;
    if (vis !== inViewRef.current) {
      inViewRef.current = vis;
      setInView(vis);
    }
    // the trigger is a DOM overlay (always-on-top); hide it when a corridor wall is between it and the
    // camera, so a node around the bend doesn't draw its dot over the wall.
    const hit = _wallOccludes(s.camera.position, pos.x, 1.5 + (cap ? 1.7 : 1.35), pos.z);
    if (hit !== occRef.current) {
      occRef.current = hit;
      setOccluded(hit);
    }
  });
  const focus = () => {
    progress.current = u; // camera glides to a focused/selected node
  };
  const select = () => {
    progress.current = u;
    if (!soon) onSelect?.(node);
  };
  // ---- canvas skin: a real Equal Lens DOM sticker (drei <Html>) using the site's own .sticker-soft
  // recipe + brand tokens — so it auto dark-flips, always faces the camera, and reuses the actual CSS
  // (not a hand-painted texture). Lift shadow = 'tappable' (spec §2); Locked is flat/un-inked. The glyph
  // is the lesson emoji, a stand-in for the game's hand-drawn sticker motif. ----
  if (canvas) {
    return (
      <group position={[pos.x, 0.13, pos.z]}>
        <Html center position={[0, 0, 0]} distanceFactor={17.6} zIndexRange={[30, 0]}>
          <div className="pointer-events-none relative flex flex-col items-center" style={{ visibility: occluded ? "hidden" : "visible" }}>
            <button
              type="button"
              aria-label={`${node.label} — ${cap ? "capstone, " : ""}${soon ? "locked" : node.state === "completed" ? "done" : "play"}`}
              disabled={soon}
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
              className={`pointer-events-auto relative grid place-items-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--violet-200)] disabled:cursor-default ${cap ? "size-40 bg-[var(--color-sun)]" : "size-32 bg-[var(--color-paper)]"} ${soon ? "node-locked" : completed ? "sticker-soft" : "sticker-soft hover-pop"}`}
            >
              <span className={`leading-none ${cap ? "text-[64px]" : "text-[52px]"} ${soon ? "opacity-50 grayscale" : ""}`}>{node.emoji}</span>
              {/* up-next: a small Grow-Coral play mark. done: a coral 'earned' check badge stamped on the corner */}
              {!soon && !active && !completed && (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[var(--color-grow)]" aria-hidden>
                  <svg viewBox="0 0 20 20" className="size-6">
                    <path d="M6 4 L6 16 L16 10 Z" fill="currentColor" />
                  </svg>
                </span>
              )}
              {!soon && completed && (
                <span className={`absolute -right-1 -top-1 grid size-9 place-items-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-grow)] text-[var(--color-paper)] ${beat ? "beat-badge" : ""}`} aria-hidden>
                  <svg viewBox="0 0 20 20" className="size-5">
                    <path d="M4 11 l4 4 l8 -10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
            {/* completion beat: a one-shot Unlearn→Relearn burst ring when this node has just been completed */}
            {beat && <span aria-hidden className="beat-burst pointer-events-none absolute left-1/2 top-1/2 rounded-full border-4" style={{ width: cap ? 170 : 142, height: cap ? 170 : 142 }} />}
            {/* Active node (spec §3/§5): the single 'play me next' — a re-sketching Equal-Violet ring +
                Lensy perched with a 'Play?' bubble. The strongest on-brand play cue; replaces the play mark. */}
            {active && (
              <>
                <svg viewBox="0 0 160 160" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: cap ? 196 : 160, height: cap ? 196 : 160 }}>
                  <circle cx="80" cy="80" r="73" fill="none" stroke="var(--color-brand)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="459" className="sketch-ring" />
                </svg>
                <div className="pointer-events-none absolute -top-11 right-0 flex translate-x-1/4 flex-col items-center">
                  <span style={{ fontFamily: "var(--font-hand)" }} className="mb-0.5 whitespace-nowrap rounded-full border-2 border-[var(--violet-600)] bg-[var(--color-paper)] px-2 py-0.5 text-[13px] font-bold text-[var(--color-ink)]">
                    Play?
                  </span>
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
        <div className="relative flex flex-col items-center" style={{ visibility: occluded ? "hidden" : "visible" }}>
          <button
            type="button"
            aria-label={`${node.label} — ${cap ? "capstone, " : ""}${node.state === "soon" ? "not built yet" : node.state}`}
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
  const [occluded, setOccluded] = useState(false);
  const occRef = useRef(false);
  useFrame((s) => {
    const ahead = u - progress.current;
    const vis = ahead > -0.045 && ahead < 0.07; // near the boundary only
    if (vis !== ref.current) {
      ref.current = vis;
      setInView(vis);
    }
    const hit = _wallOccludes(s.camera.position, p.x, 5, p.z);
    if (hit !== occRef.current) {
      occRef.current = hit;
      setOccluded(hit);
    }
  });
  return (
    <Html center position={[p.x, p.y, p.z]} distanceFactor={26} zIndexRange={[60, 40]}>
      <div
        style={{ visibility: occluded ? "hidden" : "visible" }}
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
    const span = Math.max(1, nodes.length - 1);
    return chapters
      .map((ch) => {
        const idx = nodes.findIndex((n) => n.chapter === ch.key);
        if (idx < 0) return null;
        // sit the sign ON the curve at the zero-crossing just BEFORE the chapter's first node —
        // nodes are sine extrema, so that midpoint is always x = 0 (screen-centre).
        const t = idx - 0.5;
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

const NODE_WINDOW = 5; // only ~5 levels rendered at a time; the window slides as you scroll
function Nodes({
  nodes,
  progress,
  onSelect,
  reduced,
  canvas,
}: {
  nodes: SceneNode[];
  progress: React.MutableRefObject<number>;
  onSelect?: (n: SceneNode) => void;
  reduced: boolean;
  canvas: boolean;
}) {
  const total = nodes.length;
  const us = useMemo(() => chapterSpacedUs(nodes).nodeU, [nodes]);
  // exactly one Active node = the next in the chain (first still-playable lesson); the rest are quiet
  const activeIndex = useMemo(() => nodes.findIndex((n) => n.state === "playable"), [nodes]);
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
        return <Node key={node.id} node={node} u={us[i]} progress={progress} onSelect={onSelect} reduced={reduced} canvas={canvas} active={canvas && i === activeIndex} />;
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
      <Html center distanceFactor={16} zIndexRange={[44, 24]}>
        <div ref={ship} className="pointer-events-none relative select-none" style={{ width: 82, transformOrigin: "50% 55%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ship/ship-flying.svg" alt="" draggable={false} style={{ width: 82, display: "block" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/ship/ship-flame.svg"
            alt=""
            draggable={false}
            className="flame-flicker"
            style={{ position: "absolute", left: "50%", top: "64%", width: 22, marginLeft: -11, zIndex: -1 }}
          />
        </div>
      </Html>
    </group>
  );
}

// Flat #FBF9FF paper background, no fog (the canvas world is season-independent).
function CanvasBackground() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.fog = null;
    scene.background = new THREE.Color(tokens.light.paper);
  }, [scene]);
  return null;
}

function FollowCam({ progress }: { progress: React.MutableRefObject<number> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useRef(new THREE.Vector3(0, 0, 0));
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
}: {
  nodes?: SceneNode[];
  chapters?: Chapter[];
  onSelectNode?: (n: SceneNode) => void;
  /** true while ANY game (swipe or engine) is being played in place — freezes the camera & hides nodes */
  playing?: boolean;
}) {
  // focus on load: the first playable lesson, else the first completed one, else the start
  const startU = useMemo(() => {
    let i = nodes.findIndex((n) => n.state === "playable");
    if (i < 0) i = nodes.findIndex((n) => n.state === "completed");
    return i >= 0 ? chapterSpacedUs(nodes).nodeU[i] : 0;
  }, [nodes]);
  const progress = useRef(startU);
  const [reduced, setReduced] = useState(false);
  // staged load (keeps mobile from uploading everything in one frame):
  // 0 = sky + land + mountains, 1 = + the path & nodes, 2 = + streamed foliage.
  const [phase, setPhase] = useState(0);
  // freeze the on-rails camera while a card game is being played
  const playingRef = useRef(false);
  playingRef.current = playing;

  useEffect(() => {
    const p1 = setTimeout(() => setPhase((p) => Math.max(p, 1)), 220);
    const p2 = setTimeout(() => setPhase((p) => Math.max(p, 2)), 750);
    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
    };
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    let lastY: number | null = null;
    let dragging = false;
    const onWheel = (e: WheelEvent) => {
      if (playingRef.current) return;
      progress.current = clamp01(progress.current - e.deltaY * 0.0008);
    };
    const onDown = (e: PointerEvent) => {
      if (playingRef.current) return;
      dragging = true;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || lastY == null) return;
      progress.current = clamp01(progress.current + (e.clientY - lastY) * 0.0012);
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
      lastY = null;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const timers = [setTimeout(fire, 80), setTimeout(fire, 300)];
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
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
      {/* soft, season-free lighting — enough to light Sam (the only lit 3D object) */}
      <hemisphereLight args={["#ffffff", "#e7e0f1", 1.1]} />
      <directionalLight position={[6, 14, 8]} intensity={1.15} />
      {/* phase 1: nodes + chapter signs (hidden while a level is being played).
          Nodes first so the chapter banners (rendered after) stack ABOVE the node labels. */}
      {phase >= 1 && !playing && (
        <>
          <Nodes nodes={nodes} progress={progress} onSelect={onSelectNode} reduced={reduced} canvas />
          <ChapterBanners chapters={chapters} nodes={nodes} progress={progress} />
          <Suspense fallback={null}>
            <Companion progress={progress} />
          </Suspense>
        </>
      )}
    </Canvas>
  );
}
