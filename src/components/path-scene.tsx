"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";

// Phase 2 — atmosphere: fog into the sky, soft warm light, instanced trees/rocks/tufts,
// and a gentle node bob. Still a spline path with an on-rails follow camera.

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

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Placement = { x: number; z: number; s: number; r: number };

// Scatter props across the grassland, keeping them clear of the path.
function scatter(count: number, seed: number, clearance: number, minS: number, maxS: number): Placement[] {
  const rng = mulberry32(seed);
  const pathPts = Array.from({ length: 70 }, (_, i) => CURVE.getPointAt(i / 69));
  const out: Placement[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 60) {
    tries++;
    const x = (rng() * 2 - 1) * 58;
    const z = 24 - rng() * 230;
    let nearSq = Infinity;
    for (const p of pathPts) {
      const dx = p.x - x;
      const dz = p.z - z;
      const d = dx * dx + dz * dz;
      if (d < nearSq) nearSq = d;
    }
    if (nearSq < clearance * clearance) continue;
    out.push({ x, z, s: minS + rng() * (maxS - minS), r: rng() * Math.PI * 2 });
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

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[600, 600]} />
      <meshStandardMaterial color="#8ec96a" />
    </mesh>
  );
}

function StonePath() {
  const geo = useMemo(() => buildRibbon(CURVE, 2.1, 320), []);
  return (
    <mesh geometry={geo} position={[0, 0.04, 0]}>
      <meshStandardMaterial color="#d9cdb0" side={THREE.DoubleSide} roughness={0.95} />
    </mesh>
  );
}

function Trees() {
  const trees = useMemo(() => scatter(20, 1337, 7, 0.85, 1.7), []);
  return (
    <group>
      <Instances limit={trees.length}>
        <cylinderGeometry args={[0.16, 0.26, 1.3, 6]} />
        <meshStandardMaterial color="#7a5a3a" />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.x, 0.65 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>
      <Instances limit={trees.length}>
        <coneGeometry args={[1.05, 2.4, 7]} />
        <meshStandardMaterial color="#6fae4a" flatShading />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.x, 2.5 * t.s, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
        ))}
      </Instances>
    </group>
  );
}

function Rocks() {
  const rocks = useMemo(() => scatter(22, 4242, 4, 0.5, 1.3), []);
  return (
    <Instances limit={rocks.length}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#a7a399" roughness={1} flatShading />
      {rocks.map((r, i) => (
        <Instance key={i} position={[r.x, 0.32 * r.s, r.z]} scale={[r.s, r.s * 0.7, r.s]} rotation={[r.r, r.r * 1.3, 0]} />
      ))}
    </Instances>
  );
}

function Tufts() {
  const tufts = useMemo(() => scatter(36, 909, 3, 0.7, 1.5), []);
  return (
    <Instances limit={tufts.length}>
      <coneGeometry args={[0.5, 0.85, 5]} />
      <meshStandardMaterial color="#7cbf57" flatShading />
      {tufts.map((t, i) => (
        <Instance key={i} position={[t.x, 0.42 * t.s, t.z]} scale={[t.s, t.s * 1.2, t.s]} rotation={[0, t.r, 0]} />
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
      <mesh ref={ball}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color="#5b8def" roughness={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.24, 0]}>
        <circleGeometry args={[0.7, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
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
      <color attach="background" args={["#cfe7f6"]} />
      <fog attach="fog" args={["#cfe7f6", 26, 150]} />
      <FollowCam progress={progress} />
      <hemisphereLight args={["#dcefff", "#83ad5e", 0.55]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[12, 16, 8]} intensity={1.0} color="#fff3da" />
      <Ground />
      <StonePath />
      <Tufts />
      <Rocks />
      <Trees />
      <Nodes reduced={reduced} />
    </Canvas>
  );
}
