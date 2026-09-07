"use client";

import * as React from "react";
import { ShoppingBag, ChevronDown } from "lucide-react";
import type { Recommendation } from "@/lib/data/types";
import { getCategory } from "@/lib/data/categories";
import { WhereToBuy } from "@/components/hardware/where-to-buy";
import { cn } from "@/lib/utils";

export function FindPartsOnline({ recommendations }: { recommendations: Recommendation[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mt-8 rounded-xl border border-border bg-canvas-raised">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 text-[14px] font-medium text-text">
          <ShoppingBag className="h-4 w-4 text-accent" /> Find these parts online
        </span>
        <ChevronDown className={cn("h-4 w-4 text-text-faint transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && (
        <div className="animate-fade-up space-y-6 border-t border-border-faint px-6 py-6 sm:px-8">
          {recommendations.map((r) => {
            const category = getCategory(r.categoryId);
            return (
              <div key={r.categoryId}>
                <p className="text-[13px] font-medium text-text">
                  {category?.name ?? r.categoryId}: {r.product.brand} {r.product.name}
                </p>
                <div className="mt-2.5">
                  <WhereToBuy product={r.product} compact />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
