import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import type { HardwareProduct } from "@/lib/data/types";
import { linksFor } from "@/lib/data/compatibility";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";

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

  return (
    <Card interactive className="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <Tag tone={tierTone[product.tier]}>{tierLabel[product.tier]}</Tag>
        <span className="font-mono text-sm text-text">${product.priceUSD.toLocaleString("en-US")}</span>
      </div>
      <p className="mt-4 text-[15px] font-medium text-text">
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
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">
          {product.dataConfidence === "verified" ? "Verified specs" : "Reference specs"}
        </span>
        <div className="flex items-center gap-3">
          {compatCount > 0 && (
            <Link
              href={`/hardware/${product.categoryId}`}
              className="inline-flex items-center gap-1 text-[12.5px] font-medium text-text-muted hover:text-text"
            >
              <Link2 className="h-3 w-3" /> {compatCount} compat.
            </Link>
          )}
          <Link
            href={`/compare?category=${product.categoryId}`}
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent-strong hover:text-accent"
          >
            Compare <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
