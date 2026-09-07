import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { HardwareCategory } from "@/lib/data/types";
import { productsByCategory } from "@/lib/data/products";
import { cn } from "@/lib/utils";

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box;
  return <Cmp className={className} strokeWidth={1.75} />;
}

/** The parts every build hinges on — given a distinct, larger treatment. */
const PRIMARY_IDS = new Set(["cpu", "gpu", "motherboard"]);

export function CategorySection({
  id,
  index,
  title,
  description,
  categories,
  variant,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  categories: HardwareCategory[];
  variant: "featured" | "compact" | "list";
}) {
  return (
    <section id={id} className="scroll-mt-24 divider-fade-top py-20 md:py-24">
      <div className="container-page">
        <div className="flex items-start gap-5">
          {index && (
            <span className="mt-1 shrink-0 font-mono text-sm text-text-faint" aria-hidden>
              {index}
            </span>
          )}
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text sm:text-3xl">{title}</h2>
            <p className="mt-3 leading-relaxed text-text-muted">{description}</p>
          </div>
        </div>

        {variant === "featured" && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const products = productsByCategory(c.id);
              const preview = products[0];
              const isPrimary = PRIMARY_IDS.has(c.id);

              return (
                <Link
                  key={c.id}
                  href={`/hardware/${c.slug}`}
                  className={cn(
                    "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)]",
                    isPrimary ? "border-border p-7" : "border-border p-6",
                  )}
                >
                  {isPrimary && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-border to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )}
                  <div>
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-md border border-border bg-canvas text-text-muted transition-colors group-hover:border-accent-border group-hover:text-accent-strong",
                          isPrimary ? "h-12 w-12" : "h-10 w-10",
                        )}
                      >
                        <Icon name={c.icon} className={isPrimary ? "h-5 w-5" : "h-[18px] w-[18px]"} />
                      </span>
                      {isPrimary && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
                          Core component
                        </span>
                      )}
                    </div>
                    <p className={cn("mt-4 font-medium text-text", isPrimary ? "text-lg" : "text-[15px]")}>
                      {c.name}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-snug text-text-muted">{c.tagline}</p>

                    {isPrimary && preview && (
                      <div className="mt-4 flex items-center gap-2 rounded-md border border-border-faint bg-canvas/60 px-3 py-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                        <span className="truncate text-[12px] text-text-muted">
                          e.g. {preview.brand} {preview.name}
                        </span>
                        <span className="ml-auto shrink-0 font-mono text-[11px] text-text-faint">
                          ${preview.priceUSD}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-text-faint">
                      {products.length} sample {products.length === 1 ? "product" : "products"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {variant === "compact" && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/hardware/${c.slug}`}
                className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-all duration-300 hover:border-border-strong hover:bg-surface-2"
              >
                <Icon
                  name={c.icon}
                  className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent-strong"
                />
                <span className="text-[13.5px] font-medium text-text">{c.name}</span>
              </Link>
            ))}
          </div>
        )}

        {variant === "list" && (
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/hardware/${c.slug}`}
                className={cn(
                  "group flex items-center justify-between gap-4 bg-surface px-5 py-4 transition-colors duration-200 hover:bg-surface-2",
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icon name={c.icon} className="h-4 w-4 shrink-0 text-text-muted" />
                  <div>
                    <p className="text-[13.5px] font-medium text-text">{c.name}</p>
                    <p className="text-[12.5px] text-text-muted">{c.tagline}</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
