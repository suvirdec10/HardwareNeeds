import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Recommendation } from "@/lib/data/types";
import { getCategory } from "@/lib/data/categories";
import { linksFor } from "@/lib/data/compatibility";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";

const kindTone = {
  critical: "danger",
  physical: "warning",
  performance: "accent",
} as const;

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const category = getCategory(recommendation.categoryId);
  const links = linksFor(recommendation.categoryId).filter(
    (l) => l.from === recommendation.categoryId,
  );

  if (!category) return null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Tag tone="accent">Recommended</Tag>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">
            {category.name}
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-text">
          {recommendation.product.brand} {recommendation.product.name}
        </h3>
        <p className="mt-1.5 text-sm text-text-muted">{recommendation.product.summary}</p>
        <p className="mt-4 font-mono text-lg text-text">
          ${recommendation.product.priceUSD.toLocaleString("en-US")}
          <span className="ml-2 text-xs text-text-faint">sample price</span>
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Why we recommend it
          </p>
          <ul className="mt-3 space-y-2.5">
            {recommendation.reasoning.map((r, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-muted">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                {r}
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Expected role
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">{recommendation.role}</p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Important specifications
          </p>
          <dl className="mt-3 divide-y divide-border rounded-lg border border-border">
            {recommendation.product.specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between px-3.5 py-2.5">
                <dt className="text-[13px] text-text-muted">{spec.label}</dt>
                <dd className="font-mono text-[13px] text-text">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {links.length > 0 && (
        <div className="divider-fade-top px-6 py-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Compatibility
          </p>
          <ul className="mt-3 space-y-2.5">
            {links.map((link) => (
              <li key={link.to} className="flex flex-wrap items-center gap-2 text-[13px] text-text-muted">
                <Tag tone={kindTone[link.kind]}>{getCategory(link.to)?.name}</Tag>
                {link.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 divider-fade-top bg-canvas-raised px-6 py-5 sm:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/learn/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-strong hover:text-accent"
          >
            Learn about {category.name} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-border-strong">·</span>
          <Link
            href={`/compare?category=${category.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-text"
          >
            Compare {category.name} options
          </Link>
        </div>

        {recommendation.alternative && (
          <div className="text-right">
            <p className="text-[11px] text-text-faint">Alternative</p>
            <p className="text-[13px] text-text-muted">
              {recommendation.alternative.brand} {recommendation.alternative.name}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
