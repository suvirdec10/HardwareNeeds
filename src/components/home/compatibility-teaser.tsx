import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { getCategory } from "@/lib/data/categories";
import { linkBetween } from "@/lib/data/compatibility";

const chains: [string, string][][] = [
  [
    ["cpu", "motherboard"],
    ["motherboard", "ram"],
  ],
  [
    ["gpu", "psu"],
    ["psu", "case"],
  ],
];

function Chain({ pairs }: { pairs: [string, string][] }) {
  const nodes = [pairs[0][0], ...pairs.map((p) => p[1])];
  return (
    <div className="flex flex-col items-center">
      {nodes.map((id, i) => {
        const category = getCategory(id);
        const link = i < pairs.length ? linkBetween(pairs[i][0], pairs[i][1]) : null;
        return (
          <div key={id} className="flex flex-col items-center">
            <div className="w-44 rounded-lg border border-border bg-surface px-4 py-3 text-center">
              <p className="text-sm font-medium text-text">{category?.name}</p>
            </div>
            {link && (
              <div className="flex flex-col items-center py-2">
                <div className="h-6 w-px bg-border-strong" />
                <p className="max-w-[10rem] text-center font-mono text-[10px] uppercase leading-tight tracking-[0.06em] text-accent">
                  {link.label}
                </p>
                <div className="h-6 w-px bg-border-strong" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CompatibilityTeaser() {
  return (
    <section className="divider-fade-top py-24 md:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Compatibility</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
              Every part depends on the ones around it.
            </h2>
            <p className="mt-4 max-w-md text-balance leading-relaxed text-text-muted">
              A recommendation isn&apos;t useful if the pieces don&apos;t fit together. We map how
              components depend on each other so incompatibilities are obvious, not discovered
              after checkout.
            </p>
            <LinkButton href="/compatibility" variant="secondary" className="mt-8">
              See how it works
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          <div className="flex flex-wrap justify-center gap-10 rounded-2xl border border-border bg-canvas-raised p-8 sm:gap-16">
            <Chain pairs={chains[0]} />
            <Chain pairs={chains[1]} />
          </div>
        </div>
      </div>
    </section>
  );
}
