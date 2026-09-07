import type { AiClient, AiMessage, AssistantContext, AssistantResponse } from "./types";
import { interpretRequest } from "./goal-match";

/**
 * The only AI entry point client components should use. `ask()` always
 * goes through the server route — never calls a model directly from the
 * browser — so an API key never has a reason to exist in client code.
 * Network/API failures are thrown, not swallowed, so the UI can show a real
 * error + retry state instead of quietly pretending nothing went wrong.
 */
async function ask(context: AssistantContext, question: string, history: AiMessage[]): Promise<AssistantResponse> {
  const res = await fetch("/api/ai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, question, history }),
  });
  if (!res.ok) {
    throw new Error(`HardwareNeeds AI request failed (${res.status})`);
  }
  return (await res.json()) as AssistantResponse;
}

export const aiClient: AiClient = { interpretRequest, ask };

export function getAiProvider(): AiClient {
  return aiClient;
}
