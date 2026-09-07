"use client";

import { SceneCanvas } from "@/components/three/scene-canvas";
import { CpuDie } from "@/components/three/cpu-die";

export function CpuCanvas({ stage }: { stage: number }) {
  return (
    <SceneCanvas camera={{ position: [2.4, 1.8, 2.6], fov: 30 }}>
      <CpuDie stage={stage} />
    </SceneCanvas>
  );
}
