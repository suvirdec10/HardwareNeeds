"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { getGoal } from "@/lib/data/goals";
import { getCategory } from "@/lib/data/categories";
import type { PlanAnswers } from "@/lib/data/types";
import type { AssistantContext } from "@/lib/ai";
import { generateRecommendations, buildSystemSummary } from "@/lib/data/recommend";
import { useAiUi, useSetAiContext } from "@/lib/ai/ui-context";
import { GoalGrid } from "./goal-grid";
import { DescribeYourBuild } from "./describe-input";
import { QuestionStep } from "./question-step";
import { RecommendationCard } from "./recommendation-card";
import { SystemSummary } from "./system-summary";
import { AiSuggestions } from "./ai-suggestions";
import { FindPartsOnline } from "./find-parts-online";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";
import { Check } from "lucide-react";

type Phase = "goal" | "questions" | "loading" | "results";

export function PlanExperience() {
  const searchParams = useSearchParams();
  const initialGoal = searchParams.get("goal");

  const [goalId, setGoalId] = React.useState<string | null>(
    initialGoal && getGoal(initialGoal) ? initialGoal : null,
  );
  const [phase, setPhase] = React.useState<Phase>(initialGoal && getGoal(initialGoal) ? "questions" : "goal");
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<PlanAnswers>({});
  const { setOpen: setAiOpen } = useAiUi();

  const goal = goalId ? getGoal(goalId) : null;
  const question = goal?.questions[step];

  // Sliders always render a value (their own default), so they never block progress.
  const isAnswered = (() => {
    if (!question) return false;
    if (question.type === "slider") return true;
    const value = answers[question.id];
    if (question.type === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  })();

  function selectGoal(id: string, initialAnswers: PlanAnswers = {}) {
    setGoalId(id);
    setStep(0);
    setAnswers(initialAnswers);
    setPhase("questions");
  }

  function next() {
    if (!goal) return;
    if (step < goal.questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("loading");
      const focusCount = Math.min(goal.focusCategories.length, 6);
      window.setTimeout(() => setPhase("results"), 420 + focusCount * 180);
    }
  }

  function back() {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      setPhase("goal");
      setGoalId(null);
    }
  }

  function startOver() {
    setPhase("goal");
    setGoalId(null);
    setAnswers({});
    setStep(0);
  }

  const recommendations = React.useMemo(() => {
    if (phase !== "results" || !goalId) return [];
    return generateRecommendations(goalId, answers);
  }, [phase, goalId, answers]);

  const systemSummary = React.useMemo(() => {
    if (recommendations.length === 0 || !goal) return undefined;
    return buildSystemSummary(goal, recommendations);
  }, [goal, recommendations]);

  const aiContext: AssistantContext =
    phase === "results" && goalId ? { kind: "plan", goalId, answers, recommendations } : { kind: "general" };
  useSetAiContext(aiContext, (_recs, newAnswers) => setAnswers(newAnswers));

  return (
    <div className="container-page py-32 md:py-40">
      {phase === "goal" && (
        <div className="mx-auto max-w-4xl animate-fade-up">
          <div className="text-center">
            <Eyebrow>Quick start</Eyebrow>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
              What are you trying to do?
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-balance leading-relaxed text-text-muted">
              Describe it in your own words, or pick the closest match below.
            </p>
          </div>

          <div className="mt-10">
            <DescribeYourBuild onMatched={selectGoal} />
          </div>

          <div className="mt-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">or choose manually</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-10">
            <GoalGrid onSelect={selectGoal} hideHeader />
          </div>
        </div>
      )}

      {phase === "questions" && goal && question && (
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-between">
            <Eyebrow>{goal.label}</Eyebrow>
            <button
              onClick={startOver}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-faint transition-colors hover:text-text-muted"
            >
              <RotateCcw className="h-3 w-3" /> Start over
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex flex-1 gap-1.5">
              {goal.questions.map((_, i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-accent transition-transform duration-500"
                    style={{
                      transform: `scaleX(${i < step ? 1 : i === step ? 1 : 0})`,
                      transformOrigin: "left",
                      boxShadow: i === step ? "0 0 10px rgba(76,141,255,0.5)" : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-text-faint">
              {step + 1}/{goal.questions.length}
            </span>
          </div>

          <div key={question.id} className="mt-10 animate-fade-up">
            <QuestionStep
              question={question}
              value={answers[question.id]}
              onChange={(value) => setAnswers((a) => ({ ...a, [question.id]: value }))}
            />
          </div>

          <div className="mt-12 flex items-center justify-between">
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={next} disabled={!isAnswered}>
              {step < goal.questions.length - 1 ? "Next" : "See my recommendation"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {phase === "loading" && goal && (
        <div className="mx-auto flex min-h-[50vh] max-w-sm flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">
            Building your recommendation
          </p>
          <div className="mt-8 w-full space-y-2.5">
            {goal.focusCategories.slice(0, 6).map((id, i) => {
              const category = getCategory(id);
              if (!category) return null;
              return (
                <div
                  key={id}
                  className="flex animate-fade-up items-center gap-3 rounded-lg border border-border-faint bg-surface px-4 py-2.5"
                  style={{ animationDelay: `${i * 180}ms` }}
                >
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent bg-accent-dim opacity-0"
                    style={{
                      animation: "pop-in 0.3s var(--ease-premium) both",
                      animationDelay: `${i * 180 + 260}ms`,
                    }}
                  >
                    <Check className="h-2.5 w-2.5 text-accent-strong" strokeWidth={3} />
                  </span>
                  <span className="text-[13.5px] text-text-muted">{category.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === "results" && goal && (
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-start justify-between gap-6 animate-fade-up">
            <div>
              <Eyebrow>Your recommendation</Eyebrow>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
                Built for {goal.label.toLowerCase()}.
              </h1>
              <p className="mt-3 max-w-lg text-balance leading-relaxed text-text-muted">
                Based on what you told us, here&apos;s what we&apos;d recommend — and why each
                piece fits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={() => setAiOpen(true)}>
                <Sparkles className="h-3.5 w-3.5" /> Ask AI for more suggestions
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPhase("questions")}>
                Adjust answers
              </Button>
              <Button variant="ghost" size="sm" onClick={startOver}>
                <RotateCcw className="h-3.5 w-3.5" /> Start over
              </Button>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="mt-14 rounded-xl border border-border bg-surface p-10 text-center">
              <p className="text-text-muted">
                We don&apos;t have enough sample data yet to recommend for this combination.
                Try adjusting your answers.
              </p>
            </div>
          ) : (
            systemSummary && <SystemSummary summary={systemSummary} />
          )}

          {recommendations.length > 0 && (
            <div className="mt-8 space-y-6">
              {recommendations.map((r, i) => (
                <div
                  key={r.categoryId}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
                >
                  <RecommendationCard recommendation={r} />
                </div>
              ))}
            </div>
          )}

          {goal && recommendations.length > 0 && (
            <AiSuggestions
              goal={goal}
              answers={answers}
              recommendations={recommendations}
              onAskFollowUp={() => setAiOpen(true)}
            />
          )}

          {recommendations.length > 0 && <FindPartsOnline recommendations={recommendations} />}

          <div className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-border bg-canvas-raised p-8 text-center">
            <p className="text-text-muted">Want to see how these pieces fit together?</p>
            <Link
              href="/compatibility"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:text-accent"
            >
              Explore compatibility <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
