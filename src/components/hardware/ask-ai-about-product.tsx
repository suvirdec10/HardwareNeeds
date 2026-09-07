"use client";

import * as React from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import type { HardwareProduct } from "@/lib/data/types";
import { getAiProvider } from "@/lib/ai";

const examplePrompts = [
  "Is this enough for gaming?",
  "Can this run a local LLM?",
  "What should I pair with this?",
  "Is there a cheaper alternative?",
];

export function AskAiAboutProduct({ product }: { product: HardwareProduct }) {
  const [input, setInput] = React.useState("");
  const [exchange, setExchange] = React.useState<{ question: string; answer: string } | null>(null);
  const [pending, setPending] = React.useState(false);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setPending(true);
    setInput("");
    const response = await getAiProvider().answerAboutProduct(product, trimmed);
    setExchange({ question: trimmed, answer: response });
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
        <Sparkles className="h-3.5 w-3.5" /> Ask AI about this hardware
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-text-faint">
        Recommendation assistant — not a live language model. Answers are pulled from this
        product&apos;s real specs and catalog neighbors.
      </p>

      {pending && (
        <p className="mt-4 flex items-center gap-2 text-[13px] text-text-faint">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking the catalog…
        </p>
      )}

      {!pending && exchange && (
        <div className="mt-4 animate-fade-up space-y-2 rounded-lg border border-border-faint bg-canvas-raised p-3.5">
          <p className="text-[12px] font-medium text-text-faint">{exchange.question}</p>
          <p className="text-[13.5px] leading-relaxed text-text">{exchange.answer}</p>
        </div>
      )}

      {!exchange && !pending && (
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
