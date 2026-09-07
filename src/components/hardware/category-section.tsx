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

export function CategorySection({
  id,
  title,
  description,
  categories,
  variant,
}: {
  id: string;
  title: string;
  description: string;
  categories: HardwareCategory[];
  variant: "featured" | "compact" | "list";
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-20 md:py-24">
      <div className="container-page">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text sm:text-3xl">{title}</h2>
          <p className="mt-3 leading-relaxed text-text-muted">{description}</p>
        </div>

        {variant === "featured" && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const count = productsByCategory(c.id).length;
              return (
                <Link
                  key={c.id}
                  href={`/hardware/${c.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2"
                >
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-canvas text-text-muted transition-colors group-hover:border-accent-border group-hover:text-accent-strong">
                      <Icon name={c.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <p className="mt-4 text-[15px] font-medium text-text">{c.name}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-text-muted">{c.tagline}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-text-faint">
                      {count} sample {count === 1 ? "product" : "products"}
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
