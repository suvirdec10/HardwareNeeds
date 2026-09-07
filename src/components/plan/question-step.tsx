"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { Check } from "lucide-react";
import type { PlanAnswers, PlanQuestion } from "@/lib/data/types";
import { cn } from "@/lib/utils";

function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export function QuestionStep({
  question,
  value,
  onChange,
}: {
  question: PlanQuestion;
  value: PlanAnswers[string] | undefined;
  onChange: (value: PlanAnswers[string]) => void;
}) {
  if (question.type === "slider") {
    const current = typeof value === "number" ? value : question.defaultValue ?? question.min ?? 0;
    return (
      <div>
        <p className="text-2xl font-medium tracking-[-0.01em] text-text">{question.prompt}</p>
        {question.helper && <p className="mt-2 text-sm text-text-muted">{question.helper}</p>}
        <div className="mt-10">
          <p className="font-mono text-3xl font-medium text-accent-strong">
            {question.unit === "$" ? formatCurrency(current) : `${current}${question.unit ?? ""}`}
          </p>
          <Slider.Root
            className="relative mt-6 flex h-5 w-full touch-none items-center"
            min={question.min}
            max={question.max}
            step={question.step}
            value={[current]}
            onValueChange={([v]) => onChange(v)}
          >
            <Slider.Track className="relative h-1 w-full grow rounded-full bg-surface-3">
              <Slider.Range className="absolute h-full rounded-full bg-accent" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-6 w-6 rounded-full border-2 border-accent bg-canvas-raised shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              aria-label={question.prompt}
            />
          </Slider.Root>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-text-faint">
            <span>
              {question.unit === "$" ? formatCurrency(question.min ?? 0) : question.min}
              {question.unit !== "$" ? question.unit : ""}
            </span>
            <span>
              {question.unit === "$" ? formatCurrency(question.max ?? 0) : question.max}
              {question.unit !== "$" ? question.unit : ""}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const selected = question.type === "multi" ? (Array.isArray(value) ? value : []) : value;

  return (
    <div>
      <p className="text-2xl font-medium tracking-[-0.01em] text-text">{question.prompt}</p>
      {question.helper && <p className="mt-2 text-sm text-text-muted">{question.helper}</p>}

      <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
        {question.options?.map((option) => {
          const isSelected =
            question.type === "multi"
              ? (selected as string[]).includes(option.value)
              : selected === option.value;

          return (
            <button
              key={option.value}
              onClick={() => {
                if (question.type === "multi") {
                  const arr = selected as string[];
                  onChange(
                    isSelected ? arr.filter((v) => v !== option.value) : [...arr, option.value],
                  );
                } else {
                  onChange(option.value);
                }
              }}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-[border-color,background-color,box-shadow,transform]",
                isSelected
                  ? "border-accent-border bg-accent-dim shadow-[0_0_0_1px_rgba(76,141,255,0.15),0_10px_24px_-14px_rgba(76,141,255,0.5)]"
                  : "border-border bg-surface hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  question.type === "multi" ? "rounded" : "rounded-full",
                  isSelected ? "border-accent bg-accent" : "border-border-strong",
                )}
              >
                {isSelected && <Check className="h-3 w-3 animate-pop-in text-[#04070d]" strokeWidth={3} />}
              </span>
              <span>
                <span className="block text-[14px] font-medium text-text">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-text-muted">
                    {option.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
