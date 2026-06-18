"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";

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
  // R3F's auto-measure can miss the initial size in the production build; a couple of
  // resize nudges after mount make it measure the container and fill the viewport.
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
      camera={{ position: [0, 7, 11], fov: 45 }}
      style={{ width: "100%", height: "100%", display: "block" }}
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
  );
}
