"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, Html, useTexture, useAnimations } from "@react-three/drei";
import { Check, Lock, Play, Trophy } from "lucide-react";
import { NODES, CHAPTERS, type Chapter } from "@/content/path";
import { SEASON_ORDER, SEASON_TARGET, SEASONS, seasonRT, type SeasonKey } from "@/lib/seasons";
import { PHASES, currentPhase, WARM, MOON_TINT } from "@/lib/time-of-day";
import { Weather } from "@/components/weather";
import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
  HueSaturation,
  BrightnessContrast,
  N8AO,
} from "@react-three/postprocessing";
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

// ~3× the spacing between nodes: scale the path's control points (same winding shape,
// just longer) and stretch the world to match (see PATH_* extents + scenery below).
const PATH_SCALE = 3;
const CURVE = new THREE.CatmullRomCurve3(
  (
    [
      [0, 22], [3.2, 12], [-3.2, 0], [3.2, -14], [-3, -28], [3, -44], [-3, -60],
      [3, -78], [-2.6, -98], [2.6, -120], [-2, -150], [1.5, -180], [0, -202],
    ] as [number, number][]
  ).map(([x, z]) => new THREE.Vector3(x * PATH_SCALE, 0, z * PATH_SCALE)),
  false,
  "catmullrom",
  0.5
);
// World extent derived from the (scaled) path, so scenery stretches to cover its full length.
const PATH_START_Z = 22 * PATH_SCALE;
const PATH_END_Z = -202 * PATH_SCALE;
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

