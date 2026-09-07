import { goals, getGoal } from "@/lib/data/goals";
import type { WorkloadProfile } from "./types";

/**
 * Local, instant keyword matching from free text to a HardwareNeeds goal —
 * no network call, no model. Used by the Plan quick-start box so typing a
 * description feels immediate, and reused by the deterministic assistant
 * fallback to ground "what should I build for $X" style questions in a real
 * generated recommendation instead of general chat.
 */

const goalKeywords: Record<string, string[]> = {
  gaming: ["gaming", "video games", "play games", "games", "esports", "fps games"],
  "ai-ml": [
    "machine learning", "local llm", "local ai", "local model", "local models", "ai model", "ai models",
    "fine-tuning", "fine tuning", "data science", "artificial intelligence", "inference", "cuda",
    "stable diffusion", "chatbot", "neural network", "llm", " ai ", " ai,", " ai.",
  ],
  "video-editing": ["video editing", "edit video", "premiere pro", "davinci resolve", "editing footage"],
  "3d-rendering": ["3d rendering", "blender", "cinema 4d", "archviz", "3d modeling"],
  programming: ["programming", "software development", "coding", "compiling code", "dev environment", "developer"],
  "home-server": ["home server", "self-hosting", "self hosted", "home lab", "homelab", "plex server", "jellyfin"],
  streaming: ["live streaming", "streaming on twitch", "twitch", "obs studio"],
  school: ["schoolwork", "for school", "student", "homework", "college classes"],
  networking: ["home network", "wifi coverage", "mesh wifi", "router upgrade"],
  workstation: ["workstation", "engineering software", "cad software", "simulation software"],
  "content-creation": ["content creation", "youtube videos", "podcast production", "photo editing"],
};

/** Downweight a match that's clearly framed as secondary/occasional rather than the main goal. */
const CASUAL_QUALIFIER = /\b(occasional|occasionally|sometimes|a bit of|a little|light|casual)\s+\w*\s*$/i;

function keywordWeight(text: string, keyword: string): number {
  const idx = text.indexOf(keyword);
  if (idx === -1) return 0;
  const before = text.slice(Math.max(0, idx - 24), idx);
  const casual = CASUAL_QUALIFIER.test(before) ? 0.4 : 1;
  // Longer, more specific phrases are stronger signals than short generic words.
  return keyword.trim().length * casual;
}

export function extractBudget(text: string): number | undefined {
  const match = text.match(/\$\s?([\d,]{2,7})(?:\.\d+)?|([\d,]{3,7})\s?(?:dollars|usd|bucks)/i);
  const raw = match?.[1] ?? match?.[2];
  if (!raw) return undefined;
  const value = Number(raw.replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function interpretRequest(text: string): WorkloadProfile {
  // Padded so " ai " style boundary keywords can match at sentence edges too.
  const lower = ` ${text.toLowerCase()} `;
  const budget = extractBudget(text);

  const scores = new Map<string, number>();
  const matchedKeywords: string[] = [];
  for (const [goalId, keywords] of Object.entries(goalKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      const weight = keywordWeight(lower, kw);
      if (weight > 0) {
        score += weight;
        matchedKeywords.push(kw.trim());
      }
    }
    if (score > 0) scores.set(goalId, score);
  }

  let goalId: string | undefined;
  let best = 0;
  for (const [id, score] of scores) {
    if (score > best) {
      best = score;
      goalId = id;
    }
  }

  const goal = goalId ? getGoal(goalId) : undefined;
  const parts: string[] = [];
  parts.push(goal ? `Closest match: ${goal.label}.` : "I couldn't confidently match this to one specific goal.");
  if (budget) parts.push(`Budget noted around $${budget.toLocaleString("en-US")}.`);
  if (!goal) parts.push("Pick the closest goal below and I'll narrow it down from there.");

  return {
    goalId,
    budget,
    workloadKeywords: Array.from(new Set(matchedKeywords)),
    raw: text,
    summary: parts.join(" "),
  };
}

/** Exposed for the Plan quick-start UI, which needs the full goal list to fall back on. */
export const knownGoalIds = goals.map((g) => g.id);
