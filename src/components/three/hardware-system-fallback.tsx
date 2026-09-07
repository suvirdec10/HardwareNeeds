"use client";

import * as React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const coreIds = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler", "case"];

/**
 * Lightweight, non-WebGL stand-in for the interactive 3D hardware system.
 * Used on small viewports, reduced-motion preferences, or lower-powered
 * devices — same underlying idea (tap a part, understand what it does)
 * without the render cost.
 */
export function HardwareSystemFallback() {
  const [active, setActive] = React.useState<string | null>(null);
  const core = coreIds
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {core.map((category) => {
        const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] ?? Icons.Box;
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            onClick={() => setActive(isActive ? null : category.id)}
            className={cn(
              "group relative rounded-xl border p-4 text-left transition-all duration-300",
              isActive
                ? "border-accent-border bg-accent-dim"
                : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
            )}
          >
            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-accent-strong" : "text-text-muted")} />
            <p className="mt-3 text-sm font-medium text-text">{category.name}</p>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isActive ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-[13px] leading-snug text-text-muted">{category.tagline}</p>
                <Link
                  href={`/learn/${category.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-accent-strong hover:text-accent"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