function InstancedModel({
  url,
  matrices,
  castShadow = false,
  receiveShadow = false,
}: {
  url: string;
  matrices: THREE.Matrix4[];
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const { scene } = useGLTF(url);
  const { geometry, material } = useMemo(() => bakedMesh(scene), [scene]);
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const im = ref.current;
    if (!im) return;
    matrices.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
  }, [matrices, geometry]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, matrices.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
    />
  );
}

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
function trs(x: number, y: number, z: number, ry: number, sx: number, sy: number, sz: number) {
  _e.set(0, ry, 0);
  _q.setFromEuler(_e);
  _p.set(x, y, z);
  _s.set(sx, sy, sz);
  return new THREE.Matrix4().compose(_p, _q, _s);
}
function trsTilt(x: number, y: number, z: number, ex: number, ey: number, ez: number, sx: number, sy: number, sz: number) {
  _e.set(ex, ey, ez);
  _q.setFromEuler(_e);
  _p.set(x, y, z);
  _s.set(sx, sy, sz);
  return new THREE.Matrix4().compose(_p, _q, _s);
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
export type WorldSkin = "realistic" | "canvas";
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

const CANVAS_PAPER = "#FBF9FF";
const CANVAS_DOT = "#E7E0F1";

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
          uPx: { value: 30.0 },
          uDotPx: { value: 1.0 },
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
        uGap: { value: 0.3 }, // world units between dots (smaller = finer/denser)
        uRadius: { value: 0.013 }, // dot radius in world units (smaller = finer dots)
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
// the live corridor mesh (canvas skin only) — used to occlude DOM node/banner overlays behind walls.
// A module-level callback ref sidesteps any ref-forwarding-through-props subtlety.
let _corridorMesh: THREE.Mesh | null = null;
function CanvasCorridor() {
  const { geometry, material } = useMemo(() => {
    const len = CURVE.getLength();
    const N = Math.max(8, Math.ceil(len / 1.2));
    const pts = CURVE.getSpacedPoints(N);
    type Frame = { px: number; py: number; pz: number; nx: number; nz: number; u: number };
    const frames: Frame[] = [];
    let cum = 0;
    for (let i = 0; i <= N; i++) {
      const p = pts[i];
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(N, i + 1)];
      const tx = b.x - a.x;
      const tz = b.z - a.z;
      const tl = Math.hypot(tx, tz) || 1;
      if (i > 0) {
        const pp = pts[i - 1];
        cum += Math.hypot(p.x - pp.x, p.z - pp.z);
      }
      frames.push({ px: p.x, py: p.y, pz: p.z, nx: -tz / tl, nz: tx / tl, u: cum }); // left perpendicular
    }
    const W = CORRIDOR_W;
    const H = CORRIDOR_H;
    const W2 = 2 * W;
    const pos: number[] = [];
    const uv: number[] = [];
    const ext: number[] = [];
    const tone: number[] = [];
    const wall: number[] = [];
    const idx: number[] = [];
    // one swept strip: edges A→B per path sample, V from vA→vB across; vExtent = the surface's V-span;
    // surfTone = the surface's base brightness (floor/walls/ceiling differ slightly so each corner reads
    // as a crisp brightness STEP, a sharp edge); isWall picks the dot projection (walls vs floor/ceiling).
    const strip = (eA: (f: Frame) => number[], eB: (f: Frame) => number[], vA: number, vB: number, vExtent: number, surfTone: number, isWall: number) => {
      const start = pos.length / 3;
      for (let i = 0; i <= N; i++) {
        const f = frames[i];
        const A = eA(f);
        const B = eB(f);
        pos.push(A[0], A[1], A[2]);
        uv.push(f.u, vA);
        ext.push(vExtent);
        tone.push(surfTone);
        wall.push(isWall);
        pos.push(B[0], B[1], B[2]);
        uv.push(f.u, vB);
        ext.push(vExtent);
        tone.push(surfTone);
        wall.push(isWall);
        if (i < N) {
          const k = start + i * 2;
          idx.push(k, k + 1, k + 2, k + 2, k + 1, k + 3);
        }
      }
    };
    const lFloor = (f: Frame) => [f.px + f.nx * W, f.py, f.pz + f.nz * W];
    const rFloor = (f: Frame) => [f.px - f.nx * W, f.py, f.pz - f.nz * W];
    const lCeil = (f: Frame) => [f.px + f.nx * W, f.py + H, f.pz + f.nz * W];
    const rCeil = (f: Frame) => [f.px - f.nx * W, f.py + H, f.pz - f.nz * W];
    strip(lFloor, rFloor, 0, W2, W2, 1.0, 0); // floor — brightest
    strip(lFloor, lCeil, 0, H, H, 0.9, 1); // left wall — dimmer
    strip(rFloor, rCeil, 0, H, H, 0.9, 1); // right wall — dimmer
    strip(lCeil, rCeil, 0, W2, W2, 0.96, 0); // ceiling
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute("aExtent", new THREE.Float32BufferAttribute(ext, 1));
    g.setAttribute("aTone", new THREE.Float32BufferAttribute(tone, 1));
    g.setAttribute("aWall", new THREE.Float32BufferAttribute(wall, 1));
    g.setIndex(idx);
    const m = new THREE.ShaderMaterial({
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
    return { geometry: g, material: m };
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );
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

function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: seasonRT.skyTop.clone() },
          bottom: { value: seasonRT.skyBottom.clone() },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
          void main(){ float h = normalize(vP).y * 0.5 + 0.5; vec3 c = mix(bottom, top, smoothstep(0.0, 0.82, h)); gl_FragColor = vec4(c, 1.0); }`,
      }),
    []
  );
  // track the active season (driven by SeasonDriver via seasonRT)
  useFrame(() => {
    (mat.uniforms.top.value as THREE.Color).copy(seasonRT.skyTop);
    (mat.uniforms.bottom.value as THREE.Color).copy(seasonRT.skyBottom);
  });
  return (
    <mesh material={mat} position={[0, 0, PATH_MID_Z]}>
      <sphereGeometry args={[560, 32, 16]} />
    </mesh>
  );
}

function Clouds() {
  const ref = useRef<THREE.Group>(null);
  const matrices = useMemo(() => {
    const rng = mulberry32(77);
    const arr: THREE.Matrix4[] = [];
    // scattered across the full length of the (now longer) path, both sides
    for (let c = 0; c < 14 * PATH_SCALE; c++) {
      const cx = (rng() - 0.5) * 320;
      const cz = PATH_START_Z - rng() * PATH_SPAN_Z;
      const cy = 44 + rng() * 36;
      const puffs = 3 + Math.floor(rng() * 3);
      const base = 7 + rng() * 6;
      for (let b = 0; b < puffs; b++) {
        const s = base * (0.7 + rng() * 0.7);
        arr.push(trs(cx + (rng() - 0.5) * base * 2.2, cy + (rng() - 0.5) * 3, cz + (rng() - 0.5) * base * 1.4, rng() * 6.28, s, s * 0.8, s));
      }
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.005;
  });
  return (
    <group ref={ref}>
      <InstancedModel url="/models/cloud.glb" matrices={matrices} />
    </group>
  );
}

// --- land: one continuous grass field (no tiled-block seams) ---------------------------
// Coloured with the exact Kenney grass-top palette greens, varied by smooth noise so it
// reads as a living field rather than a flat sheet or a visible tile grid.
function Ground({ skin }: { skin: WorldSkin }) {
  // Precompute the per-vertex noise once, then a colour array per season (snow / golden /
  // deep-green / fresh / summer). The live attribute is swapped when the season changes.
  const { geo, colorArrays } = useMemo(() => {
    const g = new THREE.PlaneGeometry(700, PATH_SPAN_Z + 360, 180, Math.round((PATH_SPAN_Z + 360) / 3.9));
    const pos = g.attributes.position;
    const fbm = (x: number, z: number) =>
      (Math.sin(x * 0.08) * Math.cos(z * 0.07) +
        0.5 * Math.sin(x * 0.17 + 1.3) * Math.cos(z * 0.19 - 0.7) +
        0.25 * Math.sin(x * 0.31 - 2.1) * Math.cos(z * 0.29 + 1.1)) /
      1.75;
    const ts = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) ts[i] = fbm(pos.getX(i), -pos.getY(i)) * 0.5 + 0.5;
    const tmp = new THREE.Color();
    const colorArrays: Record<SeasonKey, Float32Array> = {} as Record<SeasonKey, Float32Array>;
    for (const season of SEASON_ORDER) {
      const pal = SEASONS[season].ground;
      const BASE = new THREE.Color(pal.base);
      const LIGHT = new THREE.Color(pal.light);
      const DARK = new THREE.Color(pal.dark);
      const arr = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const t = ts[i];
        tmp.copy(BASE);
        if (t > 0.5) tmp.lerp(LIGHT, (t - 0.5) * 2 * 0.6);
        else tmp.lerp(DARK, (0.5 - t) * 2 * 0.5);
        arr[i * 3] = tmp.r;
        arr[i * 3 + 1] = tmp.g;
        arr[i * 3 + 2] = tmp.b;
      }
      colorArrays[season] = arr;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colorArrays.summer.slice(), 3));
    return { geo: g, colorArrays };
  }, []);
  // canvas skin: the brand dotted paper (#FBF9FF + #ECE6F6 dots). Max anisotropy keeps the dots crisp
  // and un-stretched where the ground recedes toward the horizon.
  const gl = useThree((s) => s.gl);
  const paper = useMemo(() => {
    if (skin !== "canvas") return null;
    const t = makePaperTex();
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    t.repeat.set(paperRepeatFor(700), paperRepeatFor(PATH_SPAN_Z + 360));
    return t;
  }, [skin, gl]);
  useEffect(() => () => paper?.dispose(), [paper]);
  const appliedRef = useRef(-1);
  useFrame(() => {
    if (skin === "canvas") return; // static dotted paper — nothing to update per frame
    if (appliedRef.current === seasonRT.index) return;
    appliedRef.current = seasonRT.index;
    const season = SEASON_ORDER[seasonRT.index] ?? "summer";
    const attr = geo.attributes.color as THREE.BufferAttribute;
    (attr.array as Float32Array).set(colorArrays[season]);
    attr.needsUpdate = true;
  });
  if (skin === "canvas") {
    return (
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PATH_MID_Z]}>
        <meshBasicMaterial map={paper ?? undefined} toneMapped={false} />
      </mesh>
    );
  }
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PATH_MID_Z]} receiveShadow>
      <meshStandardMaterial vertexColors />
    </mesh>
  );
}

// Blocky grass mountains: each "massif" is a cluster of many overlapping grass blocks
// with a smooth height falloff, so they aggregate into rounded hills instead of lone
// pillars. Rings of massifs around the scene give layered, fog-receding terrain.
function Mountains() {
  const matrices = useMemo(() => {
    const rng = mulberry32(2024);
    const arr: THREE.Matrix4[] = [];
    // one solid block rising from below ground (base sunk at -4) up to height h
    const block = (x: number, z: number, h: number, w: number, ry: number) =>
      arr.push(trs(x, -4, z, ry, w, (h + 4) / 2, w));
    const massif = (cx: number, cz: number, R: number, H: number) => {
      const g = 4.6; // coarser block grid — ~40% fewer instances for the same silhouette
      for (let gx = -R; gx <= R; gx += g) {
        for (let gz = -R; gz <= R; gz += g) {
          const d = Math.hypot(gx, gz) / R;
          if (d > 1) continue;
          // gentle domed falloff -> wide skirt, gradual slope (low height over big radius)
          const hump = H * Math.cos(d * Math.PI * 0.5) * Math.cos(d * Math.PI * 0.5);
          const h = Math.max(2.5, hump + (rng() - 0.5) * H * 0.25);
          const w = ((g * 1.55) / 2.08) * (0.9 + rng() * 0.3);
          block(cx + gx + (rng() - 0.5) * 1.4, cz + gz + (rng() - 0.5) * 1.4, h, w, rng() * 6.28);
        }
      }
    };
    // A band of massifs flanking the path along its whole length (both sides, two depth
    // layers) so the horizon stays full now that the path is much longer.
    const flank = (sign: number, latMin: number, latMax: number, Rmin: number, Rmax: number, Hmin: number, Hmax: number, stepZ: number) => {
      for (let z = PATH_START_Z + 40; z >= PATH_END_Z - 40; z -= stepZ) {
        const cx = sign * (latMin + rng() * (latMax - latMin));
        const cz = z + (rng() - 0.5) * stepZ * 0.7;
        const R = Rmin + rng() * (Rmax - Rmin);
        if (distToPathSq(cx, cz) < (R + 12) * (R + 12)) continue; // keep clear of the path
        massif(cx, cz, R, Hmin + rng() * (Hmax - Hmin));
      }
    };
    for (const s of [-1, 1]) {
      flank(s, 58, 98, 16, 26, 6, 14, 56); // near, gentle green hills
      flank(s, 114, 176, 22, 36, 11, 23, 50); // mid range (denser)
      flank(s, 198, 272, 30, 46, 16, 32, 60); // far horizon — tall, hazy ranges
    }
    // close the vista at both ends so the horizon isn't open looking down the path
    massif(0, PATH_START_Z + 80, 42, 18);
    massif(-64, PATH_END_Z - 70, 40, 26);
    massif(70, PATH_END_Z - 96, 46, 30);
    massif(6, PATH_END_Z - 124, 52, 30);
    return arr;
  }, []);
  return <InstancedModel url="/models/block-grass-large-tall.glb" matrices={matrices} />;
}

// --- planked path ----------------------------------------------------------------------
function PlankPath() {
  const matrices = useMemo(() => {
    const len = CURVE.getLength();
    const step = 2.4; // chunkier, well-spaced boards instead of dense thin strips
    const N = Math.max(2, Math.ceil(len / step));
    const pts = CURVE.getSpacedPoints(N);
    const arr: THREE.Matrix4[] = [];
    for (let i = 0; i <= N; i++) {
      const p = pts[i];
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(N, i + 1)];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const ry = Math.atan2(dx, dz); // local +z -> path direction
      arr.push(trs(p.x, 0.07, p.z, ry, 3.8, 1.3, 2.55)); // wide, slightly thicker, long boards
    }
    return arr;
  }, []);
  return <InstancedModel url="/models/platform.glb" matrices={matrices} receiveShadow />;
}

// --- grass tufts (Kenney) with GPU wind ------------------------------------------------
function useWind(maxY: number, amp = 1) {
  const u = useRef({ uTime: { value: 0 } });
  useFrame((s) => {
    u.current.uTime.value = s.clock.elapsedTime;
  });
  return useCallback(
    (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = u.current.uTime;
      shader.vertexShader =
        `uniform float uTime;\n` +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec3 wp = instanceMatrix[3].xyz;
            float ph = wp.x * 0.28 + wp.z * 0.28;
            float w = sin(uTime * 1.3 + ph) + 0.35 * sin(uTime * 2.7 + ph * 1.7);
            float bend = clamp(position.y / ${maxY.toFixed(3)}, 0.0, 1.0);
            transformed.x += w * ${(0.12 * amp).toFixed(3)} * bend;
            transformed.z += w * ${(0.07 * amp).toFixed(3)} * bend;
          #endif`
        );
    },
    [maxY, amp]
  );
}

