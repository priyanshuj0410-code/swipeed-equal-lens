"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Instances, Instance, useGLTF, Clone } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
  HueSaturation,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

// Cel-shaded open-world pass (Arceus / BotW flavour). Stylized CC0 GLB nature models
// (Quaternius MegaKit) re-shaded to toon, on a terrain with a sun + following shadows,
// GPU wind grass, atmospheric mountain layers, and a cinematic post chain.

// --- shared toon ramp: a few hard luminance steps -> crisp cel bands ---
const TOON_GRAD = (() => {
  const steps = [95, 150, 200, 245];
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

const CORRIDOR = 7;
function groundHeight(x: number, z: number) {
  const d = Math.sqrt(distToPathSq(x, z));
  if (d <= CORRIDOR) return 0;
  const t = Math.min((d - CORRIDOR) / 16, 1);
  const n = 0.5 * Math.sin(x * 0.06) * Math.cos(z * 0.052) + 0.5 * Math.sin((x + z) * 0.028);
  return n * t * 5.5;
}

type Placement = { x: number; z: number; y: number; s: number; r: number };

function meadowScatter(count: number, seed: number, clearance: number): Placement[] {
  const rng = mulberry32(seed);
  const out: Placement[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 30) {
    tries++;
    const x = (rng() * 2 - 1) * 54;
    const z = 24 - rng() * 232;
    if (distToPathSq(x, z) < clearance * clearance) continue;
    out.push({ x, z, y: groundHeight(x, z), s: rng(), r: rng() * Math.PI * 2 });
  }
  return out;
}

function buildRibbon(curve: THREE.CatmullRomCurve3, halfWidth: number, segs: number) {
  const up = new THREE.Vector3(0, 1, 0);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    tan.y = 0;
    tan.normalize();
    const n = new THREE.Vector3().crossVectors(up, tan).normalize();
    pos.push(p.x + n.x * halfWidth, 0, p.z + n.z * halfWidth);
    pos.push(p.x - n.x * halfWidth, 0, p.z - n.z * halfWidth);
  }
  for (let i = 0; i < segs; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color("#a6d4ff") },
          bottom: { value: new THREE.Color("#eef6fc") },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
          void main(){ float h = normalize(vP).y * 0.5 + 0.5; vec3 c = mix(bottom, top, smoothstep(0.0, 0.8, h)); gl_FragColor = vec4(c, 1.0); }`,
      }),
    []
  );
  return (
    <mesh material={mat} position={[0, 0, -90]}>
      <sphereGeometry args={[500, 32, 16]} />
    </mesh>
  );
}

function Clouds() {
  const ref = useRef<THREE.Group>(null);
  const puffs = useMemo(() => {
    const rng = mulberry32(77);
    const arr: { x: number; y: number; z: number; s: number }[] = [];
    for (let c = 0; c < 16; c++) {
      const ang = rng() * Math.PI * 2;
      const rad = 100 + rng() * 160;
      const cx = Math.cos(ang) * rad;
      const cz = -90 + Math.sin(ang) * rad;
      const cy = 46 + rng() * 40;
      const blobs = 4 + Math.floor(rng() * 4);
      const base = 7 + rng() * 8;
      for (let b = 0; b < blobs; b++) {
        arr.push({
          x: cx + (rng() - 0.5) * base * 2.4,
          y: cy + (rng() - 0.5) * 4,
          z: cz + (rng() - 0.5) * base * 1.5,
          s: base * (0.6 + rng() * 0.7),
        });
      }
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.005;
  });
  return (
    <group ref={ref}>
      <Instances limit={puffs.length}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={0.92} fog={false} />
        {puffs.map((p, i) => (
          <Instance key={i} position={[p.x, p.y, p.z]} scale={[p.s, p.s * 0.6, p.s]} />
        ))}
      </Instances>
    </group>
  );
}

function Mountains() {
  const { near, far } = useMemo(() => {
    const rng = mulberry32(2024);
    const make = (count: number, rad: number, radJ: number, hMin: number, hMax: number, base: number) => {
      const a: { x: number; z: number; y: number; w: number; h: number; r: number }[] = [];
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.4;
        const r = rad + (rng() - 0.5) * radJ;
        const h = hMin + rng() * (hMax - hMin);
        a.push({ x: Math.cos(ang) * r, z: -90 + Math.sin(ang) * r, y: base, h, w: h * (0.55 + rng() * 0.3), r: rng() * Math.PI });
      }
      return a;
    };
    return { near: make(16, 122, 20, 26, 48, -3), far: make(20, 162, 26, 36, 64, -5) };
  }, []);
  const Range = ({ d, color }: { d: typeof near; color: string }) => (
    <Instances limit={d.length}>
      <coneGeometry args={[1, 1, 5]} />
      <meshToonMaterial color={color} gradientMap={TOON_GRAD} />
      {d.map((m, i) => (
        <Instance key={i} position={[m.x, m.y + m.h / 2, m.z]} scale={[m.w, m.h, m.w]} rotation={[0, m.r, 0]} />
      ))}
    </Instances>
  );
  return (
    <group>
      <Range d={far} color="#aac6d2" />
      <Range d={near} color="#82ab8d" />
    </group>
  );
}

function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(600, 600, 140, 140);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const base = new THREE.Color("#7cbf57");
    const light = new THREE.Color("#9fd47a");
    const dark = new THREE.Color("#5d9c45");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const disp = groundHeight(px, -py);
      pos.setZ(i, disp);
      const n2 = Math.sin(px * 0.12) * Math.sin(py * 0.11) * 0.5 + 0.5;
      tmp.copy(base).lerp(light, n2 * 0.55);
      if (disp < 0) tmp.lerp(dark, Math.min(-disp / 5, 1) * 0.4);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshToonMaterial vertexColors gradientMap={TOON_GRAD} />
    </mesh>
  );
}

function StonePath() {
  const geo = useMemo(() => buildRibbon(CURVE, 2.1, 320), []);
  return (
    <mesh geometry={geo} position={[0, 0.05, 0]} receiveShadow>
      <meshToonMaterial color="#d9cdb0" gradientMap={TOON_GRAD} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Wind injected into the toon vertex shader so blades sway GPU-side; phase from instance pos.
function useWind() {
  const u = useRef({ uTime: { value: 0 } });
  useFrame((s) => {
    u.current.uTime.value = s.clock.elapsedTime;
  });
  return useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = u.current.uTime;
    shader.vertexShader =
      "uniform float uTime;\n" +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 wp = instanceMatrix[3].xyz;
          float ph = wp.x * 0.28 + wp.z * 0.28;
          float w = sin(uTime * 1.3 + ph) + 0.35 * sin(uTime * 2.7 + ph * 1.7);
          float bend = clamp((position.y + 0.275) / 0.55, 0.0, 1.0);
          transformed.x += w * 0.16 * bend;
          transformed.z += w * 0.09 * bend;
        #endif`
      );
  }, []);
}

