import type { HardwareProduct, PlanAnswers, Recommendation } from "@/lib/data/types";

/**
 * HardwareNeeds' AI layer is an *intelligence/explanation layer over the
 * real catalog + recommendation + compatibility engines* — it interprets
 * requests and explains results, but it never invents hardware. Whatever
 * answers a question, the specs/prices/compatibility facts it's grounded in
 * always come from `src/lib/data/*`.
 *
 * There are two possible answer sources, and the UI must always be honest
 * about which one produced a given message:
 *  - LIVE mode: a real model call (see src/app/api/ai/assistant/route.ts and
 *    src/lib/ai/server/openai.ts), used only when OPENAI_API_KEY is set.
 *  - FALLBACK mode: deterministic, rule-based matching over the same
 *    catalog data (src/lib/ai/deterministic.ts) — no model call at all.
 * Every AssistantResponse below carries a `mode` field for exactly this
 * reason. Nothing in this app should ever claim "live" when it isn't.
 */

/** What the interpreter extracted from a free-text request. Local/instant — no network call. */
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

/**
 * What the assistant currently knows about, driven by whatever page/section
 * the user is on. This is the "retrieve relevant catalog entries" step of
 * the pipeline — everything the AI is allowed to reason over is named here,
 * not left to general knowledge.
 */
export type AssistantContext =
  | { kind: "general" }
  | { kind: "plan"; goalId: string; answers: PlanAnswers; recommendations: Recommendation[] }
  | { kind: "product"; product: HardwareProduct }
  | { kind: "compare"; categoryId: string; productA: HardwareProduct; productB: HardwareProduct }
  | {
      kind: "compatibility";
      categoryAId: string;
      categoryBId: string;
      productA?: HardwareProduct;
      productB?: HardwareProduct;
    };

export interface AssistantResponse {
  message: string;
  /** Which answer source actually produced `message` — never fabricated. */
  mode: "live" | "fallback";
  /** Present when the question produced a revised build — always real catalog products. */
  updatedRecommendations?: Recommendation[];
  /** Present when the question produced revised answers (e.g. a budget change) worth remembering. */
  updatedAnswers?: PlanAnswers;
}

/** The single client-side entry point every AI-touching component uses. */
export interface AiClient {
  /** Local keyword matching, no network — used for the Plan quick-start box. */
  interpretRequest(text: string): WorkloadProfile;
  /** Routes through /api/ai/assistant, which decides live vs. fallback server-side. */
  ask(context: AssistantContext, question: string, history: AiMessage[]): Promise<AssistantResponse>;
}
