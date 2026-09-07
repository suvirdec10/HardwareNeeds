"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { ACCENT } from "./hardware-parts";

export function SceneCanvas({
  children,
  camera = { position: [3.6, 2.1, 4.2], fov: 32 },
  showGround = true,
}: {
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  showGround?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMappingExposure: 1.35,
      }}
      camera={camera}
      className="!touch-auto"
    >
      {/* Soft sky/ground wash — the base of the "product photography" look. */}
      <hemisphereLight args={["#c3d6ff", "#0a0b0e", 0.65]} />
      {/* Key light — primary form-defining light, bright and slightly warm-neutral */}
      <directionalLight position={[4.2, 6, 4]} intensity={2.4} color="#ffffff" />
      {/* Front fill — keeps the camera-facing side readable instead of silhouetted */}
      <directionalLight position={[0, 1.2, 6]} intensity={0.9} color="#eef2ff" />
      {/* Cool fill from the opposite side — softens shadow falloff */}
      <directionalLight position={[-4, 1.6, -2.5]} intensity={0.45} color="#8fb0ff" />
      {/* Rim light — separates the object from the dark background */}
      <directionalLight position={[-2.5, 3.5, -5]} intensity={0.85} color={ACCENT} />
      {/* Ambient — lifts the darkest shadows well off pure black */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, -2.5, 2.5]} intensity={0.15} color={ACCENT} />

      <fog attach="fog" args={["#08090b", 9, 15]} />

      {children}

      {showGround && (
        <ContactShadows
          position={[0, -1.52, 0]}
          opacity={0.5}
          scale={8}
          blur={2.6}
          far={1.9}
          resolution={512}
          color="#000000"
        />
      )}
    </Canvas>
  );
}
