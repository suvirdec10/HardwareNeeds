"use client";

import * as React from "react";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { goals } from "@/lib/data/goals";
import { Eyebrow } from "@/components/ui/tag";

export function GoalGrid({ onSelect }: { onSelect: (goalId: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <div className="text-center">
        <Eyebrow>Step 1 of 2</Eyebrow>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
          What are you building?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-balance leading-relaxed text-text-muted">
          Pick the closest match. We&apos;ll only ask what&apos;s actually relevant from there.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {goals.map((goal) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[goal.icon] ?? Icons.Box;
          return (
            <button
              key={goal.id}
              onClick={() => onSelect(goal.id)}
              className="group flex flex-col items-start gap-4 rounded-xl border border-border bg-surface p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-canvas text-text-muted transition-colors group-hover:border-accent-border group-hover:text-accent-strong">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[14.5px] font-medium text-text">{goal.label}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-text-muted">{goal.description}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
