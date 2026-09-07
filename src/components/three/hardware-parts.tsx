"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Shared visual language for every hardware part rendered in the 3D system:
 * dark brushed-metal surfaces, thin accent-colored trace lines, no chrome,
 * no neon. Every part is a small self-contained group so hero/learn/hardware
 * pages can compose the same primitives at different scales.
 */

export const ACCENT = "#4c8dff";
export const ACCENT_STRONG = "#6ba1ff";

export const partMaterials = {
  chassis: { color: "#1a1c21", metalness: 0.4, roughness: 0.6 },
  chassisDark: { color: "#101216", metalness: 0.3, roughness: 0.7 },
  pcb: { color: "#0d1f16", metalness: 0.1, roughness: 0.8 },
  metal: { color: "#8a8f98", metalness: 0.65, roughness: 0.45 },
  metalDark: { color: "#4c4f57", metalness: 0.6, roughness: 0.5 },
};

export interface PartProps {
  id: string;
  rest: [number, number, number];
  exploded: [number, number, number];
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
  rotation?: [number, number, number];
  children: React.ReactNode;
}

/** Lerps a part between its assembled and exploded position, and reacts to hover. */
export function Part({ id, rest, exploded, explode, hovered, onHover, rotation, children }: PartProps) {
  const group = React.useRef<THREE.Group>(null);
  const targetScale = React.useRef(1);
  const restV = React.useMemo(() => new THREE.Vector3(...rest), [rest]);
  const explodedV = React.useMemo(() => new THREE.Vector3(...exploded), [exploded]);
  const isHovered = hovered === id;
  const isDimmed = hovered !== null && !isHovered;

  useFrame((_, delta) => {
    if (!group.current) return;
    const pos = restV.clone().lerp(explodedV, explode);
    group.current.position.lerp(pos, Math.min(1, delta * 4));
    targetScale.current = isHovered ? 1.06 : 1;
    const s = THREE.MathUtils.lerp(group.current.scale.x, targetScale.current, Math.min(1, delta * 8));
    group.current.scale.setScalar(s);
  });

  return (
    <group
      ref={group}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
        document.body.style.cursor = "auto";
      }}
    >
      <group scale={isDimmed ? 0.985 : 1}>{children}</group>
    </group>
  );
}

export function DimMaterial({
  color,
  metalness,
  roughness,
  hovered,
  emissive,
  emissiveIntensity = 0.5,
  dimmed = false,
}: {
  color: string;
  metalness: number;
  roughness: number;
  hovered?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
  dimmed?: boolean;
}) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      emissive={hovered ? ACCENT : emissive ?? "#000000"}
      emissiveIntensity={hovered ? 0.22 : emissive ? emissiveIntensity : 0}
      transparent
      opacity={dimmed ? 0.55 : 1}
    />
  );
}

export function Motherboard({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  return (
    <group>
      <RoundedBox args={[2.7, 0.05, 2.3]} radius={0.03} smoothness={2}>
        <DimMaterial {...partMaterials.pcb} hovered={hovered} dimmed={dimmed} />
      </RoundedBox>
      {/* Trace lines */}
      {[-0.9, -0.5, -0.1, 0.3, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.027, 0.6]}>
          <boxGeometry args={[0.02, 0.002, 1.1]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={hovered ? 1.1 : 0.18}
            transparent
            opacity={dimmed ? 0.2 : 0.45}
          />
        </mesh>
      ))}
      {/* Chipset block */}
      <RoundedBox args={[0.5, 0.03, 0.5]} radius={0.02} position={[-0.6, 0.045, -0.6]}>
        <DimMaterial {...partMaterials.metalDark} hovered={hovered} dimmed={dimmed} />
      </RoundedBox>
    </group>
  );
}

export function Cpu({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  return (
    <group>
      <RoundedBox args={[0.4, 0.05, 0.4]} radius={0.015} smoothness={2}>
        <DimMaterial {...partMaterials.metal} hovered={hovered} dimmed={dimmed} />
      </RoundedBox>
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.12, 4]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={hovered ? 1.1 : 0.16} transparent opacity={dimmed ? 0.25 : 0.6} />
      </mesh>
    </group>
  );
}

export function Cooler({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  const fan = React.useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!fan.current) return;
    fan.current.rotation.y += delta * 0.6;
  });
  return (
    <group>
      {/* Fin stack */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.05 + i * 0.045, 0]}>
          <boxGeometry args={[0.46, 0.018, 0.46]} />
          <DimMaterial {...partMaterials.metal} hovered={hovered} dimmed={dimmed} />
        </mesh>
      ))}
      {/* Fan */}
      <group ref={fan} position={[0, 0.42, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.03, 24]} />
          <DimMaterial {...partMaterials.chassisDark} hovered={hovered} dimmed={dimmed} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]} position={[0, 0.02, 0]}>
            <boxGeometry args={[0.18, 0.01, 0.05]} />
            <meshStandardMaterial color="#3a3d44" metalness={0.5} roughness={0.5} transparent opacity={dimmed ? 0.5 : 1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function GpuPart({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  return (
    <group>
      <RoundedBox args={[1.5, 0.32, 0.28]} radius={0.03} smoothness={2}>
        <DimMaterial {...partMaterials.chassis} hovered={hovered} dimmed={dimmed} />
      </RoundedBox>
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.02, 20]} />
          <DimMaterial {...partMaterials.chassisDark} hovered={hovered} dimmed={dimmed} />
        </mesh>
      ))}
      <mesh position={[-0.55, -0.17, 0.16]}>
        <boxGeometry args={[0.28, 0.012, 0.03]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={hovered ? 1.1 : 0.14} transparent opacity={dimmed ? 0.2 : 0.55} />
      </mesh>
    </group>
  );
}

export function RamStick({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  return (
    <group>
      <RoundedBox args={[0.12, 0.55, 0.02]} radius={0.01} smoothness={1}>
        <DimMaterial {...partMaterials.chassisDark} hovered={hovered} dimmed={dimmed} />
      </RoundedBox>
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.12, 0.025, 0.018]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={hovered ? 1.1 : 0.16} transparent opacity={dimmed ? 0.25 : 0.65} />
      </mesh>
    </group>
  );
}

export function StoragePart({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  return (
    <RoundedBox args={[0.5, 0.02, 0.18]} radius={0.008} smoothness={1}>
      <DimMaterial {...partMaterials.chassisDark} hovered={hovered} dimmed={dimmed} />
    </RoundedBox>
  );
}

export function PsuPart({ hovered, dimmed }: { hovered: boolean; dimmed: boolean }) {
  return (
    <group>
      <RoundedBox args={[1.3, 0.55, 0.9]} radius={0.03} smoothness={2}>
        <DimMaterial {...partMaterials.chassis} hovered={hovered} dimmed={dimmed} />
      </RoundedBox>
      <mesh position={[0, 0, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
        <DimMaterial {...partMaterials.chassisDark} hovered={hovered} dimmed={dimmed} />
      </mesh>
    </group>
  );
}

export function CaseFrame({ visible, opacity }: { visible: boolean; opacity: number }) {
  const points = React.useMemo(() => {
    const geo = new THREE.BoxGeometry(3.4, 3.1, 3);
    return new THREE.EdgesGeometry(geo);
  }, []);
  if (!visible) return null;
  return (
    <lineSegments geometry={points} position={[0, -0.1, 0]}>
      <lineBasicMaterial color="#4a4f58" transparent opacity={opacity} />
    </lineSegments>
  );
}
