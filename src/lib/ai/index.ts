import { heuristicAiProvider } from "./heuristic-provider";
import type { AiProvider } from "./types";

export * from "./types";

/**
 * Single entry point the UI should import from — never import a provider
 * implementation directly.
 *
 * Today this always returns the deterministic, rule-based provider: no
 * LLM API key is configured in this environment, and the project's rules
 * are explicit that the app must not fake a real model. When a real
 * provider is connected later (e.g. reading an `AI_PROVIDER_API_KEY` env
 * var and calling an actual model), swap the return value here — the rest
 * of the app only depends on the `AiProvider` interface, so nothing else
 * needs to change.
 */
export function getAiProvider(): AiProvider {
  return heuristicAiProvider;
}