// ---- streamed foliage (mobile-friendly) -----------------------------------------------
// Only a window of chunks around the camera is populated; the rest is "cleared" (not
// drawn), so the GPU only ever holds a small, bounded number of instances. Each layer is a
// single fixed-capacity InstancedMesh whose matrices we refill as the window slides.
const FCHUNK = 72; // world-z units per foliage chunk
const F_BEHIND = 1; // chunks kept behind the camera
const F_AHEAD = 3; // chunks populated ahead (≈ the fog distance)
const fchunkOf = (z: number) => Math.floor((PATH_START_Z + 24 - z) / FCHUNK);
// chunk indices that fall inside the winter band (Holiday props live here; Platformer
// trees in these chunks are hidden once winter is the active season)
const WINTER_CHUNK_LO = Math.min(fchunkOf(WINTER_Z_MAX), fchunkOf(WINTER_Z_MIN));
const WINTER_CHUNK_HI = Math.max(fchunkOf(WINTER_Z_MAX), fchunkOf(WINTER_Z_MIN));
const isWinterChunk = (c: number) => c >= WINTER_CHUNK_LO && c <= WINTER_CHUNK_HI;
const WINTER_SEASON_INDEX = SEASON_ORDER.indexOf("winter");

type ScatterCfg = { count: number; seed: number; clearance: number; freq: number; zRange?: [number, number] };
function bucketScatter({ count, seed, clearance, freq, zRange }: ScatterCfg, zFilter?: (z: number) => boolean): Map<number, Placement[]> {
  const m = new Map<number, Placement[]>();
  for (const p of organicScatter(count, seed, clearance, freq, zRange)) {
    if (zFilter && !zFilter(p.z)) continue;
    const c = fchunkOf(p.z);
    let b = m.get(c);
    if (!b) m.set(c, (b = []));
    b.push(p);
  }
  return m;
}

const grassMatrix = (p: Placement) => {
  const s = 0.9 + p.s * 0.6; // low carpet, not big tufts
  const hy = s * (0.85 + p.s * 0.4);
  return trsTilt(p.x, 0, p.z, p.tx * 0.45, p.r, p.tz * 0.45, s, hy, s);
};
const flowerMatrix = (p: Placement) => {
  const s = 1.5 * (0.8 + p.s * 0.5);
  return trsTilt(p.x, 0, p.z, p.tx * 0.12, p.r, p.tz * 0.12, s, s, s);
};

// One instanced layer sized to the most the active window can hold (allocated once); on
// scroll we just refill 0..n from the active chunks and set `count` — out-of-view
// instances are simply not drawn, so memory stays flat.
function StreamLayer({
  geometry,
  material,
  buckets,
  active,
  toMatrix,
  castShadow = false,
  receiveShadow = false,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  buckets: Map<number, Placement[]>;
  active: number[];
  toMatrix: (p: Placement) => THREE.Matrix4;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const capacity = useMemo(() => {
    const keys = [...buckets.keys()];
    if (!keys.length) return 1;
    const lo = Math.min(...keys);
    const hi = Math.max(...keys);
    let max = 1;
    for (let c = lo - F_AHEAD; c <= hi + F_BEHIND; c++) {
      let s = 0;
      for (let i = c - F_BEHIND; i <= c + F_AHEAD; i++) s += buckets.get(i)?.length ?? 0;
      if (s > max) max = s;
    }
    return max;
  }, [buckets]);
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const im = ref.current;
    if (!im) return;
    let n = 0;
    for (const c of active) {
      const b = buckets.get(c);
      if (!b) continue;
      for (const p of b) {
        if (n >= capacity) break;
        im.setMatrixAt(n++, toMatrix(p));
      }
    }
    im.count = n;
    im.instanceMatrix.needsUpdate = true;
  }, [active, buckets, capacity, toMatrix]);
  return (
    <instancedMesh ref={ref} args={[geometry, material, capacity]} castShadow={castShadow} receiveShadow={receiveShadow} frustumCulled={false} />
  );
}