function Grass() {
  const onBeforeCompile = useWind();
  const blades = useMemo(() => meadowScatter(6500, 321, 2.5), []);
  const even = useMemo(() => blades.filter((_, i) => i % 2 === 0), [blades]);
  const odd = useMemo(() => blades.filter((_, i) => i % 2 === 1), [blades]);
  const Blades = ({ data, color }: { data: Placement[]; color: string }) => (
    <Instances limit={data.length}>
      <coneGeometry args={[0.05, 0.55, 4]} />
      <meshToonMaterial color={color} gradientMap={TOON_GRAD} onBeforeCompile={onBeforeCompile} />
      {data.map((b, i) => {
        const sc = 0.7 + b.s * 0.6;
        const hf = 1 + b.s * 1.1;
        return (
          <Instance key={i} position={[b.x, b.y + 0.275 * sc * hf, b.z]} scale={[sc, sc * hf, sc]} rotation={[0, b.r, 0]} />
        );
      })}
    </Instances>
  );
  return (
    <group>
      <Blades data={even} color="#6fb84a" />
      <Blades data={odd} color="#86cb5f" />
    </group>
  );
}

// --- stylized CC0 models (Quaternius "Stylized Nature MegaKit", CC0) -------------------
type ModelCfg = { url: string; scale: number; minY: number; count: number; seed: number; clearance: number; cast: boolean };

