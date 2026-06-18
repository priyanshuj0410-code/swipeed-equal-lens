"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";

// Phase 1 — a long, spline-based winding stone path with evenly spaced hovering nodes,
// and an on-rails follow camera you scroll/drag to travel up and down the path.

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
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[600, 600]} />
      <meshStandardMaterial color="#8ec96a" />
    </mesh>
  );
}

function StonePath() {
  const geo = useMemo(() => buildRibbon(CURVE, 2.1, 320), []);
  return (
    <mesh geometry={geo} position={[0, 0.04, 0]}>
      <meshStandardMaterial color="#d9cdb0" side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  );
}

function Node({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color="#5b8def" roughness={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.24, 0]}>
        <circleGeometry args={[0.7, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Nodes() {
  const points = useMemo(
    () => Array.from({ length: NODE_COUNT }, (_, i) => CURVE.getPointAt((i + 0.5) / NODE_COUNT)),
    []
  );
  return (
    <>
      {points.map((p, i) => (
        <Node key={i} position={[p.x, 1.35, p.z]} />
      ))}
    </>
  );
}

// On-rails follow camera: travels along the spline based on `progress` (0..1),
// sitting behind+above the path point and looking ahead. No free-fly.
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
    const desired = new THREE.Vector3(p.x - tan.x * back, height, p.z - tan.z * back);
    camera.position.lerp(desired, 0.12);
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

  // Scroll (desktop) / drag (touch) to travel along the path.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      progress.current = clamp01(progress.current + e.deltaY * 0.0008);
    };
    let lastY: number | null = null;
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (dragging && lastY != null) {
        // direct manipulation: the world follows the drag (down → world down, up → world up)
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
      camera={{ position: [0, 6, 30], fov: 48 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#bfe2fb"]} />
      <FollowCam progress={progress} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} />
      <Ground />
      <StonePath />
      <Nodes />
    </Canvas>
  );
}
