"use client";

import * as React from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ACCENT,
  CaseFrame,
  Cooler,
  Cpu,
  GpuPart,
  Motherboard,
  Part,
  PsuPart,
  RamStick,
  StoragePart,
} from "./hardware-parts";
import { getCategory } from "@/lib/data/categories";

interface LayoutEntry {
  id: string;
  rest: [number, number, number];
  exploded: [number, number, number];
  render: (hovered: boolean, dimmed: boolean) => React.ReactNode;
  labelOffset: [number, number, number];
}

const layout: LayoutEntry[] = [
  {
    id: "cpu",
    rest: [0.41, 0.045, -0.41],
    exploded: [0.41, 0.72, -0.41],
    render: (h, d) => <Cpu hovered={h} dimmed={d} />,
    labelOffset: [0, 0.26, 0],
  },
  {
    id: "cooler",
    rest: [0.41, 0.08, -0.41],
    exploded: [0.41, 1.34, -0.41],
    render: (h, d) => <Cooler hovered={h} dimmed={d} />,
    labelOffset: [0, 0.52, 0],
  },
  {
    id: "ram",
    rest: [0.87, 0.045, -0.46],
    exploded: [0.98, 0.88, -0.7],
    render: (h, d) => <RamStick hovered={h} dimmed={d} />,
    labelOffset: [0, 0.38, 0],
  },
  {
    id: "ram-2",
    rest: [1.02, 0.045, -0.46],
    exploded: [1.42, 1.02, -0.78],
    render: (h, d) => <RamStick hovered={h} dimmed={d} />,
    labelOffset: [0, 0.38, 0],
  },
  {
    id: "gpu",
    rest: [0, 0.18, 0.5],
    exploded: [0, 1.02, 1.15],
    render: (h, d) => <GpuPart hovered={h} dimmed={d} />,
    labelOffset: [0, 0.33, 0],
  },
  {
    id: "storage",
    rest: [-0.78, 0.028, 0.46],
    exploded: [-1.08, 0.56, 0.72],
    render: (h, d) => <StoragePart hovered={h} dimmed={d} />,
    labelOffset: [0, 0.19, 0],
  },
  {
    id: "psu",
    rest: [0, -0.72, 0],
    exploded: [0, -1.38, 0],
    render: (h, d) => <PsuPart hovered={h} dimmed={d} />,
    labelOffset: [0, 0.4, 0],
  },
];

export interface HardwareSystemProps {
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
  showLabels?: boolean;
  showTooltip?: boolean;
  compact?: boolean;
  animateCamera?: boolean;
  /** World-space offset applied to the whole rig — used to bias composition (e.g. right-aligned in a hero split layout). */
  positionOffset?: [number, number, number];
  /** Base resting rotation of the rig, before pointer parallax. */
  baseRotation?: [number, number, number];
}

function CameraRig({ explode }: { explode: number }) {
  const { camera } = useThree();
  const near = React.useMemo(() => new THREE.Vector3(2.85, 1.6, 3.3), []);
  const far = React.useMemo(() => new THREE.Vector3(3.55, 1.15, 4.15), []);

  useFrame((_, delta) => {
    const target = near.clone().lerp(far, explode);
    camera.position.lerp(target, Math.min(1, delta * 1.6));
    camera.lookAt(0, 0.02, 0);
  });

  return null;
}

function idToCategory(id: string) {
  return id === "ram-2" ? "ram" : id;
}

