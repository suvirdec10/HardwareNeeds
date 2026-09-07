import Link from "next/link";
import { ArrowRight, Check, GitCompareArrows } from "lucide-react";
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

const scoreLabels: Record<string, string> = {
  performanceFit: "Performance",
  budgetFit: "Budget fit",
  workloadFit: "Workload fit",
  compatibilityFit: "Compatibility",
  upgradeability: "Upgradeability",
  efficiency: "Efficiency",
  value: "Value",
  softwareEcosystemFit: "Software ecosystem",
  longevity: "Longevity",
  portability: "Portability",
};

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const category = getCategory(recommendation.categoryId);
  const links = linksFor(recommendation.categoryId).filter(
    (l) => l.from === recommendation.categoryId,
  );
  const scoreEntries = Object.entries(recommendation.score ?? {}).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
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
          <span className="ml-2 text-xs text-text-faint">estimated price</span>
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Why this
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

          {scoreEntries.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Fit for your build
                <span className="ml-1.5 normal-case tracking-normal text-text-faint/70">— a heuristic estimate, not a lab benchmark</span>
              </p>
              <div className="mt-3 space-y-2.5">
                {scoreEntries.slice(0, 4).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-[12px] text-text-muted">
                      <span>{scoreLabels[key] ?? key}</span>
                      <span className="font-mono text-text-faint">{value}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-3">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {recommendation.alternative && (recommendation.whyNotAlternative || recommendation.tradeoff) && (
        <div className="divider-fade-top bg-canvas-raised px-6 py-5 sm:px-8">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            <GitCompareArrows className="h-3.5 w-3.5" />
            Considered: {recommendation.alternative.brand} {recommendation.alternative.name}
          </p>
          {recommendation.whyNotAlternative && (
            <p className="mt-2.5 text-[13px] leading-relaxed text-text-muted">
              <span className="font-medium text-text">Why not this instead — </span>
              {recommendation.whyNotAlternative}
            </p>
          )}
          {recommendation.tradeoff && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
              <span className="font-medium text-text">The tradeoff — </span>
              {recommendation.tradeoff}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 divider-fade-top bg-canvas-raised px-6 py-5 sm:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/hardware/${category.slug}/${recommendation.product.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-strong hover:text-accent"
          >
            View product details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-border-strong">·</span>
          <Link
            href={`/learn/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-text"
          >
            Learn about {category.name}
          </Link>
          <span className="text-border-strong">·</span>
          <Link
            href={`/compare?category=${category.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-text"
          >
            Compare options
          </Link>
        </div>
      </div>
    </Card>
  );
}
