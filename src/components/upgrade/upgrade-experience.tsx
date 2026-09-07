"use client";

import * as React from "react";
import * as Icons from "lucide-react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { getCategory } from "@/lib/data/categories";
import {
  type CurrentTier,
  generateUpgradePlan,
  upgradeCategories,
  upgradeConcerns,
} from "@/lib/data/upgrade";
import { UpgradeResultCard } from "./upgrade-result-card";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

const tierOptions: { value: CurrentTier; label: string }[] = [
  { value: "unknown", label: "Not sure" },
  { value: "essential", label: "Entry" },
  { value: "balanced", label: "Mid" },
  { value: "performance", label: "High-end" },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box;
  return <Cmp className={className} strokeWidth={1.75} />;
}

export function UpgradeExperience() {
  const [current, setCurrent] = React.useState<Partial<Record<string, CurrentTier>>>({});
  const [concern, setConcern] = React.useState<string | null>(null);
  const [showResults, setShowResults] = React.useState(false);

  const results = React.useMemo(() => {
    if (!showResults || !concern) return [];
    return generateUpgradePlan({ current, concern });
  }, [showResults, concern, current]);

  function reset() {
    setCurrent({});
    setConcern(null);
    setShowResults(false);
  }

  if (showResults && concern) {
    const upgrades = results.filter((r) => r.action === "upgrade");
    const keeps = results.filter((r) => r.action === "keep");

    return (
      <div className="container-page py-32 md:py-40">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Eyebrow>Your upgrade plan</Eyebrow>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
                Here&apos;s what would actually help.
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Start over
            </Button>
          </div>

          {upgrades.length > 0 && (
            <div className="mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Worth upgrading
              </p>
              <div className="mt-4 space-y-4">
                {upgrades.map((r) => (
                  <UpgradeResultCard key={r.categoryId} result={r} />
                ))}
              </div>
            </div>
          )}

          {keeps.length > 0 && (
            <div className="mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Fine to keep
              </p>
              <div className="mt-4 space-y-3">
                {keeps.map((r) => (
                  <UpgradeResultCard key={r.categoryId} result={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-32 md:py-40">
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Upgrade mode</Eyebrow>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
          What you already have.
        </h1>
        <p className="mt-4 text-balance leading-relaxed text-text-muted">
          Roughly where each part sits today. Not sure is fine — we&apos;ll suggest a safe next
          step.
        </p>

        <div className="mt-10 space-y-2">
          {upgradeCategories.map((categoryId) => {
            const category = getCategory(categoryId);
            if (!category) return null;
            const value = current[categoryId] ?? "unknown";
            return (
              <div
                key={categoryId}
                className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Icon name={category.icon} className="h-4 w-4 text-text-muted" />
                  <span className="text-[13.5px] font-medium text-text">{category.name}</span>
                </div>
                <div className="flex gap-1.5">
                  {tierOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCurrent((c) => ({ ...c, [categoryId]: opt.value }))}
                      className={cn(
                        "min-h-[38px] rounded-md border px-3.5 py-2 text-[12.5px] font-medium transition-colors",
                        value === opt.value
                          ? "border-accent-border bg-accent-dim text-accent-strong"
                          : "border-border bg-canvas text-text-muted hover:border-border-strong hover:text-text",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14">
          <p className="text-2xl font-medium tracking-[-0.01em] text-text">
            What do you want to improve?
          </p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {upgradeConcerns.map((c) => (
              <button
                key={c.value}
                onClick={() => setConcern(c.value)}
                className={cn(
                  "rounded-lg border p-4 text-left transition-all duration-200",
                  concern === c.value
                    ? "border-accent-border bg-accent-dim"
                    : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
                )}
              >
                <p className="text-[14px] font-medium text-text">{c.label}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-text-muted">{c.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Button onClick={() => setShowResults(true)} disabled={!concern}>
            See my upgrade plan
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
