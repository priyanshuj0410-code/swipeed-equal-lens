"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";

// Phase 2 (richer art pass) — layered gradient sky + drifting clouds, rolling textured
// terrain with grass lining the path, tiered + blobby tree variety, faceted gem markers.
// Still a spline path with an on-rails follow camera.

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

// Terrain height: flat in the path corridor, rolling hills as you move away from it.
const CORRIDOR = 7;
function groundHeight(x: number, z: number) {
  const d = Math.sqrt(distToPathSq(x, z));
  if (d <= CORRIDOR) return 0;
  const t = Math.min((d - CORRIDOR) / 16, 1);
  const n = 0.5 * Math.sin(x * 0.06) * Math.cos(z * 0.052) + 0.5 * Math.sin((x + z) * 0.028);
  return n * t * 5.5;
}

type Placement = { x: number; z: number; y: number; s: number; r: number };

// Scatter props across the grassland, kept clear of the path and dropped onto the terrain.
function scatter(count: number, seed: number, clearance: number, minS: number, maxS: number): Placement[] {
  const rng = mulberry32(seed);
  const out: Placement[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 60) {
    tries++;
    const x = (rng() * 2 - 1) * 58;
    const z = 24 - rng() * 230;
    if (distToPathSq(x, z) < clearance * clearance) continue;
    out.push({ x, z, y: groundHeight(x, z), s: minS + rng() * (maxS - minS), r: rng() * Math.PI * 2 });
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
          bottom: { value: new THREE.Color("#e6f2fb") },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
          void main(){ float h = normalize(vP).y * 0.5 + 0.5; vec3 c = mix(bottom, top, smoothstep(0.0, 0.78, h)); gl_FragColor = vec4(c, 1.0); }`,
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
    for (let c = 0; c < 12; c++) {
      const ang = rng() * Math.PI * 2;
      const rad = 110 + rng() * 150;
      const cx = Math.cos(ang) * rad;
      const cz = -90 + Math.sin(ang) * rad;
      const cy = 52 + rng() * 34;
      const blobs = 3 + Math.floor(rng() * 3);
      const base = 6 + rng() * 7;
      for (let b = 0; b < blobs; b++) {
        arr.push({
          x: cx + (rng() - 0.5) * base * 2.2,
          y: cy + (rng() - 0.5) * 3,
          z: cz + (rng() - 0.5) * base * 1.4,
          s: base * (0.6 + rng() * 0.6),
        });
      }
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.006;
  });
  return (
    <group ref={ref}>
      <Instances limit={puffs.length}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={0.92} fog={false} />
        {puffs.map((p, i) => (
          <Instance key={i} position={[p.x, p.y, p.z]} scale={[p.s, p.s * 0.62, p.s]} />
        ))}
      </Instances>
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
      const disp = groundHeight(px, -py); // plane y maps to world -z after the -90° rotation
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
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial vertexColors flatShading />
    </mesh>
  );
}

function StonePath() {
  const geo = useMemo(() => buildRibbon(CURVE, 2.1, 320), []);
  return (
    <mesh geometry={geo} position={[0, 0.05, 0]}>
      <meshStandardMaterial color="#d9cdb0" side={THREE.DoubleSide} roughness={0.95} />
    </mesh>
  );
}

function Grass() {
  const blades = useMemo(() => {
    const rng = mulberry32(555);
    const a: { x: number; z: number; s: number; hf: number; r: number }[] = [];
    let tries = 0;
    while (a.length < 2400 && tries < 22000) {
      tries++;
      const t = rng();
      const p = CURVE.getPointAt(t);
      const tan = CURVE.getTangentAt(t);
      tan.y = 0;
      tan.normalize();
      const side = rng() < 0.5 ? -1 : 1;
      const off = 2.3 + rng() * 4.4;
      const x = p.x + -tan.z * off * side + (rng() - 0.5) * 1.3;
      const z = p.z + tan.x * off * side + (rng() - 0.5) * 1.3;
      if (groundHeight(x, z) !== 0) continue; // flat corridor only — stays planted
      a.push({ x, z, s: 0.7 + rng() * 0.7, hf: 1 + rng() * 0.9, r: rng() * Math.PI });
    }
    return a;
  }, []);
  const even = useMemo(() => blades.filter((_, i) => i % 2 === 0), [blades]);
  const odd = useMemo(() => blades.filter((_, i) => i % 2 === 1), [blades]);
  const Blades = ({ data, color }: { data: typeof blades; color: string }) => (
    <Instances limit={data.length}>
      <coneGeometry args={[0.05, 0.55, 4]} />
      <meshStandardMaterial color={color} flatShading />
      {data.map((b, i) => (
        <Instance key={i} position={[b.x, 0.275 * b.s * b.hf, b.z]} scale={[b.s, b.s * b.hf, b.s]} rotation={[0, b.r, 0]} />
      ))}
    </Instances>
  );
  return (
    <group>
      <Blades data={even} color="#6fb84a" />
      <Blades data={odd} color="#86cb5f" />
    </group>
  );
}

function Trees() {
  const trees = useMemo(() => scatter(26, 1337, 7, 0.8, 1.7), []);
  const pines = useMemo(() => trees.filter((_, i) => i % 2 === 0), [trees]);
  const blobs = useMemo(() => trees.filter((_, i) => i % 2 === 1), [trees]);
  return (
    <group>
      {/* --- pines: trunk + three tapering tiers --- */}
      <Instances limit={pines.length}>
        <cylinderGeometry args={[0.14, 0.22, 1.0, 6]} />
        <meshStandardMaterial color="#80603c" />
        {pines.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 0.5 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>
      <Instances limit={pines.length}>
        <coneGeometry args={[1.3, 1.5, 7]} />
        <meshStandardMaterial color="#4f9a3e" flatShading />
        {pines.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 1.65 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>
      <Instances limit={pines.length}>
        <coneGeometry args={[1.0, 1.4, 7]} />
        <meshStandardMaterial color="#5aa847" flatShading />
        {pines.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 2.6 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>
      <Instances limit={pines.length}>
        <coneGeometry args={[0.7, 1.2, 7]} />
        <meshStandardMaterial color="#67b552" flatShading />
        {pines.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 3.5 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>

      {/* --- blob trees: trunk + clustered flat-shaded foliage --- */}
      <Instances limit={blobs.length}>
        <cylinderGeometry args={[0.16, 0.24, 1.2, 6]} />
        <meshStandardMaterial color="#7a5a3a" />
        {blobs.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 0.6 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>
      <Instances limit={blobs.length}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color="#6fb04a" flatShading />
        {blobs.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 2.15 * t.s, t.z]} scale={[t.s, t.s * 0.92, t.s]} rotation={[t.r, t.r, 0]} />
        ))}
      </Instances>
      <Instances limit={blobs.length}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#84c25c" flatShading />
        {blobs.map((t, i) => (
          <Instance key={i} position={[t.x + 0.55 * t.s, t.y + 2.7 * t.s, t.z + 0.35 * t.s]} scale={t.s} rotation={[t.r * 1.3, t.r, 0]} />
        ))}
      </Instances>
    </group>
  );
}

function Rocks() {
  const rocks = useMemo(() => scatter(24, 4242, 4, 0.5, 1.3), []);
  return (
    <Instances limit={rocks.length}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#a7a399" roughness={1} flatShading />
      {rocks.map((r, i) => (
        <Instance key={i} position={[r.x, r.y + 0.3 * r.s, r.z]} scale={[r.s, r.s * 0.7, r.s]} rotation={[r.r, r.r * 1.3, 0]} />
      ))}
    </Instances>
  );
}

function Tufts() {
  const tufts = useMemo(() => scatter(30, 909, 3, 0.7, 1.5), []);
  return (
    <Instances limit={tufts.length}>
      <coneGeometry args={[0.5, 0.85, 5]} />
      <meshStandardMaterial color="#7cbf57" flatShading />
      {tufts.map((t, i) => (
        <Instance key={i} position={[t.x, t.y + 0.42 * t.s, t.z]} scale={[t.s, t.s * 1.2, t.s]} rotation={[0, t.r, 0]} />
      ))}
    </Instances>
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
      {/* pedestal coin */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.36, 24]} />
        <meshStandardMaterial color="#3f6fcf" roughness={0.6} />
      </mesh>
      {/* halo ring around the base */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.07, 8, 32]} />
        <meshStandardMaterial color="#cfe0ff" roughness={0.5} />
      </mesh>
      {/* faceted gem marker */}
      <mesh ref={ball}>
        <icosahedronGeometry args={[0.82, 1]} />
        <meshStandardMaterial color="#5b8def" roughness={0.32} flatShading />
      </mesh>
      {/* contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0]}>
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.16} />
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
      dpr={[1, 2]}
      camera={{ position: [0, 6, 30], fov: 48 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#e6f2fb"]} />
      <fog attach="fog" args={["#dfeefb", 24, 175]} />
      <SkyDome />
      <Clouds />
      <FollowCam progress={progress} />
      <hemisphereLight args={["#dcefff", "#83ad5e", 0.55]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[12, 16, 8]} intensity={1.05} color="#fff3da" />
      <Ground />
      <StonePath />
      <Grass />
      <Tufts />
      <Rocks />
      <Trees />
      <Nodes reduced={reduced} />
    </Canvas>
  );
}
