"use client";

import * as React from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { getAiProvider, type WorkloadProfile } from "@/lib/ai";
import { getGoal } from "@/lib/data/goals";
import type { PlanAnswers } from "@/lib/data/types";

export function DescribeYourBuild({
  onMatched,
}: {
  onMatched: (goalId: string, initialAnswers: PlanAnswers) => void;
}) {
  const [text, setText] = React.useState("");
  const [profile, setProfile] = React.useState<WorkloadProfile | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setProfile(getAiProvider().interpretRequest(text));
  }

  const matchedGoal = profile?.goalId ? getGoal(profile.goalId) : undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" aria-hidden />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          aria-label="Describe what you're trying to accomplish"
          placeholder="Describe what you're trying to accomplish — e.g. “$1,500 for programming, local AI, and occasional gaming”"
          className="h-14 w-full rounded-xl border border-border-strong bg-surface pl-11 pr-[6.5rem] text-[14px] text-text placeholder:text-text-faint transition-colors focus:border-accent-border focus:outline-none sm:pr-28 sm:text-[14.5px]"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-accent px-3.5 py-2.5 text-[13px] font-medium text-[#04070d] transition-colors hover:bg-accent-strong sm:px-4"
        >
          Interpret
        </button>
      </form>

      {profile && (
        <div className="mt-4 animate-fade-up rounded-xl border border-border bg-canvas-raised p-5">
          <p className="text-[13.5px] leading-relaxed text-text-muted">{profile.summary}</p>
          {matchedGoal ? (
            <button
              onClick={() => onMatched(matchedGoal.id, profile.budget ? { budget: profile.budget } : {})}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-[13px] font-medium text-[#04070d] transition-colors hover:-translate-y-px hover:bg-accent-strong active:translate-y-0"
            >
              <Check className="h-3.5 w-3.5" /> Start with {matchedGoal.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <p className="mt-3 text-[12.5px] text-text-faint">Pick the closest match below instead.</p>
          )}
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-text-faint">
        Matched by keyword against your goal, not a live AI model — it just fast-forwards you into the planner below.
      </p>
    </div>
  );
}