const TREE_MODELS: ModelCfg[] = [
  { url: "/models/tree.glb", scale: 3.0, minY: 0, count: 14, seed: 11, clearance: 7.5, cast: true },
  { url: "/models/tree-pine.glb", scale: 3.2, minY: 0, count: 10, seed: 23, clearance: 7.5, cast: true },
  { url: "/models/tree-pine-small.glb", scale: 2.6, minY: 0, count: 8, seed: 37, clearance: 7, cast: true },
];
const PROP_MODELS: ModelCfg[] = [
  { url: "/models/rocks.glb", scale: 3.4, minY: 0, count: 12, seed: 101, clearance: 4, cast: true },
  { url: "/models/stones.glb", scale: 3.8, minY: 0, count: 12, seed: 113, clearance: 2.4, cast: false },
  { url: "/models/mushrooms.glb", scale: 3.0, minY: 0, count: 12, seed: 127, clearance: 3, cast: false },
  { url: "/models/plant.glb", scale: 3.2, minY: 0, count: 18, seed: 131, clearance: 2.6, cast: false },
  { url: "/models/flowers.glb", scale: 3.2, minY: 0, count: 24, seed: 163, clearance: 2.6, cast: false },
  { url: "/models/flowers-tall.glb", scale: 2.6, minY: 0, count: 16, seed: 149, clearance: 2.6, cast: false },
  { url: "/models/sign.glb", scale: 2.8, minY: 0, count: 4, seed: 179, clearance: 3, cast: true },
  { url: "/models/flag.glb", scale: 3.0, minY: 0, count: 5, seed: 191, clearance: 3.5, cast: true },
];
const ALL_MODELS = [...TREE_MODELS, ...PROP_MODELS];
ALL_MODELS.forEach((m) => useGLTF.preload(m.url));

// Kenney models share one flat palette texture; keep their authored materials, just enable shadows.
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

function Prop({ url, scale, minY, count, seed, clearance, cast }: ModelCfg) {
  const scene = usePreparedScene(url, cast);
  const places = useMemo(() => meadowScatter(count, seed, clearance), [count, seed, clearance]);
  return (
    <>
      {places.map((p, i) => {
        const s = scale * (0.82 + p.s * 0.4);
        return <Clone key={i} object={scene} position={[p.x, p.y - minY * s, p.z]} rotation={[0, p.r, 0]} scale={s} />;
      })}
    </>
  );
}

function Vegetation() {
  return (
    <>
      {ALL_MODELS.map((m) => (
        <Prop key={m.url} {...m} />
      ))}
    </>
  );
}

function Node({ position, phase, reduced }: { position: [number, number, number]; phase: number; reduced: boolean }) {
  const ball = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ball.current) return;
    ball.current.position.y = reduced ? 0 : Math.sin(s.clock.elapsedTime * 1.4 + phase) * 0.16;
  });
  return (
    <group position={position}>
      <mesh position={[0, -1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.36, 24]} />
        <meshToonMaterial color="#3f6fcf" gradientMap={TOON_GRAD} />
      </mesh>
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.07, 8, 32]} />
        <meshToonMaterial color="#cfe0ff" gradientMap={TOON_GRAD} emissive="#9cc0ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={ball} castShadow>
        <icosahedronGeometry args={[0.82, 1]} />
        <meshToonMaterial color="#5b8def" gradientMap={TOON_GRAD} emissive="#2f5fd0" emissiveIntensity={0.18} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0]}>
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.14} />
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
        <Node key={i} position={[p.x, 1.35, p.z]} phase={i * 0.7} reduced={reduced} />
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
      <orthographicCamera attach="shadow-camera" args={[-32, 32, 32, -32, 1, 95]} />
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
      <color attach="background" args={["#e6f2fb"]} />
      <fog attach="fog" args={["#dfeefb", 30, 200]} />
      <SkyDome />
      <Clouds />
      <Mountains />
      <FollowCam progress={progress} />
      <SunLight progress={progress} />
      <hemisphereLight args={["#dcefff", "#83ad5e", 0.5]} />
      <ambientLight intensity={0.35} />
      <Ground />
      <StonePath />
      <Grass />
      <Suspense fallback={null}>
        <Vegetation />
      </Suspense>
      <Nodes reduced={reduced} />
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.32} mipmapBlur radius={0.5} />
        <BrightnessContrast brightness={0.0} contrast={0.05} />
        <HueSaturation saturation={0.08} />
        <Vignette offset={0.34} darkness={0.4} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
