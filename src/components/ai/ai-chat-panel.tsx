"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Send, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { getAiProvider } from "@/lib/ai";
import type { AiMessage } from "@/lib/ai";
import { useAiUi } from "@/lib/ai/ui-context";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const promptsByKind: Record<string, string[]> = {
  general: [
    "What gaming PC should I build for $1,300?",
    "Which SSD should I buy?",
    "Explain PCIe like I'm a beginner.",
    "What should I upgrade first?",
  ],
  plan: [
    "Can I save $200?",
    "What if my budget increases to $2,000?",
    "Give me a quieter build",
    "Why did you pick this GPU?",
    "Can I use AMD instead?",
  ],
  product: [
    "Is this enough for gaming?",
    "Can this run a local LLM?",
    "What should I pair with this?",
    "Is there a cheaper alternative?",
  ],
  compare: [
    "Which one should I buy?",
    "Which is better for gaming?",
    "Which is better for local AI?",
    "Is the more expensive one worth it?",
  ],
  compatibility: ["Are these compatible?", "Why or why not?", "What should I use instead?"],
};

const titleByKind: Record<string, { title: string; subtitle: string }> = {
  general: { title: "Ask HardwareNeeds AI", subtitle: "Grounded in the real HardwareNeeds catalog" },
  plan: { title: "Explore alternatives", subtitle: "Knows your current build" },
  product: { title: "Ask about this product", subtitle: "Knows the product you're viewing" },
  compare: { title: "Ask about this comparison", subtitle: "Knows both products being compared" },
  compatibility: { title: "Ask about this pairing", subtitle: "Knows the compatibility rule in question" },
};

export function AiChatPanel() {
  const { open, setOpen, context, contextKey, onUpdate, pendingQuestion, clearPendingQuestion } = useAiUi();
  const [historyByKey, setHistoryByKey] = React.useState<Record<string, AiMessage[]>>({});
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastFailedQuestion, setLastFailedQuestion] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const history = React.useMemo(() => historyByKey[contextKey] ?? [], [historyByKey, contextKey]);
  const copy = titleByKind[context.kind] ?? titleByKind.general;
  const prompts = promptsByKind[context.kind] ?? promptsByKind.general;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, pending, error]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || pending) return;
    setInput("");
    setError(null);
    const userMessage: AiMessage = { role: "user", content: text };
    const nextHistory = [...history, userMessage];
    setHistoryByKey((h) => ({ ...h, [contextKey]: nextHistory }));
    setPending(true);

    try {
      const response = await getAiProvider().ask(context, text, history);
      setHistoryByKey((h) => ({
        ...h,
        [contextKey]: [...(h[contextKey] ?? nextHistory), { role: "assistant", content: response.message }],
      }));
      if (response.updatedRecommendations) {
        onUpdate?.(response.updatedRecommendations, response.updatedAnswers ?? (context.kind === "plan" ? context.answers : {}));
      }
    } catch {
      setError("HardwareNeeds AI is temporarily unavailable.");
      setLastFailedQuestion(text);
    } finally {
      setPending(false);
    }
  }

  function retry() {
    if (!lastFailedQuestion) return;
    setError(null);
    send(lastFailedQuestion);
  }

  React.useEffect(() => {
    if (!open || !pendingQuestion) return;
    const question = pendingQuestion;
    clearPendingQuestion();
    // Deferred a tick so the (async, setState-heavy) send() call isn't triggered
    // synchronously from within this effect's commit.
    queueMicrotask(() => send(question));
    // send() intentionally omitted — it closes over state that's already current when this fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingQuestion, clearPendingQuestion]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in-fast" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border-strong bg-canvas-raised shadow-[-24px_0_60px_-24px_rgba(0,0,0,0.7)] focus:outline-none data-[state=open]:animate-panel-in"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-accent-border bg-accent-dim text-accent-strong">
                <LogoMark className="h-4 w-4" />
              </span>
              <div>
                <Dialog.Title className="text-[14.5px] font-semibold text-text">{copy.title}</Dialog.Title>
                <p className="text-[11px] text-text-faint">{copy.subtitle}</p>
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
                  Ask about {context.kind === "general" ? "any hardware, build, or comparison" : "what you're looking at"} —
                  answers are grounded in the real HardwareNeeds catalog, not invented.
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
            {error && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-center gap-3 rounded-lg rounded-bl-sm border border-danger/30 bg-danger-dim px-3.5 py-2.5 text-[13px] text-danger">
                  <span className="flex-1">{error}</span>
                  <button
                    onClick={retry}
                    className="flex shrink-0 items-center gap-1 rounded-md border border-danger/40 px-2 py-1 text-[11.5px] font-medium transition-colors hover:bg-danger/10"
                  >
                    <RotateCcw className="h-3 w-3" /> Retry
                  </button>
                </div>
              </div>
            )}
          </div>

          {history.length === 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
              {prompts.map((prompt) => (
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
              placeholder={context.kind === "general" ? "Ask HardwareNeeds AI…" : "Ask a question…"}
              className="h-11 flex-1 rounded-md border border-border-strong bg-surface px-3.5 text-[13.5px] text-text placeholder:text-text-faint focus:border-accent-border focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-[#04070d] transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40",
              )}
              aria-label="Send"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AiFloatingTrigger() {
  const { setOpen } = useAiUi();
  return (
    <button
      onClick={() => setOpen(true)}
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-border-strong bg-canvas-raised py-3 pl-3.5 pr-4 text-[13px] font-medium text-text shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-border hover:shadow-[0_20px_48px_-16px_rgba(76,141,255,0.35)] sm:bottom-8 sm:right-8"
      aria-label="Ask HardwareNeeds AI"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-dim text-accent-strong">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <span className="hidden sm:inline">Ask HardwareNeeds AI</span>
      <span className="sm:hidden">Ask AI</span>
    </button>
  );
}
