"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Clone } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";

// A calm, lightweight grassland scene used as a backdrop behind glass-card screens.

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bakedMesh(scene: THREE.Object3D) {
  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.Material | null = null;
  scene.updateMatrixWorld(true);
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && !geometry) {
      geometry = m.geometry.clone();
      geometry.applyMatrix4(m.matrixWorld);
      material = m.material as THREE.Material;
    }
  });
  return { geometry: geometry!, material: material! };
}

function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { top: { value: new THREE.Color("#79bdf7") }, bottom: { value: new THREE.Color("#eaf6ff") } },
        vertexShader: `varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
          void main(){ float h=normalize(vP).y*0.5+0.5; gl_FragColor=vec4(mix(bottom,top,smoothstep(0.0,0.82,h)),1.0); }`,
      }),
    []
  );
  return (
    <mesh material={mat}>
      <sphereGeometry args={[260, 32, 16]} />
    </mesh>
  );
}

function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(500, 500, 80, 80);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const base = new THREE.Color("#3da679");
    const light = new THREE.Color("#59c387");
    const dark = new THREE.Color("#20896b");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const t = (Math.sin(x * 0.12) * Math.cos(y * 0.1) + Math.sin((x + y) * 0.06)) * 0.5 + 0.5;
      tmp.copy(base);
      if (t > 0.5) tmp.lerp(light, (t - 0.5) * 1.1);
      else tmp.lerp(dark, (0.5 - t) * 0.9);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial vertexColors />
    </mesh>
  );
}

const TREES: { m: "tree" | "pine"; x: number; z: number; s: number }[] = [
  { m: "tree", x: -16, z: -18, s: 5 },
  { m: "pine", x: -9, z: -28, s: 5.6 },
  { m: "tree", x: 13, z: -22, s: 5 },
  { m: "pine", x: 20, z: -16, s: 5 },
  { m: "tree", x: -23, z: -32, s: 6 },
  { m: "pine", x: 26, z: -30, s: 5.4 },
  { m: "tree", x: 6, z: -40, s: 5.2 },
  { m: "pine", x: -30, z: -42, s: 6 },
  { m: "tree", x: 34, z: -44, s: 5.5 },
];
function Trees() {
  const tree = useGLTF("/models/tree.glb");
  const pine = useGLTF("/models/tree-pine.glb");
  return (
    <>
      {TREES.map((p, i) => (
        <Clone key={i} object={(p.m === "tree" ? tree : pine).scene} position={[p.x, 0, p.z]} scale={p.s} rotation={[0, i * 1.3, 0]} />
      ))}
    </>
  );
}

function GrassTufts() {
  const { scene } = useGLTF("/models/grass.glb");
  const { geometry, material } = useMemo(() => bakedMesh(scene), [scene]);
  const matrices = useMemo(() => {
    const rng = mulberry32(7);
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const arr: THREE.Matrix4[] = [];
    for (let i = 0; i < 1800; i++) {
      const x = (rng() * 2 - 1) * 48;
      const z = 8 - rng() * 56;
      const s = 1.6 + rng() * 1.4;
      e.set(0, rng() * Math.PI, 0);
      q.setFromEuler(e);
      arr.push(new THREE.Matrix4().compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(s, s * (0.9 + rng() * 0.5), s)));
    }
    return arr;
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

// blocky grass hills along the horizon (fog-faded) so the distance isn't empty
function Hills() {
  const block = useGLTF("/models/block-grass-large-tall.glb");
  const { geometry, material } = useMemo(() => bakedMesh(block.scene), [block.scene]);
  const matrices = useMemo(() => {
    const rng = mulberry32(2024);
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const arr: THREE.Matrix4[] = [];
    for (let i = 0; i < 11; i++) {
      const cx = -80 + i * 16 + (rng() - 0.5) * 9;
      const cz = -78 - rng() * 46;
      const R = 9 + rng() * 8;
      const H = 11 + rng() * 16;
      for (let gx = -R; gx <= R; gx += 4) {
        for (let gz = -R; gz <= R; gz += 4) {
          const d = Math.hypot(gx, gz) / R;
          if (d > 1) continue;
          const f = Math.cos(d * Math.PI * 0.5);
          const h = Math.max(3, H * f * f + (rng() - 0.5) * H * 0.28);
          const w = ((4 * 1.55) / 2.08) * (0.9 + rng() * 0.3);
          e.set(0, rng() * Math.PI * 2, 0);
          q.setFromEuler(e);
          arr.push(new THREE.Matrix4().compose(new THREE.Vector3(cx + gx, -4, cz + gz), q, new THREE.Vector3(w, (h + 4) / 2, w)));
        }
      }
    }
    return arr;
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

useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/tree-pine.glb");
useGLTF.preload("/models/grass.glb");
useGLTF.preload("/models/block-grass-large-tall.glb");

function DriftCam() {
  const camera = useThree((s) => s.camera);
  useFrame((s) => {
    const t = s.clock.elapsedTime * 0.045;
    camera.position.set(Math.sin(t) * 5, 3.6, 12 + Math.cos(t) * 2);
    camera.lookAt(0, 2.4, -4);
  });
  return null;
}

export function GrasslandBackdrop() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const t = [setTimeout(fire, 80), setTimeout(fire, 300)];
    return () => {
      cancelAnimationFrame(raf);
      t.forEach(clearTimeout);
    };
  }, []);
  return (
    <Canvas dpr={[1, 1.7]} camera={{ position: [0, 3.6, 12], fov: 44 }} style={{ width: "100%", height: "100%" }}>
      <color attach="background" args={["#dbeefb"]} />
      <fog attach="fog" args={["#cfe6f7", 22, 132]} />
      <SkyDome />
      <hemisphereLight args={["#dcefff", "#8fc06a", 0.65]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 12, 8]} intensity={1.05} color="#fff3da" />
      <Ground />
      <Suspense fallback={null}>
        <Hills />
        <Trees />
        <GrassTufts />
      </Suspense>
      <DriftCam />
    </Canvas>
  );
}
