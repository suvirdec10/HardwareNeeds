"use client";

import * as React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { getCategory } from "@/lib/data/categories";
import type { CompatibilityKind } from "@/lib/data/types";

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box;
  return <Cmp className={className} strokeWidth={1.75} />;
}

const kindColor: Record<CompatibilityKind, string> = {
  critical: "var(--color-danger)",
  physical: "var(--color-warning)",
  performance: "var(--color-accent)",
};

const kindLabel: Record<CompatibilityKind, string> = {
  critical: "Must match",
  physical: "Must fit",
  performance: "Should match",
};

/** Percent-based coordinates within a 100 x 78 viewBox. */
const nodes = {
  cooler: { id: "cooler", x: 50, y: 7 },
  storage: { id: "storage", x: 85, y: 11 },
  cpu: { id: "cpu", x: 20, y: 31 },
  motherboard: { id: "motherboard", x: 50, y: 33 },
  ram: { id: "ram", x: 80, y: 31 },
  gpu: { id: "gpu", x: 14, y: 57 },
  case: { id: "case", x: 50, y: 59 },
  psu: { id: "psu", x: 86, y: 57 },
} as const;

const links: { from: keyof typeof nodes; to: keyof typeof nodes; kind: CompatibilityKind; curve?: "left" | "under" }[] = [
  { from: "cpu", to: "motherboard", kind: "critical" },
  { from: "motherboard", to: "ram", kind: "critical" },
  { from: "cpu", to: "cooler", kind: "critical" },
  { from: "storage", to: "motherboard", kind: "critical" },
  { from: "motherboard", to: "case", kind: "physical" },
  { from: "cooler", to: "case", kind: "physical", curve: "left" },
  { from: "gpu", to: "case", kind: "physical" },
  { from: "psu", to: "case", kind: "physical" },
  { from: "gpu", to: "psu", kind: "critical", curve: "under" },
];

function pathFor(link: (typeof links)[number]) {
  const a = nodes[link.from];
  const b = nodes[link.to];
  if (link.curve === "left") {
    return `M ${a.x} ${a.y} Q 14 ${(a.y + b.y) / 2} ${b.x} ${b.y}`;
  }
  if (link.curve === "under") {
    return `M ${a.x} ${a.y} Q 50 76 ${b.x} ${b.y}`;
  }
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

export function SystemDiagram() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
      <div className="relative mx-auto aspect-[100/78] w-full max-w-3xl">
        <svg
          viewBox="0 0 100 78"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          {links.map((link, i) => (
            <path
              key={`${link.from}-${link.to}`}
              d={pathFor(link)}
              fill="none"
              stroke={kindColor[link.kind]}
              strokeWidth={0.35}
              strokeLinecap="round"
              opacity={0.55}
              className={visible ? "animate-draw-line" : undefined}
              style={{
                strokeDasharray: 140,
                strokeDashoffset: 140,
                animationDelay: visible ? `${120 + i * 90}ms` : undefined,
              }}
            />
          ))}
        </svg>

        {Object.values(nodes).map((node) => {
          const category = getCategory(node.id);
          if (!category) return null;
          return (
            <Link
              key={node.id}
              href={`/hardware/${category.slug}`}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${node.x}%`, top: `${(node.y / 78) * 100}%` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-canvas text-text-muted shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)] transition-colors group-hover:border-accent-border group-hover:text-accent-strong sm:h-11 sm:w-11">
                <Icon name={category.icon} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </span>
              <span className="whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.06em] text-text-faint transition-colors group-hover:text-text sm:text-[10.5px]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border-faint pt-6">
        {(Object.keys(kindLabel) as CompatibilityKind[]).map((kind) => (
          <div key={kind} className="flex items-center gap-2">
            <span className="h-[3px] w-5 rounded-full" style={{ backgroundColor: kindColor[kind] }} />
            <span className="text-[12.5px] text-text-muted">{kindLabel[kind]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
