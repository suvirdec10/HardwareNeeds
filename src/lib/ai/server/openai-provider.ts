/**
 * The live provider implementation. This file must only ever be imported by
 * the server route handler (src/app/api/ai/assistant/route.ts), which runs
 * exclusively in the Node runtime — never by a "use client" component, or
 * OPENAI_API_KEY would end up in browser JS. There is nothing here a client
 * component would ever need directly; every UI touchpoint talks to the API
 * route over fetch instead (see src/lib/ai/client.ts).
 *
 * This is intentionally the one concrete "real model" implementation
 * (per the project brief: OpenAI first). A future Anthropic (or other)
 * provider would be a sibling file with the same tiny interface, selected
 * in getServerAiProvider() below by checking for its own API key — nothing
 * else in the app would need to change.
 */

export interface ServerAiProvider {
  readonly id: string;
  /** Sends a system prompt + conversation to the model, returns its reply text. */
  respond(systemPrompt: string, messages: { role: "user" | "assistant"; content: string }[]): Promise<string>;
}

const DEFAULT_MODEL = "gpt-4o-mini";

class OpenAiProvider implements ServerAiProvider {
  readonly id = "openai";

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async respond(systemPrompt: string, messages: { role: "user" | "assistant"; content: string }[]): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 300)}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("OpenAI returned an empty response");
    return content;
  }
}

/**
 * Returns the live provider if a key is configured, else null — the caller
 * (the API route) is expected to fall back to the deterministic answer
 * source when this is null, or when a call to it throws.
 */
export function getServerAiProvider(): ServerAiProvider | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  return new OpenAiProvider(apiKey, model);
}