// --- scattered stylized props (Clone) --------------------------------------------------
// `winterSwap`: this Platformer prop is excluded from the winter region (Holiday props
// replace it there). `holiday`: this is a Holiday-Kit prop, scattered ONLY in winter and
// kept with its own festive colormap (skipped by the seasonal recolour).
type ModelCfg = {
  url: string;
  scale: number;
  count: number;
  seed: number;
  clearance: number;
  cast: boolean;
  tilt: number;
  winterSwap?: boolean;
  holiday?: boolean;
  roundTree?: boolean; // the broadleaf tree — turns blossom-pink in spring (conifers stay green)
  lamp?: boolean; // light-emitting prop — glows (emissive) at night
};

// Trees populate the whole path (season-coloured); in the winter region they're shown only
// while the active season ISN'T winter (so from autumn you see autumn-toned trees ahead),
// and hidden in favour of the Holiday snow trees once winter is active.
const TREE_MODELS: ModelCfg[] = [
  { url: "/models/tree.glb", scale: 5.2, count: 14, seed: 11, clearance: 7.5, cast: true, tilt: 0.05, roundTree: true },
  { url: "/models/tree-pine.glb", scale: 5.2, count: 10, seed: 23, clearance: 7.5, cast: true, tilt: 0.04 },
  { url: "/models/tree-pine-small.glb", scale: 4.8, count: 8, seed: 37, clearance: 7, cast: true, tilt: 0.06 },
];
const PROP_MODELS: ModelCfg[] = [
  { url: "/models/rocks.glb", scale: 2.0, count: 26, seed: 101, clearance: 3.5, cast: true, tilt: 0.22, winterSwap: true },
  { url: "/models/stones.glb", scale: 2.6, count: 20, seed: 113, clearance: 2.2, cast: false, tilt: 0.12, winterSwap: true },
  { url: "/models/mushrooms.glb", scale: 1.4, count: 16, seed: 127, clearance: 3, cast: false, tilt: 0.14, winterSwap: true },
  { url: "/models/plant.glb", scale: 1.5, count: 26, seed: 131, clearance: 2.3, cast: false, tilt: 0.14 },
  { url: "/models/flowers.glb", scale: 1.1, count: 40, seed: 163, clearance: 2.3, cast: false, tilt: 0.12, winterSwap: true },
  { url: "/models/sign.glb", scale: 2.2, count: 4, seed: 179, clearance: 3, cast: true, tilt: 0 },
  { url: "/models/flag.glb", scale: 2.4, count: 5, seed: 191, clearance: 3.5, cast: true, tilt: 0 },
];
// Holiday-Kit props for the winter region (counts are absolute — not ×PATH_SCALE — since
// they only populate the winter band).
const HOLIDAY_MODELS: ModelCfg[] = [
  // snow trees (replace the Platformer trees in winter)
  { url: "/models/holiday/tree-snow-a.glb", scale: 5.0, count: 9, seed: 701, clearance: 7.5, cast: true, tilt: 0.04, holiday: true },
  { url: "/models/holiday/tree-snow-b.glb", scale: 5.0, count: 8, seed: 713, clearance: 7.5, cast: true, tilt: 0.04, holiday: true },
  { url: "/models/holiday/tree-snow-c.glb", scale: 4.6, count: 6, seed: 727, clearance: 7, cast: true, tilt: 0.05, holiday: true },
  { url: "/models/holiday/tree-decorated-snow.glb", scale: 5.0, count: 4, seed: 733, clearance: 8, cast: true, tilt: 0, holiday: true },
  // festive accents
  { url: "/models/holiday/candy-cane-red.glb", scale: 2.4, count: 6, seed: 761, clearance: 2, cast: false, tilt: 0.04, holiday: true },
  { url: "/models/holiday/candy-cane-green.glb", scale: 2.4, count: 5, seed: 767, clearance: 2, cast: false, tilt: 0.04, holiday: true },
  { url: "/models/holiday/lantern.glb", scale: 2.6, count: 6, seed: 771, clearance: 2.4, cast: true, tilt: 0, holiday: true, lamp: true },
  { url: "/models/holiday/bench.glb", scale: 2.4, count: 5, seed: 777, clearance: 3, cast: true, tilt: 0, holiday: true },
  { url: "/models/holiday/snowman.glb", scale: 3.0, count: 12, seed: 781, clearance: 3, cast: true, tilt: 0, holiday: true },
  { url: "/models/holiday/sled.glb", scale: 2.6, count: 3, seed: 791, clearance: 3, cast: true, tilt: 0.05, holiday: true },
  { url: "/models/holiday/reindeer.glb", scale: 2.4, count: 3, seed: 797, clearance: 3, cast: true, tilt: 0, holiday: true },
  // snowy ground cover (replaces the white grass) + snow rocks (replace the rocks)
  { url: "/models/holiday/snow-flat.glb", scale: 3.2, count: 28, seed: 803, clearance: 1.6, cast: false, tilt: 0, holiday: true },
  { url: "/models/holiday/snow-flat-large.glb", scale: 3.6, count: 8, seed: 809, clearance: 3, cast: false, tilt: 0, holiday: true },
  { url: "/models/holiday/snow-pile.glb", scale: 3.0, count: 12, seed: 787, clearance: 2.4, cast: false, tilt: 0.08, holiday: true },
  { url: "/models/holiday/rocks-small.glb", scale: 2.0, count: 16, seed: 811, clearance: 2, cast: true, tilt: 0.14, holiday: true },
  { url: "/models/holiday/rocks-medium.glb", scale: 2.4, count: 10, seed: 817, clearance: 2.6, cast: true, tilt: 0.1, holiday: true },
  { url: "/models/holiday/rocks-large.glb", scale: 2.8, count: 6, seed: 823, clearance: 3.5, cast: true, tilt: 0.08, holiday: true },
];
const PROP_URLS = [...TREE_MODELS, ...PROP_MODELS, ...HOLIDAY_MODELS].map((m) => m.url);
const ENV_URLS = [
  "/models/block-grass-large-tall.glb",
  "/models/platform.glb",
  "/models/grass.glb",
  "/models/cloud.glb",
  "/models/flowers-tall.glb",
];
// Sam (the companion) shows in both skins, so preload her always; the realistic-world GLBs (trees,
// props, terrain, planks, clouds) are preloaded only when the realistic skin is active — the canvas
// skin uses none of them, so it should download zero of them.
useGLTF.preload("/models/characters/character-female-c.glb");
let _realisticPreloaded = false;
function preloadRealisticModels() {
  if (_realisticPreloaded) return;
  _realisticPreloaded = true;
  [...PROP_URLS, ...ENV_URLS].forEach((u) => useGLTF.preload(u));
}

