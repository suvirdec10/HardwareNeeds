import { NextResponse } from "next/server";
import type { AssistantContext } from "@/lib/ai/types";
import { buildFacts } from "@/lib/ai/facts";
import { suggestImprovements } from "@/lib/ai/deterministic";
import { getServerAiProvider } from "@/lib/ai/server/openai-provider";

export const runtime = "nodejs";

/**
 * Powers the "AI Suggestions" section on completed Plan results. Always
 * starts from suggestImprovements() — real, score/spec-derived sentences,
 * never invented — then, if a live provider is configured, asks it to
 * tighten the wording into a clean 3-5 item list without adding new claims.
 */
export async function POST(request: Request) {
  let body: { context?: AssistantContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const context = body.context;
  if (!context || context.kind !== "plan") {
    return NextResponse.json({ error: "suggestions requires a plan context" }, { status: 400 });
  }

  const draft = suggestImprovements(context);
  if (draft.length === 0) {
    return NextResponse.json({ suggestions: [], mode: "fallback" });
  }

  const provider = getServerAiProvider();
  if (!provider) {
    return NextResponse.json({ suggestions: draft, mode: "fallback" });
  }

  try {
    const facts = buildFacts(context);
    const systemPrompt = [
      "You are the HardwareNeeds recommendation assistant. Rewrite the draft suggestions below into 3 to 5 short, practical, standalone suggestions for improving this build.",
      "Each suggestion must be based ONLY on the verified facts and draft suggestions below — do not add a new claim, price, spec, or product that isn't already present in them.",
      "Reply with ONLY the suggestions, one per line, no numbering, no bullets, no preamble.",
      "",
      "VERIFIED FACTS:",
      facts,
      "",
      "DRAFT SUGGESTIONS:",
      draft.map((d) => `- ${d}`).join("\n"),
    ].join("\n");

    const reply = await provider.respond(systemPrompt, [{ role: "user", content: "Rewrite the suggestions." }]);
    const lines = reply
      .split("\n")
      .map((l) => l.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    if (lines.length === 0) {
      return NextResponse.json({ suggestions: draft, mode: "fallback" });
    }
    return NextResponse.json({ suggestions: lines, mode: "live" });
  } catch (error) {
    console.error("HardwareNeeds AI: live suggestions call failed, using deterministic draft.", error);
    return NextResponse.json({ suggestions: draft, mode: "fallback" });
  }
}
