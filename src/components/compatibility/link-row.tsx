import Link from "next/link";
import * as Icons from "lucide-react";
import type { CompatibilityLink } from "@/lib/data/types";
import { getCategory } from "@/lib/data/categories";
import { Tag } from "@/components/ui/tag";

const kindTone = {
  critical: "danger",
  physical: "warning",
  performance: "accent",
} as const;

const kindLabel = {
  critical: "Must match",
  physical: "Must fit",
  performance: "Should match",
} as const;

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box;
  return <Cmp className={className} strokeWidth={1.75} />;
}

export function LinkRow({ link }: { link: CompatibilityLink }) {
  const from = getCategory(link.from);
  const to = getCategory(link.to);
  if (!from || !to) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/hardware/${from.slug}`}
          className="flex items-center gap-2.5 rounded-md border border-border bg-canvas px-3.5 py-2.5 transition-colors hover:border-border-strong"
        >
          <Icon name={from.icon} className="h-4 w-4 text-text-muted" />
          <span className="text-[13.5px] font-medium text-text">{from.name}</span>
        </Link>

        <div className="flex flex-1 items-center gap-2 sm:min-w-[8rem]">
          <div className="h-px flex-1 bg-border-strong" />
          <Tag tone={kindTone[link.kind]}>{kindLabel[link.kind]}</Tag>
          <div className="h-px flex-1 bg-border-strong" />
        </div>

        <Link
          href={`/hardware/${to.slug}`}
          className="flex items-center gap-2.5 rounded-md border border-border bg-canvas px-3.5 py-2.5 transition-colors hover:border-border-strong"
        >
          <Icon name={to.icon} className="h-4 w-4 text-text-muted" />
          <span className="text-[13.5px] font-medium text-text">{to.name}</span>
        </Link>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-text-muted">
        <span className="font-medium text-text">{link.label}.</span> {link.detail}
      </p>
    </div>
  );
}