// One streamed instanced layer per prop model (single-mesh Kenney models). Same organic
// scatter + lean as before, but only the chunks near the camera are populated.
function PropStream({ cfg, active }: { cfg: ModelCfg; active: number[] }) {
  const { scene } = useGLTF(cfg.url);
  const { geometry, material } = useMemo(() => {
    const b = bakedMesh(scene);
    if (cfg.holiday) (b.material as THREE.Material).userData.holiday = true; // keep its own festive colormap
    if (cfg.roundTree) (b.material as THREE.Material).userData.roundTree = true; // blossom pink in spring
    return b;
  }, [scene, cfg.holiday, cfg.roundTree]);
  const buckets = useMemo(
    () =>
      bucketScatter(
        {
          count: cfg.holiday ? cfg.count : Math.round(cfg.count * PATH_SCALE),
          seed: cfg.seed,
          clearance: cfg.clearance,
          freq: 0.07,
          zRange: cfg.holiday ? [WINTER_Z_MIN, WINTER_Z_MAX] : undefined,
        },
        cfg.winterSwap ? (z) => !inWinter(z) : undefined
      ),
    [cfg]
  );
  const toMatrix = useCallback(
    (p: Placement) => {
      const s = cfg.scale * (0.85 + p.s * 0.3);
      return trsTilt(p.x, 0, p.z, p.tx * cfg.tilt, p.r, p.tz * cfg.tilt, s, s, s);
    },
    [cfg]
  );
  // lamps glow at night (emissive driven by the day/night layer)
  useFrame(() => {
    if (!cfg.lamp) return;
    const mat = material as THREE.MeshStandardMaterial;
    if (!mat.emissive) return;
    mat.emissive.set("#ffce8a");
    mat.emissiveIntensity = seasonRT.night * 1.8;
  });
  return <StreamLayer geometry={geometry} material={material} buckets={buckets} active={active} toMatrix={toMatrix} castShadow={cfg.cast} receiveShadow />;
}

// Grass + flowers + props, all streamed to a window of chunks around the camera. Loaded
// last (after the land/mountains/path), and continuously cleared for areas out of view.
function StreamedFoliage({ progress }: { progress: React.MutableRefObject<number> }) {
  const grass = useGLTF("/models/grass.glb");
  const flowers = useGLTF("/models/flowers-tall.glb");
  const grassWind = useWind(0.31);
  const flowerWind = useWind(0.462, 0.6); // gentler sway than grass
  const grassRes = useMemo(() => {
    const b = bakedMesh(grass.scene);
    const mat = (b.material as THREE.MeshStandardMaterial).clone();
    mat.onBeforeCompile = grassWind;
    mat.customProgramCacheKey = () => "kenney-grass-wind";
    return { geometry: b.geometry, material: mat };
  }, [grass.scene, grassWind]);
  const flowerRes = useMemo(() => {
    const b = bakedMesh(flowers.scene);
    const mat = (b.material as THREE.MeshStandardMaterial).clone();
    mat.onBeforeCompile = flowerWind;
    mat.customProgramCacheKey = () => "flowers-tall-wind";
    return { geometry: b.geometry, material: mat };
  }, [flowers.scene, flowerWind]);
  // grass + tall flowers don't belong under snow — excluded from winter (snow-flat patches replace them)
  const grassB = useMemo(() => bucketScatter({ count: 9000, seed: 321, clearance: 2.0, freq: 0.05 }, (z) => !inWinter(z)), []);
  const flowerB = useMemo(() => bucketScatter({ count: 120, seed: 149, clearance: 2.4, freq: 0.09 }, (z) => !inWinter(z)), []);

  const [active, setActive] = useState<number[]>([]);
  const [winterView, setWinterView] = useState(false);
  const keyRef = useRef("");
  useFrame(() => {
    const z = CURVE.getPointAt(clamp01(progress.current)).z;
    const c = fchunkOf(z);
    const list: number[] = [];
    for (let i = c - F_BEHIND; i <= c + F_AHEAD; i++) list.push(i);
    const wv = seasonRT.index === WINTER_SEASON_INDEX;
    const k = list.join(",") + "|" + (wv ? 1 : 0);
    if (k !== keyRef.current) {
      keyRef.current = k;
      setActive(list);
      setWinterView(wv);
    }
  });

  // trees: drop the winter-band chunks once winter is active (Holiday snow trees take over there)
  const treeActive = useMemo(() => (winterView ? active.filter((c) => !isWinterChunk(c)) : active), [active, winterView]);
  // Holiday props: only the winter-band chunks, and only while winter is the active season
  const holidayActive = useMemo(() => (winterView ? active.filter((c) => isWinterChunk(c)) : []), [active, winterView]);

  return (
    <>
      <StreamLayer geometry={grassRes.geometry} material={grassRes.material} buckets={grassB} active={active} toMatrix={grassMatrix} />
      <StreamLayer geometry={flowerRes.geometry} material={flowerRes.material} buckets={flowerB} active={active} toMatrix={flowerMatrix} />
      {TREE_MODELS.map((m) => (
        <PropStream key={m.url} cfg={m} active={treeActive} />
      ))}
      {PROP_MODELS.map((m) => (
        <PropStream key={m.url} cfg={m} active={active} />
      ))}
      {HOLIDAY_MODELS.map((m) => (
        <PropStream key={m.url} cfg={m} active={holidayActive} />
      ))}
    </>
  );
}

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
function Node({
  node,
  u,
  progress,
  onSelect,
  reduced,
}: {
  node: SceneNode;
  u: number;
  progress: React.MutableRefObject<number>;
  onSelect?: (n: SceneNode) => void;
  reduced: boolean;
}) {
  const pos = useMemo(() => CURVE.getPointAt(u), [u]);
  const spr = useRef<THREE.Sprite>(null);
  const cap = !!node.capstone;
  const soon = node.state === "soon";
  const greyEmoji = soon && !cap; // capstones keep their gold; not-built lessons grey out
  const tex = useEmojiTexture(node.emoji, greyEmoji);
  const st = nodeShades(node.hex, node.state, cap);
  const bob = node.state === "playable";
  const sprScale = cap ? 2.5 : 1.8;
  const [inView, setInView] = useState(false);
  const inViewRef = useRef(false);
  const [occluded, setOccluded] = useState(false); // a corridor wall is between this node's label and the camera
  const occRef = useRef(false);
  useFrame((s) => {
    if (spr.current) {
      spr.current.position.y = 0.2 + (bob && !reduced ? Math.sin(s.clock.elapsedTime * 1.6) * 0.18 : 0);
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
    if (_corridorMesh) {
      _occOrigin.copy(s.camera.position);
      _occTarget.set(pos.x, 1.5 + (cap ? 1.7 : 1.35), pos.z);
      _occDir.subVectors(_occTarget, _occOrigin);
      const dist = _occDir.length();
      _occRay.set(_occOrigin, _occDir.normalize());
      _occRay.far = Math.max(0.1, dist - 0.6);
      const hit = _occRay.intersectObject(_corridorMesh, false).length > 0;
      if (hit !== occRef.current) {
        occRef.current = hit;
        setOccluded(hit);
      }
    } else if (occRef.current) {
      occRef.current = false;
      setOccluded(false);
    }
  });
  const focus = () => {
    progress.current = u; // camera glides to a focused/selected node
  };
  const select = () => {
    progress.current = u;
    if (!soon) onSelect?.(node);
  };
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
    if (_corridorMesh) {
      _occOrigin.copy(s.camera.position);
      _occTarget.set(p.x, 5, p.z);
      _occDir.subVectors(_occTarget, _occOrigin);
      const dist = _occDir.length();
      _occRay.set(_occOrigin, _occDir.normalize());
      _occRay.far = Math.max(0.1, dist - 0.6);
      const hit = _occRay.intersectObject(_corridorMesh, false).length > 0;
      if (hit !== occRef.current) {
        occRef.current = hit;
        setOccluded(hit);
      }
    } else if (occRef.current) {
      occRef.current = false;
      setOccluded(false);
    }
  });
  return (
    <Html center position={[p.x, 5, p.z]} distanceFactor={13} zIndexRange={[60, 40]}>
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
    const total = nodes.length || 1;
    return chapters
      .map((ch) => {
        const idx = nodes.findIndex((n) => n.chapter === ch.key);
        if (idx < 0) return null;
        const u = clamp01((idx + 0.5) / total);
        return { ch, u, p: CURVE.getPointAt(u) };
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
}: {
  nodes: SceneNode[];
  progress: React.MutableRefObject<number>;
  onSelect?: (n: SceneNode) => void;
  reduced: boolean;
}) {
  const total = nodes.length;
  const [start, setStart] = useState(0);
  const startRef = useRef(0);
  useFrame(() => {
    if (total <= NODE_WINDOW) return;
    const focus = Math.round(progress.current * total - 0.5);
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
        return <Node key={node.id} node={node} u={(i + 0.5) / total} progress={progress} onSelect={onSelect} reduced={reduced} />;
      })}
    </>
  );
}

