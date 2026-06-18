"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";

// Phase 0 — a flat green grassland with a horizon, a framed camera, and simple light.
// Built procedurally/low-poly so real .glb props can drop in later without rework.

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color="#8ec96a" />
    </mesh>
  );
}

// Aim the camera toward the horizon so grass fills the lower frame and sky shows above.
function CameraRig() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 0, -14);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
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
      camera={{ position: [0, 5, 14], fov: 50 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#bfe2fb"]} />
      <CameraRig />
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
