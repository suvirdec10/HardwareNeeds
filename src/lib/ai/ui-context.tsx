"use client";

import * as React from "react";
import type { AssistantContext } from "./types";
import type { PlanAnswers, Recommendation } from "@/lib/data/types";

type OnUpdate = (recommendations: Recommendation[], answers: PlanAnswers) => void;

interface AiUiState {
  context: AssistantContext;
  contextKey: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  registerContext: (context: AssistantContext, onUpdate?: OnUpdate) => void;
  resetContext: () => void;
  onUpdate?: OnUpdate;
  /** Opens the panel and queues a question to send automatically once open. */
  askQuestion: (question: string) => void;
  pendingQuestion: string | null;
  clearPendingQuestion: () => void;
}

const AiUiContext = React.createContext<AiUiState | null>(null);

function keyFor(context: AssistantContext): string {
  switch (context.kind) {
    case "product":
      return `product:${context.product.id}`;
    case "plan":
      return `plan:${context.goalId}`;
    case "compare":
      return `compare:${context.categoryId}:${context.productA.id}:${context.productB.id}`;
    case "compatibility":
      return `compat:${context.categoryAId}:${context.categoryBId}:${context.productA?.id ?? ""}:${context.productB?.id ?? ""}`;
    default:
      return "general";
  }
}

export function AiUiProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = React.useState<AssistantContext>({ kind: "general" });
  const [open, setOpen] = React.useState(false);
  const [pendingQuestion, setPendingQuestion] = React.useState<string | null>(null);
  const [onUpdate, setOnUpdateState] = React.useState<OnUpdate | undefined>(undefined);

  const registerContext = React.useCallback((next: AssistantContext, onUpdateFn?: OnUpdate) => {
    setOnUpdateState(() => onUpdateFn);
    setContext(next);
  }, []);

  const resetContext = React.useCallback(() => {
    setOnUpdateState(undefined);
    setContext({ kind: "general" });
  }, []);

  const askQuestion = React.useCallback((question: string) => {
    setPendingQuestion(question);
    setOpen(true);
  }, []);

  const clearPendingQuestion = React.useCallback(() => setPendingQuestion(null), []);

  const value = React.useMemo<AiUiState>(
    () => ({
      context,
      contextKey: keyFor(context),
      open,
      setOpen,
      registerContext,
      resetContext,
      onUpdate,
      askQuestion,
      pendingQuestion,
      clearPendingQuestion,
    }),
    [context, open, registerContext, resetContext, onUpdate, askQuestion, pendingQuestion, clearPendingQuestion],
  );

  return <AiUiContext.Provider value={value}>{children}</AiUiContext.Provider>;
}

export function useAiUi() {
  const ctx = React.useContext(AiUiContext);
  if (!ctx) throw new Error("useAiUi must be used within AiUiProvider");
  return ctx;
}

/**
 * Registers this page/section's AI context for as long as it's mounted, so
 * the global assistant (and any page-local trigger that opens it) knows
 * what the user is currently looking at. Resets to "general" on unmount.
 */
export function useSetAiContext(context: AssistantContext, onUpdate?: OnUpdate) {
  const { registerContext, resetContext } = useAiUi();
  const key = keyFor(context);

  React.useEffect(() => {
    registerContext(context, onUpdate);
    return resetContext;
    // Re-register only when the underlying entity changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