function SunLight({ progress }: { progress: React.MutableRefObject<number> }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const scene = useThree((s) => s.scene);
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    scene.add(target);
    if (light.current) light.current.target = target;
    return () => {
      scene.remove(target);
    };
  }, [scene, target]);
  useFrame(() => {
    const p = CURVE.getPointAt(clamp01(progress.current));
    target.position.set(p.x, 0, p.z);
    target.updateMatrixWorld();
    if (light.current) {
      light.current.position.set(p.x + 16, 24, p.z + 14);
      light.current.color.copy(seasonRT.sunColor); // season-driven warmth/coolness
      light.current.intensity = seasonRT.sunIntensity;
    }
  });
  return (
    <directionalLight
      ref={light}
      intensity={1.25}
      color="#fff3da"
      castShadow
      shadow-intensity={0.55}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-bias={-0.0004}
      shadow-normalBias={0.05}
    >
      <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30, 1, 95]} />
    </directionalLight>
  );
}

// Ambient light driven by the active season (snow bounces more light, etc.).
function SeasonAmbient() {
  const ref = useRef<THREE.AmbientLight>(null);
  useFrame(() => {
    if (ref.current) ref.current.intensity = seasonRT.ambient;
  });
  return <ambientLight ref={ref} intensity={seasonRT.ambient} />;
}

