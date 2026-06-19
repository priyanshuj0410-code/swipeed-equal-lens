"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, Html, RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import { Check, Lock, Play } from "lucide-react";
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

const CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 22),
    new THREE.Vector3(3.2, 0, 12),
    new THREE.Vector3(-3.2, 0, 0),
    new THREE.Vector3(3.2, 0, -14),
    new THREE.Vector3(-3, 0, -28),
    new THREE.Vector3(3, 0, -44),
    new THREE.Vector3(-3, 0, -60),
    new THREE.Vector3(3, 0, -78),
    new THREE.Vector3(-2.6, 0, -98),
    new THREE.Vector3(2.6, 0, -120),
    new THREE.Vector3(-2, 0, -150),
    new THREE.Vector3(1.5, 0, -180),
    new THREE.Vector3(0, 0, -202),
  ],
  false,
  "catmullrom",
  0.5
);

export type NodeState = "completed" | "current" | "locked";
export type SceneNode = { id: string; label: string; state: NodeState; href?: string; emoji: string };

// Fallback nodes if the host doesn't pass real ones (the /path page derives them from
// PATH content + saved progress and passes them in).
const DEFAULT_NODES: SceneNode[] = [
  { id: "glrl", label: "Green Light / Red Light", state: "current", href: "/decks", emoji: "🚦" },
  { id: "n2", label: "Coming soon", state: "locked", emoji: "🌱" },
  { id: "n3", label: "Coming soon", state: "locked", emoji: "💬" },
  { id: "n4", label: "Coming soon", state: "locked", emoji: "🤝" },
  { id: "n5", label: "Coming soon", state: "locked", emoji: "⭐" },
];
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const PATH_PTS = Array.from({ length: 90 }, (_, i) => CURVE.getPointAt(i / 89));

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
    const x = (rng() * 2 - 1) * 50;
    const z = 26 - rng() * 236;
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
    <mesh material={mat} position={[0, 0, -90]}>
      <sphereGeometry args={[520, 32, 16]} />
    </mesh>
  );
}

