import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertOctagon, Ruler, Gauge } from "lucide-react";
import { compatibilityLinks } from "@/lib/data/compatibility";
import { LinkRow } from "@/components/compatibility/link-row";
import { SystemDiagram } from "@/components/compatibility/system-diagram";
import { Eyebrow } from "@/components/ui/tag";

export const metadata: Metadata = {
  title: "Compatibility",
  description: "How hardware categories depend on each other, and why.",
};

const groups = [
  {
    kind: "critical" as const,
    icon: AlertOctagon,
    title: "Must match",
    description: "Hard requirements. Get these wrong and the parts won't work together at all.",
  },
  {
    kind: "physical" as const,
    icon: Ruler,
    title: "Must fit",
    description: "Physical clearance requirements — everything technically works, but only if it fits.",
  },
  {
    kind: "performance" as const,
    icon: Gauge,
    title: "Should match",
    description: "Not a hard blocker, but a mismatch here means you're not getting full value from what you bought.",
  },
];

export default function CompatibilityPage() {
  return (
    <div className="container-page py-32 md:py-40">
      <Eyebrow>Compatibility</Eyebrow>
      <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
        How the pieces depend on each other.
      </h1>
      <p className="mt-4 max-w-xl text-balance leading-relaxed text-text-muted">
        A recommendation isn&apos;t useful if the pieces don&apos;t fit together. These are the
        category-level relationships we check for — not a live validation against specific part
        numbers, but the same reasoning a knowledgeable builder would apply.
      </p>

      <div className="mt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
          A computer is a system
        </p>
        <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-text-muted">
          Every core component depends on at least one other. Follow the lines — or tap any part
          to browse it.
        </p>
        <div className="mt-6">
          <SystemDiagram />
        </div>
      </div>

      <div className="mt-16 space-y-16">
        {groups.map((group) => {
          const links = compatibilityLinks.filter((l) => l.kind === group.kind);
          return (
            <section key={group.kind}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-muted">
                  <group.icon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.01em] text-text">{group.title}</h2>
                </div>
              </div>
              <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-text-muted">
                {group.description}
              </p>
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {links.map((link) => (
                  <LinkRow key={`${link.from}-${link.to}`} link={link} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-center gap-3 rounded-xl border border-border bg-canvas-raised p-10 text-center">
        <p className="max-w-md text-text-muted">
          Want compatibility applied to an actual build instead of the general rules? The planner
          picks components that already work together.
        </p>
        <Link
          href="/plan"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:text-accent"
        >
          Plan your hardware <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