// Drives the season from the camera's position along the path: lerps sky/fog/bg/sun toward
// the current chapter's season each frame (a ~1.5s crossfade at boundaries) and snaps the
// foliage colormap + ground colours when the season (chapter) changes. Single path, pure styling.
function SeasonDriver({
  progress,
  nodes,
  chapters,
  skin = "realistic",
}: {
  progress: React.MutableRefObject<number>;
  nodes: SceneNode[];
  chapters: Chapter[];
  skin?: WorldSkin;
}) {
  const canvas = skin === "canvas";
  const scene = useThree((s) => s.scene);
  const maps = useTexture({
    ...Object.fromEntries(SEASON_ORDER.map((k) => [k, SEASONS[k].colormap])),
    spring_blossom: "/models/Textures/colormap_spring_blossom.png", // pink, applied only to round trees in spring
  }) as Record<string, THREE.Texture>;
  useMemo(() => {
    Object.values(maps).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false;
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    });
  }, [maps]);

  const fog = useMemo(() => new THREE.Fog(seasonRT.fogColor.clone(), seasonRT.fogNear, seasonRT.fogFar), []);
  const bg = useMemo(() => seasonRT.bg.clone(), []);
  // canvas skin is season-independent: no fog, a flat #FBF9FF paper background — so no chapter tints it.
  const paperBg = useMemo(() => new THREE.Color(PAPER), []);
  useEffect(() => {
    scene.fog = canvas ? null : fog;
    scene.background = canvas ? paperBg : bg;
  }, [scene, fog, bg, canvas, paperBg]);
  useEffect(() => {
    const t = setTimeout(() => {
      const b = scene.background as THREE.Color | null;
      const info: string[] = [];
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh && mesh.geometry && (mesh.geometry.type === "PlaneGeometry" || mesh.geometry.type === "SphereGeometry")) {
          const m = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshBasicMaterial;
          const img = m?.map?.image as { width?: number; height?: number } | undefined;
          info.push(
            mesh.geometry.type +
              " mat=" + (m?.type ?? "?") +
              " vColors=" + (m as THREE.MeshBasicMaterial & { vertexColors?: boolean })?.vertexColors +
              " hasColorAttr=" + !!mesh.geometry.attributes.color +
              " map=" + (m?.map ? (img?.width + "x" + img?.height) : "none") +
              " toneMapped=" + (m as THREE.MeshBasicMaterial & { toneMapped?: boolean })?.toneMapped +
              " visible=" + mesh.visible
          );
        }
      });
      console.log("[MAT-DEBUG] bg=", b && b.isColor ? "#" + b.getHexString() : String(b), "|", info.join("  ||  "));
    }, 2500);
    return () => clearTimeout(t);
  }, [canvas, scene]);

  // re-apply once after foliage has mounted (it streams in after the env), so late materials get the season colormap
  const appliedMapRef = useRef(-1);
  useEffect(() => {
    const t = setTimeout(() => {
      appliedMapRef.current = -1;
    }, 1300);
    return () => clearTimeout(t);
  }, []);

  const firstRef = useRef(true);
  // pure-season values (lerped toward the active season) — kept private; the day/night layer
  // composes on top of these and writes the final values into seasonRT (what the scene reads).
  const sCur = useMemo(
    () => ({
      skyTop: SEASON_TARGET.summer.skyTop.clone(),
      skyBottom: SEASON_TARGET.summer.skyBottom.clone(),
      bg: SEASON_TARGET.summer.bg.clone(),
      fogColor: SEASON_TARGET.summer.fogColor.clone(),
      fogNear: SEASON_TARGET.summer.fogNear,
      fogFar: SEASON_TARGET.summer.fogFar,
      sunColor: SEASON_TARGET.summer.sunColor.clone(),
      sunIntensity: SEASON_TARGET.summer.sunIntensity,
      ambient: SEASON_TARGET.summer.ambient,
    }),
    []
  );
  const pCur = useMemo(() => ({ skyMul: 1, fogMul: 1, lightMul: 1, warmth: 0, lamps: 0, night: 0, tint: new THREE.Color("#ffffff") }), []);

  const seasonIndexForU = useCallback(
    (u: number) => {
      const total = nodes.length || 1;
      const idx = Math.max(0, Math.min(total - 1, Math.round(u * total - 0.5)));
      const ch = nodes[idx]?.chapter;
      const ci = ch ? chapters.findIndex((c) => c.key === ch) : 0;
      return ci >= 0 ? Math.min(ci, SEASON_ORDER.length - 1) : 0;
    },
    [nodes, chapters]
  );

  useFrame((_, dt) => {
    const si = seasonIndexForU(progress.current);
    const t = SEASON_TARGET[SEASON_ORDER[si]];
    const k = firstRef.current ? 1 : Math.min(1, dt * 1.6); // ~1.5s season crossfade
    sCur.skyTop.lerp(t.skyTop, k);
    sCur.skyBottom.lerp(t.skyBottom, k);
    sCur.bg.lerp(t.bg, k);
    sCur.fogColor.lerp(t.fogColor, k);
    sCur.sunColor.lerp(t.sunColor, k);
    sCur.fogNear += (t.fogNear - sCur.fogNear) * k;
    sCur.fogFar += (t.fogFar - sCur.fogFar) * k;
    sCur.sunIntensity += (t.sunIntensity - sCur.sunIntensity) * k;
    sCur.ambient += (t.ambient - sCur.ambient) * k;
    seasonRT.index = si;

    // day/night phase (device clock), eased
    const ph = PHASES[currentPhase()];
    const pk = firstRef.current ? 1 : Math.min(1, dt * 0.4);
    pCur.skyMul += (ph.skyMul - pCur.skyMul) * pk;
    pCur.fogMul += (ph.fogMul - pCur.fogMul) * pk;
    pCur.lightMul += (ph.lightMul - pCur.lightMul) * pk;
    pCur.warmth += (ph.warmth - pCur.warmth) * pk;
    pCur.lamps += (ph.lamps - pCur.lamps) * pk;
    pCur.night += (ph.night - pCur.night) * pk;
    pCur.tint.lerp(ph.tint, pk);

    // compose season × time of day -> seasonRT (final values the scene reads)
    seasonRT.skyTop.copy(sCur.skyTop).multiplyScalar(pCur.skyMul).lerp(pCur.tint, pCur.warmth);
    seasonRT.skyBottom.copy(sCur.skyBottom).multiplyScalar(pCur.skyMul).lerp(pCur.tint, pCur.warmth * 0.85);
    seasonRT.bg.copy(seasonRT.skyBottom);
    seasonRT.fogColor.copy(sCur.fogColor).multiplyScalar(0.45 + 0.55 * pCur.skyMul).lerp(pCur.tint, pCur.warmth * 0.6);
    seasonRT.fogNear = sCur.fogNear * pCur.fogMul;
    seasonRT.fogFar = sCur.fogFar * pCur.fogMul;
    seasonRT.sunColor.copy(sCur.sunColor).lerp(WARM, pCur.warmth).lerp(MOON_TINT, pCur.night * 0.6);
    seasonRT.sunIntensity = sCur.sunIntensity * pCur.lightMul;
    seasonRT.ambient = sCur.ambient * (0.45 + 0.55 * pCur.lightMul);
    seasonRT.night = pCur.night;

    if (!canvas) {
      bg.copy(seasonRT.bg);
      fog.color.copy(seasonRT.fogColor);
      fog.near = seasonRT.fogNear;
      fog.far = seasonRT.fogFar;
    }

    // swap the foliage/mountain colormap when the season changes (ground swaps via seasonRT.index)
    if (appliedMapRef.current !== si) {
      appliedMapRef.current = si;
      const map = maps[SEASON_ORDER[si]];
      const blossom = maps.spring_blossom;
      const spring = SEASON_ORDER[si] === "spring";
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (!mat || mat.userData?.holiday || mat.userData?.ownColormap) return; // keep their own colormap
        // round trees blossom pink in spring; everything else (grass/conifers/hills) takes the season map
        const target = mat.userData?.roundTree && spring ? blossom : map;
        if (mat.map && mat.map !== target) {
          mat.map = target;
          mat.needsUpdate = true;
        }
      });
    }
    firstRef.current = false;
  });

  return null;
}

