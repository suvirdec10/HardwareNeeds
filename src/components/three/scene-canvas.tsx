"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { ACCENT } from "./hardware-parts";

export function SceneCanvas({
  children,
  camera = { position: [3.6, 2.1, 4.2], fov: 32 },
}: {
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov: number };
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={camera}
      className="!touch-auto"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#f5f6ff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.12} color={ACCENT} />
      <pointLight position={[0, -3, 2]} intensity={0.15} color={ACCENT} />
      <fog attach="fog" args={["#08090b", 8, 14]} />
      {children}
    </Canvas>
  );
}
