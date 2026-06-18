"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";

// Phase 0 — a flat green grassland, a framed camera, and simple sun + ambient light.
// Built procedurally/low-poly so real .glb props can drop in later without rework.

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#8ec96a" />
    </mesh>
  );
}

export function PathScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const setSize = useRef<((w: number, h: number) => void) | null>(null);

  // Drive the renderer size from the wrapper so it reliably fills the viewport
  // (R3F's auto-measure can miss the initial size in the production build).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const apply = () => setSize.current?.(el.clientWidth, el.clientHeight);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 7, 11], fov: 45 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={(state) => {
          setSize.current = (w, h) => state.setSize(w, h);
          const el = wrap.current;
          if (el) state.setSize(el.clientWidth, el.clientHeight);
        }}
      >
        <color attach="background" args={["#d6ecfb"]} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.15}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Ground />
      </Canvas>
    </div>
  );
}
