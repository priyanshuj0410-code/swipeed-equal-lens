"use client";

import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";

// Phase 1 — a spline-based winding stone path with evenly spaced hovering nodes.
// Procedural/low-poly; the spline makes the path easy to lengthen or reshape, and
// nodes are laid out along it programmatically (states/data come in later phases).

const CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 11),
    new THREE.Vector3(3.2, 0, 2),
    new THREE.Vector3(-3.2, 0, -10),
    new THREE.Vector3(3.2, 0, -22),
    new THREE.Vector3(-3.2, 0, -34),
    new THREE.Vector3(3, 0, -48),
    new THREE.Vector3(-2.6, 0, -62),
    new THREE.Vector3(2.6, 0, -78),
    new THREE.Vector3(0, 0, -94),
  ],
  false,
  "catmullrom",
  0.5
);

const NODE_COUNT = 7;

// Build a flat ribbon (the path surface) that follows the spline along the ground.
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
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color="#8ec96a" />
    </mesh>
  );
}

function StonePath() {
  const geo = useMemo(() => buildRibbon(CURVE, 2.1, 220), []);
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
      {/* fake contact shadow on the path */}
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

// Frame the winding path well on both wide (desktop) and narrow (phone) screens.
function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const portrait = size.width / size.height < 1;
    if (portrait) {
      camera.position.set(0, 10, 26);
      camera.lookAt(0, 0, -24);
      (camera as THREE.PerspectiveCamera).fov = 56;
    } else {
      camera.position.set(0, 5.5, 15);
      camera.lookAt(0, 0, -18);
      (camera as THREE.PerspectiveCamera).fov = 48;
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export function PathScene() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const timers = [setTimeout(fire, 80), setTimeout(fire, 300)];
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 5.5, 15], fov: 48 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#bfe2fb"]} />
      <CameraRig />
      <ambientLight intensity={0.75} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} />
      <Ground />
      <StonePath />
      <Nodes />
    </Canvas>
  );
}