export function HardwareSystem({
  explode,
  hovered,
  onHover,
  showLabels = true,
  showTooltip = true,
  animateCamera = false,
  positionOffset = [0, 0, 0],
  baseRotation = [0.15, -0.34, 0],
}: HardwareSystemProps) {
  const rig = React.useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rig.current) return;
    const [bx, by] = baseRotation;
    const targetX = bx - state.pointer.y * 0.09;
    const targetY = by + state.pointer.x * 0.13;
    rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, targetX, Math.min(1, delta * 2));
    rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, targetY, Math.min(1, delta * 2));
  });

  const hoveredCategory = hovered ? getCategory(idToCategory(hovered)) : null;
  const hoveredEntry = layout.find((l) => l.id === hovered);

  return (
    <group position={positionOffset}>
      {animateCamera && <CameraRig explode={explode} />}
      <group ref={rig} rotation={baseRotation}>
        <CaseFrame visible opacity={0.42 - explode * 0.32} />

        <Part id="motherboard" rest={[0, 0, 0]} exploded={[0, 0, 0]} explode={explode} hovered={hovered} onHover={onHover}>
          <Motherboard hovered={hovered === "motherboard"} dimmed={hovered !== null && hovered !== "motherboard"} />
        </Part>

        {layout.map((entry) => (
          <ConnectionLine key={`line-${entry.id}`} entry={entry} explode={explode} />
        ))}

        {layout.map((entry) => (
          <Part
            key={entry.id}
            id={entry.id}
            rest={entry.rest}
            exploded={entry.exploded}
            explode={explode}
            hovered={hovered}
            onHover={onHover}
          >
            {entry.render(hovered === entry.id, hovered !== null && hovered !== entry.id)}
            {showLabels && (
              <Html position={entry.labelOffset} center distanceFactor={8} occlude={false} zIndexRange={[10, 0]}>
                <div
                  className="pointer-events-none whitespace-nowrap rounded border border-border-strong bg-canvas-raised px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-text shadow-[0_4px_16px_-4px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-opacity duration-500"
                  style={{ opacity: explode > 0.22 && hovered !== entry.id ? Math.min(1, (explode - 0.22) * 2.4) : 0 }}
                >
                  {getCategory(idToCategory(entry.id))?.name}
                </div>
              </Html>
            )}
          </Part>
        ))}

        {showTooltip && hoveredCategory && hoveredEntry && (
          <Html
            position={[
              hoveredEntry.rest[0] * (1 - explode) + hoveredEntry.exploded[0] * explode,
              hoveredEntry.rest[1] * (1 - explode) + hoveredEntry.exploded[1] * explode + hoveredEntry.labelOffset[1] + 0.3,
              hoveredEntry.rest[2] * (1 - explode) + hoveredEntry.exploded[2] * explode,
            ]}
            center
            occlude={false}
            zIndexRange={[20, 0]}
          >
            <div className="w-56 animate-fade-in rounded-lg border border-border-strong bg-canvas-raised/95 p-4 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">{hoveredCategory.name}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-text-muted">{hoveredCategory.tagline}</p>
              <Link
                href={`/learn/${hoveredCategory.slug}`}
                className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-medium text-accent-strong transition-colors hover:text-accent"
              >
                Learn about {hoveredCategory.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function ConnectionLine({ entry, explode }: { entry: LayoutEntry; explode: number }) {
  const geometryRef = React.useRef<THREE.BufferGeometry>(null);
  const materialRef = React.useRef<THREE.LineBasicMaterial>(null);
  const currentEnd = React.useRef(new THREE.Vector3(...entry.rest));
  const start = React.useMemo(
    () => new THREE.Vector3(entry.rest[0] * 0.15, 0.03, entry.rest[2] * 0.15),
    [entry],
  );
  const restEnd = React.useMemo(() => new THREE.Vector3(...entry.rest), [entry]);
  const explodedEnd = React.useMemo(() => new THREE.Vector3(...entry.exploded), [entry]);

  useFrame((_, delta) => {
    const target = restEnd.clone().lerp(explodedEnd, explode);
    currentEnd.current.lerp(target, Math.min(1, delta * 4));

    const geo = geometryRef.current;
    if (geo) {
      const pos = geo.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, start.x, start.y, start.z);
      pos.setXYZ(1, currentEnd.current.x, currentEnd.current.y, currentEnd.current.z);
      pos.needsUpdate = true;
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.1 + explode * 0.35;
    }
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(6), 3]} />
      </bufferGeometry>
      <lineBasicMaterial ref={materialRef} color={ACCENT} transparent opacity={0.1} />
    </line>
  );
}
