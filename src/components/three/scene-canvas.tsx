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
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={camera}
      className="!touch-auto"
    >
      {/* Key light — primary form-defining light, slightly warm-neutral */}
      <directionalLight position={[4.2, 6, 4]} intensity={1.3} color="#f7f8ff" />
      {/* Fill light — soft, cool, low intensity to keep shadows readable but not flat */}
      <directionalLight position={[-4, 1.6, -2.5]} intensity={0.22} color="#7fa8ff" />
      {/* Rim light — separates the object from the dark background */}
      <directionalLight position={[-2.5, 3.5, -5]} intensity={0.55} color={ACCENT} />
      {/* Ambient — very low, just lifts the darkest shadows off pure black */}
      <ambientLight intensity={0.22} />
      <pointLight position={[0, -2.5, 2.5]} intensity={0.12} color={ACCENT} />

      <fog attach="fog" args={["#08090b", 7.5, 13]} />

      {children}

      {showGround && (
        <ContactShadows
          position={[0, -1.52, 0]}
          opacity={0.55}
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
