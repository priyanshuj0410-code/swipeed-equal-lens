"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, Clone } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
  HueSaturation,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const NODE_COUNT = 9;
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
    const N = Math.max(2, Math.ceil(len / 0.9));
    const pts = CURVE.getSpacedPoints(N);
    const arr: THREE.Matrix4[] = [];
    for (let i = 0; i <= N; i++) {
      const p = pts[i];
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(N, i + 1)];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const ry = Math.atan2(dx, dz); // local +z -> path direction
      arr.push(trs(p.x, 0.06, p.z, ry, 3.6, 1, 1.05));
    }
    return arr;
  }, []);
  return <InstancedModel url="/models/platform.glb" matrices={matrices} receiveShadow />;
}

// --- grass tufts (Kenney) with GPU wind ------------------------------------------------
function useWind(maxY: number) {
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
            transformed.x += w * 0.12 * bend;
            transformed.z += w * 0.07 * bend;
          #endif`
        );
    },
    [maxY]
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
  { url: "/models/flowers-tall.glb", scale: 1.5, count: 12, seed: 149, clearance: 2.4, cast: false, tilt: 0.1 },
  { url: "/models/sign.glb", scale: 2.2, count: 4, seed: 179, clearance: 3, cast: true, tilt: 0 },
  { url: "/models/flag.glb", scale: 2.4, count: 5, seed: 191, clearance: 3.5, cast: true, tilt: 0 },
];
const PROP_URLS = [...TREE_MODELS, ...PROP_MODELS].map((m) => m.url);
const ENV_URLS = [
  "/models/block-grass-large-tall.glb",
  "/models/platform.glb",
  "/models/grass.glb",
  "/models/cloud.glb",
];
[...PROP_URLS, ...ENV_URLS].forEach((u) => useGLTF.preload(u));

function usePreparedScene(url: string, cast: boolean) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
    });
    return scene;
  }, [scene, cast]);
}

function Prop({ url, scale, count, seed, clearance, cast, tilt }: ModelCfg) {
  const scene = usePreparedScene(url, cast);
  const places = useMemo(() => organicScatter(count, seed, clearance, 0.07), [count, seed, clearance]);
  return (
    <>
      {places.map((p, i) => {
        const s = scale * (0.85 + p.s * 0.3);
        return (
          <Clone key={i} object={scene} position={[p.x, 0, p.z]} rotation={[p.tx * tilt, p.r, p.tz * tilt]} scale={s} />
        );
      })}
    </>
  );
}

function Props() {
  return (
    <>
      {[...TREE_MODELS, ...PROP_MODELS].map((m) => (
        <Prop key={m.url} {...m} />
      ))}
    </>
  );
}

// --- node markers ----------------------------------------------------------------------
function Node({ position, phase, reduced }: { position: [number, number, number]; phase: number; reduced: boolean }) {
  const ball = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ball.current) return;
    ball.current.position.y = reduced ? 0 : Math.sin(s.clock.elapsedTime * 1.4 + phase) * 0.16;
  });
  return (
    <group position={position}>
      <mesh position={[0, -1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.36, 24]} />
        <meshToonMaterial color="#3f6fcf" gradientMap={TOON_GRAD} />
      </mesh>
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.07, 8, 32]} />
        <meshToonMaterial color="#cfe0ff" gradientMap={TOON_GRAD} emissive="#9cc0ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={ball} castShadow>
        <icosahedronGeometry args={[0.82, 1]} />
        <meshToonMaterial color="#5b8def" gradientMap={TOON_GRAD} emissive="#2f5fd0" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function Nodes({ reduced }: { reduced: boolean }) {
  const points = useMemo(
    () => Array.from({ length: NODE_COUNT }, (_, i) => CURVE.getPointAt((i + 0.5) / NODE_COUNT)),
    []
  );
  return (
    <>
      {points.map((p, i) => (
        <Node key={i} position={[p.x, 1.5, p.z]} phase={i * 0.7} reduced={reduced} />
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

export function PathScene() {
  const progress = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    const onWheel = (e: WheelEvent) => {
      progress.current = clamp01(progress.current - e.deltaY * 0.0008);
    };
    let lastY: number | null = null;
    let dragging = false;
    const onDown = (e: PointerEvent) => {
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
      dpr={[1, 2]}
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
        <Props />
      </Suspense>
      <Nodes reduced={reduced} />
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.3} mipmapBlur radius={0.5} />
        <BrightnessContrast brightness={0.0} contrast={0.05} />
        <HueSaturation saturation={0.08} />
        <Vignette offset={0.34} darkness={0.4} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
