import Link from "next/link";
import { ArrowRight, ArrowUpCircle, CircleCheck, AlertTriangle } from "lucide-react";
import type { UpgradeCategoryResult } from "@/lib/data/upgrade";
import { getCategory } from "@/lib/data/categories";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";

export function UpgradeResultCard({ result }: { result: UpgradeCategoryResult }) {
  const category = getCategory(result.categoryId);
  if (!category) return null;

  if (result.action === "keep") {
    return (
      <Card className="flex items-start gap-4 p-6">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-canvas text-text-faint">
          <CircleCheck className="h-4 w-4" />
        </span>
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-[14.5px] font-medium text-text">{category.name}</p>
            <Tag tone="neutral">Keep as-is</Tag>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{result.reasoning[0]}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4 p-6">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-accent-border bg-accent-dim text-accent-strong">
          <ArrowUpCircle className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-[14.5px] font-medium text-text">{category.name}</p>
            <Tag tone="accent">Upgrade</Tag>
          </div>

          {result.product && (
            <p className="mt-1 text-[13.5px] text-text">
              {result.product.brand} {result.product.name}{" "}
              <span className="text-text-faint">${result.product.priceUSD.toLocaleString("en-US")}</span>
            </p>
          )}

          <ul className="mt-3 space-y-1.5">
            {result.reasoning.map((r, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-text-muted">
                {r}
              </li>
            ))}
          </ul>

          {result.compatibilityNote && (
            <p className="mt-3 flex items-start gap-2 rounded-md border border-warning/25 bg-warning-dim px-3 py-2.5 text-[12.5px] leading-relaxed text-warning">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {result.compatibilityNote}
            </p>
          )}

          <Link
            href={`/learn/${category.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-strong hover:text-accent"
          >
            Learn about {category.name} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
