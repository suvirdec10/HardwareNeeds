"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { compatibilityLinks } from "@/lib/data/compatibility";
import { getCategory } from "@/lib/data/categories";
import { useAiUi, useSetAiContext } from "@/lib/ai/ui-context";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const linkedCategoryIds = Array.from(new Set(compatibilityLinks.flatMap((l) => [l.from, l.to])))
  .map((id) => getCategory(id))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

function partnerFor(categoryId: string): string {
  const link = compatibilityLinks.find((l) => l.from === categoryId || l.to === categoryId);
  if (!link) return linkedCategoryIds.find((c) => c.id !== categoryId)?.id ?? "";
  return link.from === categoryId ? link.to : link.from;
}

export function AiPairingChecker() {
  const [categoryAId, setCategoryAId] = React.useState(linkedCategoryIds[0]?.id ?? "");
  const [categoryBId, setCategoryBId] = React.useState(() => partnerFor(linkedCategoryIds[0]?.id ?? ""));

  const { askQuestion } = useAiUi();
  useSetAiContext({ kind: "compatibility", categoryAId, categoryBId });

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
        <Sparkles className="h-3.5 w-3.5" /> Ask AI about a pairing
      </p>
      <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-text-muted">
        Pick two categories and ask why they do (or don&apos;t) work together — grounded in the
        real compatibility rules above, not general guessing.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Select
          value={categoryAId}
          onValueChange={(id) => {
            setCategoryAId(id);
            if (id === categoryBId) setCategoryBId(partnerFor(id));
          }}
          options={linkedCategoryIds.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Select
          value={categoryBId}
          onValueChange={setCategoryBId}
          options={linkedCategoryIds.filter((c) => c.id !== categoryAId).map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => askQuestion("Are these compatible, and why or why not?")}>
          Ask AI about this pairing
        </Button>
        <Button variant="ghost" size="sm" onClick={() => askQuestion("What should I use instead?")}>
          What should I use instead?
        </Button>
      </div>
    </div>
  );
}
