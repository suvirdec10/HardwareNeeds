import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { getCategory } from "@/lib/data/categories";
import { linkBetween } from "@/lib/data/compatibility";

const chain = ["cpu", "motherboard", "ram", "gpu", "psu"];

export function CompatibilityTeaser() {
  return (
    <section className="relative divider-fade-top py-28 md:py-40">
      <div className="container-page grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
        <div className="order-2 lg:order-1">
          <Eyebrow>Compatibility</Eyebrow>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.02em] text-text sm:text-5xl">
            Hardware doesn&apos;t work alone.
          </h2>
          <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-text-muted">
            A computer is a system, not a pile of parts. Every component depends on the ones
            around it — we map those relationships so incompatibilities are obvious upfront,
            not discovered after checkout.
          </p>
          <LinkButton href="/compatibility" variant="secondary" size="lg" className="mt-8">
            See how it works
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="flex flex-col items-center">
            {chain.map((id, i) => {
              const category = getCategory(id);
              const next = chain[i + 1];
              const link = next ? linkBetween(id, next) : null;
              if (!category) return null;
              return (
                <div key={id} className="flex flex-col items-center">
                  <div className="w-52 rounded-lg border border-border-strong bg-surface px-5 py-3.5 text-center shadow-[0_12px_28px_-16px_rgba(0,0,0,0.5)]">
                    <p className="text-[14.5px] font-medium text-text">{category.name}</p>
                  </div>
                  {next && (
                    <div className="flex flex-col items-center py-2.5">
                      <div className="h-5 w-px bg-border-strong" />
                      <p className="max-w-[11rem] py-1 text-center font-mono text-[10px] uppercase leading-tight tracking-[0.06em] text-accent">
                        {link?.label ?? "Shares the same system"}
                      </p>
                      <div className="h-5 w-px bg-border-strong" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
