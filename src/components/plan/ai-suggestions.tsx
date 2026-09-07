"use client";

import * as React from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import type { Goal, PlanAnswers, Recommendation } from "@/lib/data/types";
import { useAiUi } from "@/lib/ai/ui-context";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const followUps = [
  "Make it cheaper",
  "Improve gaming performance",
  "Improve AI performance",
  "Make it quieter",
  "Improve upgradeability",
  "Use less power",
  "Give me more storage",
  "Find alternatives",
  "Explain this build",
  "Compare with another build",
];

export function AiSuggestions({
  goal,
  answers,
  recommendations,
  onAskFollowUp,
}: {
  goal: Goal;
  answers: PlanAnswers;
  recommendations: Recommendation[];
  onAskFollowUp: () => void;
}) {
  const { askQuestion } = useAiUi();
  const [suggestions, setSuggestions] = React.useState<string[] | null>(null);
  const [mode, setMode] = React.useState<"live" | "fallback" | null>(null);
  const [pending, setPending] = React.useState(true);
  const [error, setError] = React.useState(false);
  const requestKey = `${goal.id}:${recommendations.map((r) => r.product.id).join(",")}`;

  const load = React.useCallback(async () => {
    setPending(true);
    setError(false);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: { kind: "plan", goalId: goal.id, answers, recommendations } }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { suggestions: string[]; mode: "live" | "fallback" };
      setSuggestions(data.suggestions);
      setMode(data.mode);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  React.useEffect(() => {
    // Deferred a tick so load()'s setState calls aren't triggered synchronously
    // from within this effect's commit.
    queueMicrotask(() => load());
  }, [load]);

  if (!pending && !error && suggestions && suggestions.length === 0) return null;

  return (
    <Reveal className="mt-10 rounded-xl border border-border bg-canvas-raised p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
          <Sparkles className="h-3.5 w-3.5" /> AI Suggestions
        </p>
        {mode && (
          <Tag tone={mode === "live" ? "accent" : "neutral"}>{mode === "live" ? "Live AI" : "Deterministic"}</Tag>
        )}
      </div>

      {pending && (
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-surface-2" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      )}

      {!pending && error && (
        <div className="mt-4 flex items-center gap-3 text-[13px] text-text-muted">
          <span>Couldn&apos;t generate suggestions right now.</span>
          <button
            onClick={load}
            className="flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-[11.5px] font-medium text-text transition-colors hover:bg-surface"
          >
            <RotateCcw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {!pending && !error && suggestions && suggestions.length > 0 && (
        <ul className="mt-4 space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-muted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {s}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border-faint pt-5">
        {followUps.map((f) => (
          <button
            key={f}
            onClick={() => askQuestion(f)}
            className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[12px] text-text-muted transition-colors hover:border-accent-border hover:text-text"
          >
            {f}
          </button>
        ))}
      </div>

      <Button variant="ghost" size="sm" className="mt-4" onClick={onAskFollowUp}>
        Ask something else
      </Button>
    </Reveal>
  );
}
