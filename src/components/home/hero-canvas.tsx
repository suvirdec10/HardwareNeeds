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
    <SceneCanvas>
      <HardwareSystem explode={explode} hovered={hovered} onHover={onHover} animateCamera />
    </SceneCanvas>
  );
}
