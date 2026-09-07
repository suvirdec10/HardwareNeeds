import { NextResponse } from "next/server";
import type { AiMessage, AssistantContext, AssistantResponse } from "@/lib/ai/types";
import { buildFacts } from "@/lib/ai/facts";
import { answerDeterministic } from "@/lib/ai/deterministic";
import { getServerAiProvider } from "@/lib/ai/server/openai-provider";

// Needs process.env + a real network call to OpenAI — the Node runtime, not Edge.
export const runtime = "nodejs";

/**
 * The single orchestration point for every AI-touching surface in the app:
 * quick-start follow-ups, product Q&A, Compare, Compatibility, and the
 * global assistant. Pipeline, every time:
 *
 *   1. Run the deterministic engine (goal-match + recommend + compatibility
 *      data) to get a grounded draft answer — this is the ONLY thing that
 *      ever picks/changes actual products, regardless of live/fallback mode.
 *   2. If OPENAI_API_KEY is configured, hand that draft + the real catalog
 *      facts to the live model to phrase a more natural reply.
 *   3. If no key is configured, or the live call fails for any reason,
 *      return the deterministic draft directly and mark the response
 *      "fallback" — never "live".
 */

function buildSystemPrompt(facts: string, draft: string): string {
  return [
    "You are the HardwareNeeds recommendation assistant, embedded directly in the HardwareNeeds website. Answer conversationally and concisely — usually 2 to 5 sentences unless the user clearly wants more detail.",
    "Ground every HardwareNeeds-specific claim (prices, specs, compatibility, VRAM, wattage, which product was recommended) ONLY in the verified facts below. Never invent a HardwareNeeds product, price, spec, or compatibility claim that isn't listed there. If asked about something not covered, say HardwareNeeds doesn't currently have a verified value for that instead of guessing.",
    "You may use general, well-established computer hardware knowledge to explain concepts (e.g. what PCIe or VRAM is, how sockets work) even if that exact explanation isn't in the facts below — but never use general knowledge to state a specific price, spec, or compatibility claim about a HardwareNeeds catalog item.",
    "A deterministic system already computed a grounded draft answer below. You may use it as-is, improve its wording, or add relevant color from the facts — but do not contradict it, and do not claim a different product was recommended than the draft states.",
    "",
    "VERIFIED FACTS FROM THE HARDWARENEEDS CATALOG:",
    facts,
    "",
    `DETERMINISTIC DRAFT ANSWER: ${draft}`,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: { context?: AssistantContext; question?: string; history?: AiMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const context: AssistantContext = body.context ?? { kind: "general" };
  const question = String(body.question ?? "").slice(0, 800).trim();
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  const deterministic = await answerDeterministic(context, question, history);
  const provider = getServerAiProvider();

  if (provider) {
    try {
      const facts = buildFacts(context);
      const systemPrompt = buildSystemPrompt(facts, deterministic.message);
      const messages = [...history, { role: "user" as const, content: question }].map((m) => ({
        role: m.role,
        content: m.content.slice(0, 2000),
      }));
      const liveMessage = await provider.respond(systemPrompt, messages);
      const response: AssistantResponse = {
        message: liveMessage,
        mode: "live",
        updatedRecommendations: deterministic.updatedRecommendations,
        updatedAnswers: deterministic.updatedAnswers,
      };
      return NextResponse.json(response);
    } catch (error) {
      console.error("HardwareNeeds AI: live call failed, falling back to deterministic answer.", error);
    }
  }

  const response: AssistantResponse = {
    message: deterministic.message,
    mode: "fallback",
    updatedRecommendations: deterministic.updatedRecommendations,
    updatedAnswers: deterministic.updatedAnswers,
  };
  return NextResponse.json(response);
}