function Clouds() {
  const ref = useRef<THREE.Group>(null);
  const matrices = useMemo(() => {
    const rng = mulberry32(77);
    const arr: THREE.Matrix4[] = [];
    for (let c = 0; c < 14; c++) {
      const ang = rng() * Math.PI * 2;
      const rad = 95 + rng() * 150;
      const cx = Math.cos(ang) * rad;
      const cz = -90 + Math.sin(ang) * rad;
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
    const g = new THREE.PlaneGeometry(700, 700, 180, 180);
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
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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
      const g = 3.6;
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
    const ring = (count: number, radMin: number, radMax: number, Rmin: number, Rmax: number, Hmin: number, Hmax: number) => {
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.55;
        const rad = radMin + rng() * (radMax - radMin);
        const cx = Math.cos(ang) * rad;
        const cz = -90 + Math.sin(ang) * rad;
        const R = Rmin + rng() * (Rmax - Rmin);
        if (distToPathSq(cx, cz) < (R + 12) * (R + 12)) continue; // keep clear of the path
        massif(cx, cz, R, Hmin + rng() * (Hmax - Hmin));
      }
    };
    ring(8, 68, 104, 16, 26, 6, 14); // near, wide gentle green hills
    ring(10, 128, 182, 22, 36, 10, 22); // far, broad hazier range
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

function GrassTufts() {
  const { scene } = useGLTF("/models/grass.glb");
  const onBeforeCompile = useWind(0.31);
  const { geometry, material } = useMemo(() => {
    const b = bakedMesh(scene);
    const mat = (b.material as THREE.MeshStandardMaterial).clone();
    mat.onBeforeCompile = onBeforeCompile;
    mat.customProgramCacheKey = () => "kenney-grass-wind";
    return { geometry: b.geometry, material: mat };
  }, [scene, onBeforeCompile]);
  const matrices = useMemo(() => {
    const places = organicScatter(5200, 321, 2.0, 0.05);
    return places.map((p) => {
      const s = 0.9 + p.s * 0.6; // low carpet, not big tufts
      const hy = s * (0.85 + p.s * 0.4);
      return trsTilt(p.x, 0, p.z, p.tx * 0.45, p.r, p.tz * 0.45, s, hy, s);
    });
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const im = ref.current;
    if (!im) return;
    matrices.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
  }, [matrices, geometry]);
  return <instancedMesh ref={ref} args={[geometry, material, matrices.length]} frustumCulled={false} />;
}

// Tall yellow flowers, instanced + wind-swayed and spread across the field.
function WindFlowers() {
  const { scene } = useGLTF("/models/flowers-tall.glb");
  const onBeforeCompile = useWind(0.462, 0.6); // gentler sway than grass
  const { geometry, material } = useMemo(() => {
    const b = bakedMesh(scene);
    const mat = (b.material as THREE.MeshStandardMaterial).clone();
    mat.onBeforeCompile = onBeforeCompile;
    mat.customProgramCacheKey = () => "flowers-tall-wind";
    return { geometry: b.geometry, material: mat };
  }, [scene, onBeforeCompile]);
  const matrices = useMemo(() => {
    const places = organicScatter(44, 149, 2.4, 0.09); // more of them, well spread
    return places.map((p) => {
      const s = 1.5 * (0.8 + p.s * 0.5);
      return trsTilt(p.x, 0, p.z, p.tx * 0.12, p.r, p.tz * 0.12, s, s, s);
    });
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const im = ref.current;
    if (!im) return;
    matrices.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
  }, [matrices, geometry]);
  return <instancedMesh ref={ref} args={[geometry, material, matrices.length]} frustumCulled={false} />;
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

// One instanced draw call per prop model (single-mesh Kenney models), placed with the
// same organic scatter + lean as before — same look, ~10 draw calls instead of ~110.
function InstancedProp({ url, scale, count, seed, clearance, cast, tilt }: ModelCfg) {
  const matrices = useMemo(() => {
    const places = organicScatter(count, seed, clearance, 0.07);
    return places.map((p) => {
      const s = scale * (0.85 + p.s * 0.3);
      return trsTilt(p.x, 0, p.z, p.tx * tilt, p.r, p.tz * tilt, s, s, s);
    });
  }, [scale, count, seed, clearance, tilt]);
  return <InstancedModel url={url} matrices={matrices} castShadow={cast} receiveShadow />;
}

function Props() {
  return (
    <>
      {[...TREE_MODELS, ...PROP_MODELS].map((m) => (
        <InstancedProp key={m.url} {...m} />
      ))}
    </>
  );
}

// --- node markers ----------------------------------------------------------------------
const STATE_STYLE: Record<NodeState, { gem: string; ring: string; pedestal: string; emissive: number; badge: string }> = {
  completed: { gem: "#57b85a", ring: "#bfe9c0", pedestal: "#3f9a47", emissive: 0.16, badge: "#3f9a47" },
  current: { gem: "#5b8def", ring: "#ffe08a", pedestal: "#3f6fcf", emissive: 0.22, badge: "#2f5fd0" },
  locked: { gem: "#9aa3ad", ring: "#7c8694", pedestal: "#5a6470", emissive: 0, badge: "#7c8694" },
};

function NodeIcon({ state }: { state: NodeState }) {
  if (state === "completed") return <Check className="size-4" strokeWidth={3} aria-hidden />;
  if (state === "current") return <Play className="size-4 translate-x-px" fill="currentColor" strokeWidth={0} aria-hidden />;
  return <Lock className="size-[0.85rem]" aria-hidden />;
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
  const tex = useEmojiTexture(node.emoji, node.state === "locked");
  const st = STATE_STYLE[node.state];
  const isCurrent = node.state === "current";
  const locked = node.state === "locked";
  const [inView, setInView] = useState(false);
  const inViewRef = useRef(false);
  useFrame((s) => {
    if (spr.current) {
      spr.current.position.y = 0.2 + (isCurrent && !reduced ? Math.sin(s.clock.elapsedTime * 1.6) * 0.18 : 0);
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
    if (!locked) onSelect?.(node);
  };
  return (
    <group position={[pos.x, 1.5, pos.z]}>
      <mesh position={[0, -1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.36, 24]} />
        <meshToonMaterial color={st.pedestal} gradientMap={TOON_GRAD} />
      </mesh>
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.07, 8, 32]} />
        <meshToonMaterial color={st.ring} gradientMap={TOON_GRAD} emissive={st.ring} emissiveIntensity={locked ? 0 : 0.3} />
      </mesh>
      {/* lesson emoji billboard (replaces the gem); dimmed when locked */}
      <sprite ref={spr} scale={[1.8, 1.8, 1.8]}>
        <spriteMaterial map={tex} transparent depthWrite={false} opacity={locked ? 0.55 : 1} fog={false} />
      </sprite>
      {/* accessible DOM button overlay: tap / keyboard target + colour-blind-safe state badge.
          The lesson name shows above on hover / focus. */}
      <Html center position={[0, 1.35, 0]} distanceFactor={11} zIndexRange={[30, 0]}>
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            aria-label={`${node.label} — ${node.state}`}
            disabled={locked}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={focus}
            onClick={select}
            style={{ background: st.badge }}
            className="peer pointer-events-auto flex size-8 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white/85 transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110 focus-visible:ring-4 focus-visible:ring-white disabled:cursor-default disabled:opacity-95"
          >
            <NodeIcon state={node.state} />
          </button>
          <span
            className={`pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-card/95 px-2 py-0.5 text-[11px] font-semibold text-card-foreground shadow-md ring-1 ring-border backdrop-blur transition-opacity duration-150 ${
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
  return (
    <>
      {nodes.map((node, i) => (
        <Node key={node.id} node={node} u={(i + 0.5) / nodes.length} progress={progress} onSelect={onSelect} reduced={reduced} />
      ))}
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
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
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

const GC = { text: "#23202a", muted: "#5b6470", primary: "#3a5bd6", green: "#1f8f4e", red: "#cf4338" };
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      out.push(line);
      line = w;
    } else line = t;
  }
  if (line) out.push(line);
  return out;
}
function makeCardTexture(card: GameCardT, phase: "play" | "reveal", correct: boolean, points: number, L: GameLabels) {
  const W = 540, H = 720;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  const font = (s: number, w = 700) => `${w} ${s}px ui-rounded, "Segoe UI", system-ui, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  roundRect(ctx, 0, 0, W, H, 46);
  ctx.fill();
  const sheen = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  sheen.addColorStop(0, "rgba(255,255,255,0.38)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  roundRect(ctx, 0, 0, W, H, 46);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 2.5;
  roundRect(ctx, 1.5, 1.5, W - 3, H - 3, 45);
  ctx.stroke();
  const pad = 46;
  if (phase === "play") {
    ctx.font = font(22, 700);
    const tag = card.context_tag.toUpperCase();
    const tw = ctx.measureText(tag).width;
    ctx.fillStyle = "rgba(58,91,214,0.16)";
    roundRect(ctx, pad, pad, tw + 36, 42, 21);
    ctx.fill();
    ctx.fillStyle = GC.primary;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tag, pad + 18, pad + 22);
    ctx.fillStyle = GC.text;
    ctx.textAlign = "center";
    let fs = 42;
    ctx.font = font(fs);
    let lines = wrapText(ctx, card.scenario_text, W - pad * 2);
    while (lines.length * fs * 1.25 > H - 280 && fs > 22) {
      fs -= 2;
      ctx.font = font(fs);
      lines = wrapText(ctx, card.scenario_text, W - pad * 2);
    }
    const lh = fs * 1.25;
    let y = H / 2 - ((lines.length - 1) * lh) / 2;
    for (const ln of lines) {
      ctx.fillText(ln, W / 2, y);
      y += lh;
    }
    ctx.font = font(22, 700);
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = GC.red;
    ctx.textAlign = "left";
    ctx.fillText("◀ " + L.left, pad, H - pad);
    ctx.fillStyle = GC.green;
    ctx.textAlign = "right";
    ctx.fillText(L.right + " ▶", W - pad, H - pad);
  } else if (card.is_safeguarding) {
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = GC.primary;
    ctx.font = font(26, 800);
    ctx.fillText("You matter", pad, pad);
    ctx.fillStyle = GC.text;
    ctx.font = font(38, 800);
    let y = pad + 56;
    for (const ln of wrapText(ctx, "This one is serious — and it's not your fault.", W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 48;
    }
    ctx.fillStyle = GC.muted;
    ctx.font = font(24, 500);
    y += 16;
    for (const ln of wrapText(ctx, card.feedback_short, W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 34;
    }
  } else {
    const col = correct ? GC.green : GC.red;
    ctx.fillStyle = col;
    roundRect(ctx, pad, pad - 4, W - pad * 2, 6, 3);
    ctx.fill();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = col;
    ctx.font = font(26, 800);
    ctx.fillText(correct ? "SPOT ON" : "LOOK AGAIN", pad, pad + 14);
    if (correct && points > 0) {
      ctx.textAlign = "right";
      ctx.fillText("+" + points, W - pad, pad + 14);
      ctx.textAlign = "left";
    }
    ctx.fillStyle = col;
    ctx.font = font(46, 800);
    let y = pad + 70;
    for (const ln of wrapText(ctx, card.sign, W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 52;
    }
    ctx.fillStyle = GC.text;
    ctx.font = font(25, 500);
    y += 14;
    for (const ln of wrapText(ctx, card.feedback_short, W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 36;
    }
    if (card.is_disguised) {
      ctx.fillStyle = GC.primary;
      ctx.font = font(20, 700);
      ctx.fillText("Disguised — nice catch", pad, H - pad);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const _fwd = new THREE.Vector3();
const _rt = new THREE.Vector3();
function GameCard({ view }: { view: GameView }) {
  const camera = useThree((s) => s.camera);
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeCardTexture(view.card, view.phase, view.correct, view.points, view.labels), [view.card, view.phase, view.correct, view.points, view.labels]);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    camera.getWorldDirection(_fwd);
    g.position.copy(camera.position).addScaledVector(_fwd, 8);
    g.position.y += 0.1 + Math.sin(performance.now() * 0.0011) * 0.05;
    if (view.exiting) {
      _rt.setFromMatrixColumn(camera.matrixWorld, 0); // camera right
      g.position.addScaledVector(_rt, (view.exiting === "green" ? 1 : -1) * 3);
    }
    g.lookAt(camera.position);
    if (view.exiting) g.rotateZ((view.exiting === "green" ? -1 : 1) * 0.35);
  });
  return (
    <group ref={group} renderOrder={10}>
      <RoundedBox args={[3.0, 4.0, 0.35]} radius={0.16} smoothness={6}>
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.1}
          roughness={0.16}
          ior={1.25}
          chromaticAberration={0.05}
          anisotropicBlur={0.5}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.08}
          samples={6}
          resolution={256}
          backside
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.19]}>
        <planeGeometry args={[2.9, 3.9]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

export function PathScene({ nodes = DEFAULT_NODES, onSelectNode, gameView }: { nodes?: SceneNode[]; onSelectNode?: (n: SceneNode) => void; gameView?: GameView | null }) {
  // focus the active level on load: the current lesson, else the first playable one
  const startU = useMemo(() => {
    let i = nodes.findIndex((n) => n.state === "current");
    if (i < 0) i = nodes.findIndex((n) => n.href && n.state !== "locked");
    return i >= 0 ? (i + 0.5) / nodes.length : 0;
  }, [nodes]);
  const progress = useRef(startU);
  const [reduced, setReduced] = useState(false);
  // freeze the on-rails camera while a card game is being played
  const playingRef = useRef(false);
  playingRef.current = !!gameView;

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    const onWheel = (e: WheelEvent) => {
      if (playingRef.current) return;
      progress.current = clamp01(progress.current - e.deltaY * 0.0008);
    };
    let lastY: number | null = null;
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      if (playingRef.current) return;
      dragging = true;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (dragging && lastY != null) {
        progress.current = clamp01(progress.current + (e.clientY - lastY) * 0.0012);
        lastY = e.clientY;
      }
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
      dpr={[1, 1.8]}
      gl={{ antialias: false, toneMappingExposure: 1.05 }}
      camera={{ position: [0, 6, 30], fov: 48 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#eaf6ff"]} />
      <fog attach="fog" args={["#dbeefb", 40, 235]} />
      <SkyDome />
      <Clouds />
      <FollowCam progress={progress} />
      <SunLight progress={progress} />
      <hemisphereLight args={["#dcefff", "#8fc06a", 0.5]} />
      <ambientLight intensity={0.4} />
      <Ground />
      <Suspense fallback={null}>
        <Mountains />
        <PlankPath />
        <GrassTufts />
        <WindFlowers />
        <Props />
      </Suspense>
      <Nodes nodes={nodes} progress={progress} onSelect={onSelectNode} reduced={reduced} />
      {gameView && <GameCard view={gameView} />}
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
