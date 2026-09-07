"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { ACCENT, partMaterials } from "./hardware-parts";

const CORE_COLS = 4;
const CORE_ROWS = 2;

/**
 * A stylized CPU die used only for the Learn/CPU scroll narrative.
 * `stage` walks through cores -> threads -> cache -> clock -> workload -> performance.
 */
export function CpuDie({ stage }: { stage: number }) {
  const group = React.useRef<THREE.Group>(null);
  const cores = React.useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    if (group.current) {
      const targetX = -state.pointer.y * 0.15;
      const targetY = state.pointer.x * 0.25;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, delta * 2);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.3 + targetY, delta * 2);
    }

    const pulsing = stage >= 3;
    const activeCount = stage >= 5 ? 8 : stage >= 4 ? 5 : stage >= 3 ? 8 : 0;
    const t = state.clock.getElapsedTime();

    cores.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const isActive = i < activeCount;
      let target = isActive ? 0.9 : 0.08;
      if (pulsing && isActive) {
        target = 0.6 + Math.sin(t * (3 + i * 0.4)) * 0.35;
      }
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target, delta * 5);
    });
  });

  const coreCells = React.useMemo(() => {
    const cells: { x: number; z: number; index: number }[] = [];
    let index = 0;
    for (let r = 0; r < CORE_ROWS; r++) {
      for (let c = 0; c < CORE_COLS; c++) {
        cells.push({
          x: (c - (CORE_COLS - 1) / 2) * 0.32,
          z: (r - (CORE_ROWS - 1) / 2) * 0.32,
          index: index++,
        });
      }
    }
    return cells;
  }, []);

  return (
    <group ref={group} rotation={[0.15, 0.3, 0]}>
      {/* Package base */}
      <RoundedBox args={[1.9, 0.08, 1.9]} radius={0.04} smoothness={2} position={[0, -0.1, 0]}>
        <meshStandardMaterial {...partMaterials.chassisDark} />
      </RoundedBox>

      {/* Cache ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 4]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={stage >= 2 ? 0.5 : 0.05}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Die substrate */}
      <RoundedBox args={[1.5, 0.06, 1.5]} radius={0.03} smoothness={2}>
        <meshStandardMaterial {...partMaterials.metal} />
      </RoundedBox>

      {coreCells.map((cell) => (
        <group key={cell.index} position={[cell.x, 0.035, cell.z]}>
          <mesh
            ref={(m) => {
              if (m) cores.current[cell.index] = m;
            }}
          >
            <boxGeometry args={[0.26, 0.02, 0.26]} />
            <meshStandardMaterial
              color="#2a2d33"
              emissive={ACCENT}
              emissiveIntensity={0.05}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
          {stage >= 1 && (
            <>
              <mesh position={[-0.06, 0.015, 0]}>
                <boxGeometry args={[0.09, 0.008, 0.2]} />
                <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} transparent opacity={0.7} />
              </mesh>
              <mesh position={[0.06, 0.015, 0]}>
                <boxGeometry args={[0.09, 0.008, 0.2]} />
                <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} transparent opacity={0.7} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