// A little companion (Kenney Mini Characters) that travels the path beside you, idle-
// animated. Keeps its own skin colours (skipped by the seasonal recolour).
function Companion({ progress }: { progress: React.MutableRefObject<number> }) {
  const { scene, animations } = useGLTF("/models/characters/character-female-c.glb");
  const grp = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, inner);
  const st = useMemo(
    () => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), dir: new THREE.Vector3(), tan: new THREE.Vector3(), facing: 0, moving: false, started: false }),
    []
  );
  const SCALE = 2.6;
  // plant the model's lowest point on the ground (its origin is at the feet, so this ~0)
  const lift = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return Number.isFinite(box.min.y) ? -box.min.y * SCALE : 0;
  }, [scene]);

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true; // a grounding shadow so it sits in the world
        if (m.material) (m.material as THREE.Material).userData.ownColormap = true; // keep its own skin colours
      }
    });
  }, [scene]);

  useEffect(() => {
    actions?.idle?.reset().fadeIn(0.3).play();
  }, [actions]);

  useFrame((state, dt) => {
    const g = grp.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    // target: beside the focused node, set back a little from the camera
    const u = clamp01(progress.current + 0.005);
    const p = CURVE.getPointAt(u);
    st.tan.copy(CURVE.getTangentAt(u));
    st.tan.y = 0;
    if (st.tan.lengthSq() === 0) st.tan.set(0, 0, -1);
    st.tan.normalize();
    st.tgt.set(p.x - st.tan.z * 2.9, 0, p.z + st.tan.x * 2.9);
    if (!st.started) {
      st.started = true;
      st.pos.copy(st.tgt);
    }
    st.dir.copy(st.tgt).sub(st.pos);
    let dist = st.dir.length();
    const wasMoving = st.moving;
    if (dist > 0.18) {
      if (dist > 45) {
        // never fall absurdly far behind (very fast scrolls)
        st.pos.lerp(st.tgt, 1 - 45 / dist);
        st.dir.copy(st.tgt).sub(st.pos);
        dist = st.dir.length();
      }
      st.dir.normalize();
      const speed = Math.min(26, Math.max(6, dist * 1.8)); // walk normally, run to catch up when far
      st.pos.addScaledVector(st.dir, Math.min(dist, speed * d));
      st.facing = Math.atan2(st.dir.x, st.dir.z);
      st.moving = true;
      if (actions?.walk) actions.walk.timeScale = Math.min(2.4, Math.max(0.9, speed / 6)); // less foot-slide
    } else {
      st.pos.copy(st.tgt);
      // face the camera (the player) when standing still
      st.facing = Math.atan2(state.camera.position.x - st.pos.x, state.camera.position.z - st.pos.z);
      st.moving = false;
    }
    g.position.copy(st.pos);
    let df = st.facing - g.rotation.y;
    while (df > Math.PI) df -= Math.PI * 2;
    while (df < -Math.PI) df += Math.PI * 2;
    g.rotation.y += df * Math.min(1, d * 9); // smooth turn
    if (st.moving !== wasMoving) {
      if (st.moving) {
        actions?.idle?.fadeOut(0.2);
        actions?.walk?.reset().fadeIn(0.2).play();
      } else {
        actions?.walk?.fadeOut(0.2);
        actions?.idle?.reset().fadeIn(0.25).play();
      }
    }
  });

  return (
    <group ref={grp}>
      <group ref={inner} scale={SCALE} position={[0, lift, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Stars + a soft moon, faded in by the night factor (seasonRT.night). Follows the camera.
function NightSky() {
  const grp = useRef<THREE.Group>(null);
  const starPos = useMemo(() => {
    const N = 260;
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - Math.random() * 0.72); // upper dome
      const R = 420;
      a[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      a[i * 3 + 1] = 50 + Math.abs(R * Math.cos(phi));
      a[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);
    }
    return a;
  }, []);
  const moonTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 3, 32, 32, 30);
    grad.addColorStop(0, "rgba(255,255,248,1)");
    grad.addColorStop(0.55, "rgba(228,236,255,0.92)");
    grad.addColorStop(1, "rgba(228,236,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const starMat = useMemo(() => new THREE.PointsMaterial({ color: "#ffffff", size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false }), []);
  const moonMat = useMemo(() => new THREE.SpriteMaterial({ map: moonTex, transparent: true, opacity: 0, depthWrite: false, fog: false }), [moonTex]);
  useEffect(
    () => () => {
      starMat.dispose();
      moonMat.dispose();
      moonTex.dispose();
    },
    [starMat, moonMat, moonTex]
  );
  useFrame((state) => {
    const n = seasonRT.night;
    starMat.opacity = n;
    moonMat.opacity = n;
    if (grp.current) {
      grp.current.position.x = state.camera.position.x;
      grp.current.position.z = state.camera.position.z;
    }
  });
  return (
    <group ref={grp}>
      <points frustumCulled={false} material={starMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPos, 3]} />
        </bufferGeometry>
      </points>
      <sprite material={moonMat} position={[70, 150, -130]} scale={[40, 40, 40]} />
    </group>
  );
}

function FollowCam({ progress }: { progress: React.MutableRefObject<number> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useRef(new THREE.Vector3(0, 1.2, 14));
  useFrame(() => {
    const portrait = size.width / size.height < 1;
    const back = portrait ? 12 : 8.5;
    const height = portrait ? 7.5 : 5.5;
    const u = clamp01(progress.current);
    const p = CURVE.getPointAt(u);
    const tan = CURVE.getTangentAt(u);
    tan.y = 0;
    if (tan.lengthSq() === 0) tan.set(0, 0, -1);
    tan.normalize();
    camera.position.lerp(new THREE.Vector3(p.x - tan.x * back, height, p.z - tan.z * back), 0.12);
    look.current.lerp(new THREE.Vector3(p.x + tan.x * 6, 1.2, p.z + tan.z * 6), 0.12);
    camera.lookAt(look.current);
    const fov = portrait ? 56 : 48;
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
  skin = "realistic",
}: {
  nodes?: SceneNode[];
  chapters?: Chapter[];
  onSelectNode?: (n: SceneNode) => void;
  /** true while ANY game (swipe or engine) is being played in place — freezes the camera & hides nodes */
  playing?: boolean;
  /** "realistic" = the GLTF 3D world (default); "canvas" = the hand-drawn doodle-on-paper re-skin */
  skin?: WorldSkin;
}) {
  const canvas = skin === "canvas";
  useEffect(() => {
    console.log("[SKIN-DEBUG] PathScene mounted with skin =", skin, "canvas =", canvas);
  }, [skin, canvas]);
  // only the realistic skin needs the GLTF world; preload its models lazily (canvas downloads none)
  useEffect(() => {
    if (!canvas) preloadRealisticModels();
  }, [canvas]);
  // focus on load: the first playable lesson, else the first completed one, else the start
  const startU = useMemo(() => {
    let i = nodes.findIndex((n) => n.state === "playable");
    if (i < 0) i = nodes.findIndex((n) => n.state === "completed");
    return i >= 0 ? (i + 0.5) / nodes.length : 0;
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
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false, toneMappingExposure: 1.05, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      camera={{ position: [0, 6, 30], fov: 48 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* season-driven: SeasonDriver sets scene.background + scene.fog and lerps the rest */}
      <Suspense fallback={null}>
        <SeasonDriver progress={progress} nodes={nodes} chapters={chapters} skin={skin} />
      </Suspense>
      {/* phase 0: sky + land. CANVAS SKIN = a blank white world (white ground + white sky), nothing
          else — a fresh base to build up block by block. The realistic GLTF world is unchanged. */}
      {canvas ? <CanvasSky /> : <SkyDome />}
      {!canvas && <Clouds />}
      <NightSky />
      <FollowCam progress={progress} />
      <SunLight progress={progress} />
      <hemisphereLight args={["#dcefff", "#8fc06a", 0.5]} />
      <SeasonAmbient />
      {canvas ? <CanvasCorridor /> : <Ground skin={skin} />}
      <Suspense fallback={null}>
        {!canvas && <Mountains />}
        {phase >= 1 && !canvas && <PlankPath />}
        {phase >= 2 && !canvas && <StreamedFoliage progress={progress} />}
      </Suspense>
      {phase >= 2 && !canvas && <Weather />}
      {/* phase 1: checkpoints + region signs (hidden while a level is being played).
          Nodes first so the chapter banners (rendered after) stack ABOVE the node labels. */}
      {phase >= 1 && !playing && (
        <>
          <Nodes nodes={nodes} progress={progress} onSelect={onSelectNode} reduced={reduced} />
          <ChapterBanners chapters={chapters} nodes={nodes} progress={progress} />
          <Suspense fallback={null}>
            <Companion progress={progress} />
          </Suspense>
        </>
      )}
      {canvas ? null : (
        <EffectComposer multisampling={0}>
          {/* soft contact-darkening where grass/rocks/trees/path meet the ground */}
          <N8AO halfRes aoRadius={1.6} distanceFalloff={1} intensity={0.6} quality="performance" />
          <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.3} mipmapBlur radius={0.5} />
          <BrightnessContrast brightness={0.0} contrast={0.05} />
          <HueSaturation saturation={0.08} />
          <Vignette offset={0.34} darkness={0.4} />
          <SMAA />
        </EffectComposer>
      )}
    </Canvas>
  );
}
