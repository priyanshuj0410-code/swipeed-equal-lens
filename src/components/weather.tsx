"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEASON_ORDER, SEASONS, seasonRT } from "@/lib/seasons";

// Particle-count multiplier by device/motion tier: 0 = off (reduced-motion), ~0.55 on
// phones/low-core, 1 on desktop. Computed once on mount.
function useParticleScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setScale(0);
      return;
    }
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setScale(coarse || lowCores ? 0.55 : 1);
  }, []);
  return scale;
}

const dtClamp = (dt: number) => Math.min(dt, 0.05);

// ---- rain (rainy chapter) -------------------------------------------------------------
function Rain({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const area = useMemo<[number, number, number]>(() => [52, 34, 52], []);
  const speed = 22;
  const slant = 3;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * area[0];
      a[i * 3 + 1] = Math.random() * area[1];
      a[i * 3 + 2] = (Math.random() - 0.5) * area[2];
    }
    return a;
  }, [count, area]);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2;
    c.height = 24;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 24);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,0.95)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 2, 24);
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    if (document.hidden) return;
    const im = ref.current;
    if (!im) return;
    const p = (im.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const d = dtClamp(dt);
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] -= speed * d;
      p[i * 3] += slant * d;
      if (p[i * 3 + 1] < 0) {
        p[i * 3 + 1] = area[1];
        p[i * 3] = (Math.random() - 0.5) * area[0];
        p[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      }
    }
    im.geometry.attributes.position.needsUpdate = true;
    im.position.x = state.camera.position.x;
    im.position.z = state.camera.position.z;
  });
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} color="#a9c3df" size={0.18} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

// ---- snow (winter chapter) ------------------------------------------------------------
function Snow({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const area = useMemo<[number, number, number]>(() => [52, 34, 52], []);
  const speed = 2.4;
  const drift = 0.8;
  const { positions, phase } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area[0];
      positions[i * 3 + 1] = Math.random() * area[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phase };
  }, [count, area]);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d")!;
    g.beginPath();
    g.arc(16, 16, 13, 0, Math.PI * 2);
    g.fillStyle = "#fff";
    g.fill();
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    if (document.hidden) return;
    const im = ref.current;
    if (!im) return;
    const p = (im.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const d = dtClamp(dt);
    for (let i = 0; i < count; i++) {
      phase[i] += d;
      p[i * 3 + 1] -= speed * d;
      p[i * 3] += Math.sin(phase[i]) * drift * d;
      if (p[i * 3 + 1] < 0) {
        p[i * 3 + 1] = area[1];
        p[i * 3] = (Math.random() - 0.5) * area[0];
        p[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      }
    }
    im.geometry.attributes.position.needsUpdate = true;
    im.position.x = state.camera.position.x;
    im.position.z = state.camera.position.z;
  });
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} color="#ffffff" size={0.13} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
    </points>
  );
}

// ---- falling leaves / blossom petals (autumn / spring) --------------------------------
function makeLeafTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(32, 32, 15, 26, 0, 0, Math.PI * 2); // simple leaf/petal shape
  g.fill();
  return new THREE.CanvasTexture(c);
}

type Leaf = {
  x: number; y: number; z: number; rx: number; ry: number; rz: number;
  spin: number; sway: number; phase: number; scale: number; ci: number;
};
function FallingLeaves({ count, colors, speed }: { count: number; colors: string[]; speed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const area = useMemo<[number, number, number]>(() => [48, 30, 48], []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tex = useMemo(() => makeLeafTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const leaves = useMemo<Leaf[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * area[0],
        y: Math.random() * area[1],
        z: (Math.random() - 0.5) * area[2],
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 2.5,
        sway: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        scale: 0.11 + Math.random() * 0.08,
        ci: Math.floor(Math.random() * colors.length),
      })),
    [count, colors, area]
  );
  useEffect(() => {
    const im = ref.current;
    if (!im) return;
    const col = new THREE.Color();
    leaves.forEach((d, i) => {
      col.set(colors[d.ci]);
      im.setColorAt(i, col);
    });
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
  }, [leaves, colors]);
  useFrame((state, dt) => {
    if (document.hidden) return;
    const im = ref.current;
    if (!im) return;
    const d = dtClamp(dt);
    leaves.forEach((lf, i) => {
      lf.y -= speed * d;
      lf.phase += d;
      lf.rz += lf.spin * d;
      lf.rx += lf.spin * 0.5 * d;
      if (lf.y < 0) {
        lf.y = area[1];
        lf.x = (Math.random() - 0.5) * area[0];
        lf.z = (Math.random() - 0.5) * area[2];
      }
      dummy.position.set(
        state.camera.position.x + lf.x + Math.sin(lf.phase) * lf.sway,
        lf.y,
        state.camera.position.z + lf.z + Math.cos(lf.phase * 0.8) * lf.sway
      );
      dummy.rotation.set(lf.rx, lf.ry, lf.rz);
      dummy.scale.setScalar(lf.scale);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={tex} color="#ffffff" side={THREE.DoubleSide} transparent alphaTest={0.4} roughness={1} />
    </instancedMesh>
  );
}

// ---- switcher: mounts only the active season's emitter (driven by seasonRT) -----------
export function Weather() {
  const scale = useParticleScale();
  const [weather, setWeather] = useState<string | null>(null);
  const lastRef = useRef<string | null>(null);
  useFrame(() => {
    const w = SEASONS[SEASON_ORDER[seasonRT.index] ?? "summer"].weather;
    if (w !== lastRef.current) {
      lastRef.current = w;
      setWeather(w);
    }
  });
  if (scale === 0 || !weather) return null;
  if (weather === "rain") return <Rain count={Math.round(2200 * scale)} />;
  if (weather === "snow") return <Snow count={Math.round(1900 * scale)} />;
  if (weather === "leaves") return <FallingLeaves count={Math.round(380 * scale)} colors={["#d98a3d", "#c2622d", "#b5792f", "#e0701f"]} speed={2.6} />;
  if (weather === "petals") return <FallingLeaves count={Math.round(460 * scale)} colors={["#FFB7C5", "#FFC7D4", "#FFD9E2"]} speed={1.8} />;
  return null;
}
