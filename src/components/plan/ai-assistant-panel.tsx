"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { getAiProvider, type AiMessage } from "@/lib/ai";
import type { PlanAnswers, Recommendation } from "@/lib/data/types";

const suggestedPrompts = [
  "Can I save $200?",
  "What if my budget increases to $2,000?",
  "Give me a quieter build",
  "Why did you pick this GPU?",
  "Can I use AMD instead?",
  "Make this build cheaper",
];

export function AiAssistantPanel({
  open,
  onOpenChange,
  goalId,
  answers,
  recommendations,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  answers: PlanAnswers;
  recommendations: Recommendation[];
  onUpdate: (recommendations: Recommendation[], answers: PlanAnswers) => void;
}) {
  const [history, setHistory] = React.useState<AiMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, pending]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || pending) return;
    setInput("");
    const userMessage: AiMessage = { role: "user", content: text };
    setHistory((h) => [...h, userMessage]);
    setPending(true);

    const provider = getAiProvider();
    const response = await provider.answerFollowUp(
      { goalId, answers, recommendations },
      text,
      history,
    );

    setHistory((h) => [...h, { role: "assistant", content: response.message }]);
    if (response.updatedRecommendations) {
      onUpdate(response.updatedRecommendations, response.updatedAnswers ?? answers);
    }
    setPending(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in-fast" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border-strong bg-canvas-raised shadow-[-24px_0_60px_-24px_rgba(0,0,0,0.7)] focus:outline-none data-[state=open]:animate-panel-in"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-accent-border bg-accent-dim text-accent-strong">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <Dialog.Title className="text-[14.5px] font-semibold text-text">Explore alternatives</Dialog.Title>
                <p className="text-[11px] text-text-faint">Recommendation assistant — not a live language model</p>
              </div>
            </div>
            <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-md text-text-faint transition-colors hover:bg-surface hover:text-text">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {history.length === 0 && (
              <div className="rounded-lg border border-border-faint bg-surface p-4">
                <p className="text-[13px] leading-relaxed text-text-muted">
                  Ask about your current build — I&apos;ll adjust it using real options from the catalog,
                  or explain why a part was picked.
                </p>
              </div>
            )}
            {history.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-lg rounded-br-sm bg-accent px-3.5 py-2.5 text-[13.5px] text-[#04070d]"
                      : "max-w-[85%] rounded-lg rounded-bl-sm border border-border bg-surface px-3.5 py-2.5 text-[13.5px] leading-relaxed text-text-muted"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg rounded-bl-sm border border-border bg-surface px-3.5 py-2.5 text-[13px] text-text-faint">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking the catalog…
                </div>
              </div>
            )}
          </div>

          {history.length === 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[12px] text-text-muted transition-colors hover:border-accent-border hover:text-text"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border px-4 py-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Ask about this build…"
              className="h-11 flex-1 rounded-md border border-border-strong bg-surface px-3.5 text-[13.5px] text-text placeholder:text-text-faint focus:border-accent-border focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-[#04070d] transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
