"use client";

import * as React from "react";
import { Sparkles, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import type { HardwareProduct } from "@/lib/data/types";
import { getAiProvider, type AiMessage } from "@/lib/ai";
import { useSetAiContext } from "@/lib/ai/ui-context";
import { Tag } from "@/components/ui/tag";

const examplePrompts = [
  "Is this enough for gaming?",
  "Can this run a local LLM?",
  "What should I pair with this?",
  "Is there a cheaper alternative?",
];

export function AskAiAboutProduct({ product }: { product: HardwareProduct }) {
  useSetAiContext({ kind: "product", product });

  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<AiMessage[]>([]);
  const [lastMode, setLastMode] = React.useState<"live" | "fallback" | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastFailedQuestion, setLastFailedQuestion] = React.useState<string | null>(null);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setPending(true);
    setInput("");
    setError(null);
    const nextHistory = [...history, { role: "user" as const, content: trimmed }];
    setHistory(nextHistory);

    try {
      const response = await getAiProvider().ask({ kind: "product", product }, trimmed, history);
      setHistory([...nextHistory, { role: "assistant", content: response.message }]);
      setLastMode(response.mode);
    } catch {
      setError("Couldn't reach HardwareNeeds AI.");
      setLastFailedQuestion(trimmed);
    } finally {
      setPending(false);
    }
  }

  function retry() {
    if (!lastFailedQuestion) return;
    setError(null);
    ask(lastFailedQuestion);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Ask AI about this hardware
        </p>
        {lastMode && (
          <Tag tone={lastMode === "live" ? "accent" : "neutral"} className="shrink-0">
            {lastMode === "live" ? "Live AI" : "Deterministic"}
          </Tag>
        )}
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-text-faint">
        Answers are grounded in this product&apos;s real specs and catalog neighbors — live AI when
        connected, HardwareNeeds&apos; built-in assistant otherwise.
      </p>

      {history.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {history.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "rounded-lg border border-border-faint bg-canvas-raised px-3.5 py-2.5 text-[12.5px] font-medium text-text-muted"
                  : "animate-fade-up rounded-lg border border-border-faint bg-canvas-raised px-3.5 py-2.5 text-[13.5px] leading-relaxed text-text"
              }
            >
              {m.content}
            </div>
          ))}
        </div>
      )}

      {pending && (
        <p className="mt-3 flex items-center gap-2 text-[13px] text-text-faint">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking the catalog…
        </p>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-danger/30 bg-danger-dim px-3.5 py-2.5 text-[13px] text-danger">
          <span className="flex-1">{error}</span>
          <button
            onClick={retry}
            className="flex shrink-0 items-center gap-1 rounded-md border border-danger/40 px-2 py-1 text-[11.5px] font-medium transition-colors hover:bg-danger/10"
          >
            <RotateCcw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {history.length === 0 && !pending && (
        <div className="mt-4 flex flex-wrap gap-2">
          {examplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="rounded-md border border-border px-3 py-1.5 text-[12.5px] text-text-muted transition-colors hover:border-border-strong hover:text-text"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        className="mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this product…"
          className="h-10 flex-1 rounded-md border border-border bg-canvas px-3 text-[13px] text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-strong bg-accent text-[#04070d] transition-opacity disabled:opacity-40"
          aria-label="Ask"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
