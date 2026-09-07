"use client";

import { SceneCanvas } from "@/components/three/scene-canvas";
import { HardwareSystem } from "@/components/three/hardware-system";

export function HeroCanvas({
  explode,
  hovered,
  onHover,
}: {
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <SceneCanvas camera={{ position: [2.85, 1.6, 3.3], fov: 38 }}>
      <HardwareSystem
        explode={explode}
        hovered={hovered}
        onHover={onHover}
        animateCamera
        positionOffset={[0.55, 0, 0]}
      />
    </SceneCanvas>
  );
}
