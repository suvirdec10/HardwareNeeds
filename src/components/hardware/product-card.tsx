import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import type { HardwareProduct } from "@/lib/data/types";
import { linksFor } from "@/lib/data/compatibility";
import { getCategory } from "@/lib/data/categories";
import { Tag } from "@/components/ui/tag";

const tierLabel: Record<HardwareProduct["tier"], string> = {
  essential: "Essential",
  balanced: "Balanced",
  performance: "Performance",
};

const tierTone: Record<HardwareProduct["tier"], "neutral" | "accent" | "success"> = {
  essential: "neutral",
  balanced: "accent",
  performance: "success",
};

export function ProductCard({ product }: { product: HardwareProduct }) {
  const compatCount = linksFor(product.categoryId).length;
  const category = getCategory(product.categoryId);

  return (
    <Link
      href={category ? `/hardware/${category.slug}/${product.slug}` : "#"}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2 hover:shadow-[0_16px_32px_-16px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-start justify-between gap-3">
        <Tag tone={tierTone[product.tier]}>{tierLabel[product.tier]}</Tag>
        <span className="font-mono text-sm text-text">${product.priceUSD.toLocaleString("en-US")}</span>
      </div>
      <p className="mt-4 text-[15px] font-medium text-text transition-colors group-hover:text-accent-strong">
        {product.brand} {product.name}
      </p>
      <p className="mt-1.5 text-[13px] leading-snug text-text-muted">{product.summary}</p>

      <dl className="mt-5 space-y-1.5 border-t border-border pt-4">
        {product.specs.slice(0, 3).map((spec) => (
          <div key={spec.label} className="flex items-center justify-between text-[12.5px]">
            <dt className="text-text-faint">{spec.label}</dt>
            <dd className="font-mono text-text-muted">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">
            {product.dataConfidence === "verified" ? "Verified specs" : "Reference specs"}
          </span>
          {compatCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-text-faint">
              <Link2 className="h-3 w-3" /> {compatCount} compat.
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent-strong">
          View details
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
