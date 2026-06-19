"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { Check, Lock, Play, Trophy } from "lucide-react";
import type { Chapter } from "@/content/path";
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
function organicScatter(count: number, seed: number, clearance: number, freq: number): Placement[] {
  const rng = mulberry32(seed);
  const out: Placement[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 80) {
    tries++;
    const x = (rng() * 2 - 1) * 52;
    const z = PATH_START_Z + 18 - rng() * (PATH_SPAN_Z + 44);
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
function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color("#79bdf7") },
          bottom: { value: new THREE.Color("#eaf6ff") },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
          void main(){ float h = normalize(vP).y * 0.5 + 0.5; vec3 c = mix(bottom, top, smoothstep(0.0, 0.82, h)); gl_FragColor = vec4(c, 1.0); }`,
      }),
    []
  );
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
function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(700, PATH_SPAN_Z + 360, 180, Math.round((PATH_SPAN_Z + 360) / 3.9));
    const pos = g.attributes.position;
    const colors: number[] = [];
    const BASE = new THREE.Color("#3da679");
    const LIGHT = new THREE.Color("#59c387");
    const DARK = new THREE.Color("#20896b");
    const tmp = new THREE.Color();
    const fbm = (x: number, z: number) =>
      (Math.sin(x * 0.08) * Math.cos(z * 0.07) +
        0.5 * Math.sin(x * 0.17 + 1.3) * Math.cos(z * 0.19 - 0.7) +
        0.25 * Math.sin(x * 0.31 - 2.1) * Math.cos(z * 0.29 + 1.1)) /
      1.75;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = -pos.getY(i); // plane y -> world -z after the -90° rotation
      const t = fbm(x, z) * 0.5 + 0.5;
      tmp.copy(BASE);
      if (t > 0.5) tmp.lerp(LIGHT, (t - 0.5) * 2 * 0.6);
      else tmp.lerp(DARK, (0.5 - t) * 2 * 0.5);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
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

type ScatterCfg = { count: number; seed: number; clearance: number; freq: number };
function bucketScatter({ count, seed, clearance, freq }: ScatterCfg): Map<number, Placement[]> {
  const m = new Map<number, Placement[]>();
  for (const p of organicScatter(count, seed, clearance, freq)) {
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
type ModelCfg = { url: string; scale: number; count: number; seed: number; clearance: number; cast: boolean; tilt: number };

const TREE_MODELS: ModelCfg[] = [
  { url: "/models/tree.glb", scale: 5.2, count: 14, seed: 11, clearance: 7.5, cast: true, tilt: 0.05 },
  { url: "/models/tree-pine.glb", scale: 5.2, count: 10, seed: 23, clearance: 7.5, cast: true, tilt: 0.04 },
  { url: "/models/tree-pine-small.glb", scale: 4.8, count: 8, seed: 37, clearance: 7, cast: true, tilt: 0.06 },
];
const PROP_MODELS: ModelCfg[] = [
  { url: "/models/rocks.glb", scale: 2.0, count: 26, seed: 101, clearance: 3.5, cast: true, tilt: 0.22 },
  { url: "/models/stones.glb", scale: 2.6, count: 20, seed: 113, clearance: 2.2, cast: false, tilt: 0.12 },
  { url: "/models/mushrooms.glb", scale: 1.4, count: 16, seed: 127, clearance: 3, cast: false, tilt: 0.14 },
  { url: "/models/plant.glb", scale: 1.5, count: 26, seed: 131, clearance: 2.3, cast: false, tilt: 0.14 },
  { url: "/models/flowers.glb", scale: 1.1, count: 40, seed: 163, clearance: 2.3, cast: false, tilt: 0.12 },
  { url: "/models/sign.glb", scale: 2.2, count: 4, seed: 179, clearance: 3, cast: true, tilt: 0 },
  { url: "/models/flag.glb", scale: 2.4, count: 5, seed: 191, clearance: 3.5, cast: true, tilt: 0 },
];
const PROP_URLS = [...TREE_MODELS, ...PROP_MODELS].map((m) => m.url);
const ENV_URLS = [
  "/models/block-grass-large-tall.glb",
  "/models/platform.glb",
  "/models/grass.glb",
  "/models/cloud.glb",
  "/models/flowers-tall.glb",
];
[...PROP_URLS, ...ENV_URLS].forEach((u) => useGLTF.preload(u));

// One streamed instanced layer per prop model (single-mesh Kenney models). Same organic
// scatter + lean as before, but only the chunks near the camera are populated.
function PropStream({ cfg, active }: { cfg: ModelCfg; active: number[] }) {
  const { scene } = useGLTF(cfg.url);
  const { geometry, material } = useMemo(() => bakedMesh(scene), [scene]);
  const buckets = useMemo(
    () => bucketScatter({ count: Math.round(cfg.count * PATH_SCALE), seed: cfg.seed, clearance: cfg.clearance, freq: 0.07 }),
    [cfg]
  );
  const toMatrix = useCallback(
    (p: Placement) => {
      const s = cfg.scale * (0.85 + p.s * 0.3);
      return trsTilt(p.x, 0, p.z, p.tx * cfg.tilt, p.r, p.tz * cfg.tilt, s, s, s);
    },
    [cfg]
  );
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
  const grassB = useMemo(() => bucketScatter({ count: 9000, seed: 321, clearance: 2.0, freq: 0.05 }), []);
  const flowerB = useMemo(() => bucketScatter({ count: 120, seed: 149, clearance: 2.4, freq: 0.09 }), []);

  const [active, setActive] = useState<number[]>([]);
  const keyRef = useRef("");
  useFrame(() => {
    const z = CURVE.getPointAt(clamp01(progress.current)).z;
    const c = fchunkOf(z);
    const list: number[] = [];
    for (let i = c - F_BEHIND; i <= c + F_AHEAD; i++) list.push(i);
    const k = list.join(",");
    if (k !== keyRef.current) {
      keyRef.current = k;
      setActive(list);
    }
  });

  return (
    <>
      <StreamLayer geometry={grassRes.geometry} material={grassRes.material} buckets={grassB} active={active} toMatrix={grassMatrix} />
      <StreamLayer geometry={flowerRes.geometry} material={flowerRes.material} buckets={flowerB} active={active} toMatrix={flowerMatrix} />
      {[...TREE_MODELS, ...PROP_MODELS].map((m) => (
        <PropStream key={m.url} cfg={m} active={active} />
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
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            aria-label={`${node.label} — ${cap ? "capstone, " : ""}${node.state === "soon" ? "not built yet" : node.state}`}
            disabled={soon}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={focus}
            onClick={select}
            style={{ background: st.badge }}
            className={`peer pointer-events-auto flex items-center justify-center rounded-full text-white shadow-md ring-2 ring-white/85 transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110 focus-visible:ring-4 focus-visible:ring-white disabled:cursor-default disabled:opacity-95 ${cap ? "size-10" : "size-8"}`}
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
    <Html center position={[p.x, 6.4, p.z]} distanceFactor={13} zIndexRange={[60, 40]}>
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
    if (light.current) light.current.position.set(p.x + 16, 24, p.z + 14);
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
      gl={{ antialias: false, toneMappingExposure: 1.05, powerPreference: "high-performance" }}
      camera={{ position: [0, 6, 30], fov: 48 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#eaf6ff"]} />
      <fog attach="fog" args={["#dbeefb", 40, 235]} />
      {/* phase 0: sky + land + mountains */}
      <SkyDome />
      <Clouds />
      <FollowCam progress={progress} />
      <SunLight progress={progress} />
      <hemisphereLight args={["#dcefff", "#8fc06a", 0.5]} />
      <ambientLight intensity={0.4} />
      <Ground />
      <Suspense fallback={null}>
        <Mountains />
        {/* phase 1: the path itself */}
        {phase >= 1 && <PlankPath />}
        {/* phase 2: foliage, streamed to a window of chunks around the camera */}
        {phase >= 2 && <StreamedFoliage progress={progress} />}
      </Suspense>
      {/* phase 1: checkpoints + region signs (hidden while a level is being played) */}
      {phase >= 1 && !playing && (
        <>
          <ChapterBanners chapters={chapters} nodes={nodes} progress={progress} />
          <Nodes nodes={nodes} progress={progress} onSelect={onSelectNode} reduced={reduced} />
        </>
      )}
      <EffectComposer multisampling={0}>
        {/* soft contact-darkening where grass/rocks/trees/path meet the ground */}
        <N8AO halfRes aoRadius={1.6} distanceFalloff={1} intensity={0.6} quality="performance" />
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.3} mipmapBlur radius={0.5} />
        <BrightnessContrast brightness={0.0} contrast={0.05} />
        <HueSaturation saturation={0.08} />
        <Vignette offset={0.34} darkness={0.4} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
