import type { HardwareProduct, PlanAnswers, Recommendation } from "@/lib/data/types";

/**
 * HardwareNeeds' AI layer is an *intelligence/explanation layer over the
 * real catalog + recommendation engine* — it interprets requests and
 * explains results, but it never invents hardware. Every product any
 * provider implementation returns must come from `src/lib/data/products.ts`
 * via the existing recommendation/compatibility functions.
 *
 * There is currently no LLM API key configured in this environment, so the
 * only implementation is `HeuristicAiProvider` (deterministic keyword/rule
 * matching — see heuristic-provider.ts). It is NOT a language model and
 * does not pretend to be one. This interface exists so a real provider
 * (backed by an actual model) can be dropped in later — see index.ts —
 * without touching any UI code, which only ever talks to `AiProvider`.
 */

/** What the interpreter extracted from a free-text request. */
export interface WorkloadProfile {
  /** Best-guess matching Goal id from src/lib/data/goals.ts, if any. */
  goalId?: string;
  /** Parsed budget in USD, if a dollar amount was mentioned. */
  budget?: number;
  /** Workload/use-case keywords recognized in the text (e.g. "gaming", "ai-ml"). */
  workloadKeywords: string[];
  /** The original text, unmodified. */
  raw: string;
  /** Plain-language summary of what was understood, shown back to the user. */
  summary: string;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FollowUpContext {
  goalId: string;
  answers: PlanAnswers;
  recommendations: Recommendation[];
}

export interface AiFollowUpResponse {
  message: string;
  /** Present when the follow-up produced a revised build — always real catalog products. */
  updatedRecommendations?: Recommendation[];
  /** Present when the follow-up produced revised answers (e.g. a budget change) worth remembering. */
  updatedAnswers?: PlanAnswers;
}

export interface AiProvider {
  readonly id: string;
  readonly label: string;
  /** False for rule-based providers — lets the UI be honest about what's answering, if it ever needs to be. */
  readonly isGenerativeModel: boolean;
  interpretRequest(text: string): WorkloadProfile;
  answerFollowUp(
    context: FollowUpContext,
    question: string,
    history: AiMessage[],
  ): Promise<AiFollowUpResponse>;
  /** Answers a free-text question about one specific catalog product — grounded in its real specs/catalog neighbors, never invented. */
  answerAboutProduct(product: HardwareProduct, question: string): Promise<string>;
}
