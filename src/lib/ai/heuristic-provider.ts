import type { HardwareProduct, PlanAnswers, Recommendation } from "@/lib/data/types";
import { goals, getGoal } from "@/lib/data/goals";
import { pickByTier, productsByCategory } from "@/lib/data/products";
import { categories, getCategory } from "@/lib/data/categories";
import { linksFor } from "@/lib/data/compatibility";
import { generateRecommendations } from "@/lib/data/recommend";
import type { AiFollowUpResponse, AiMessage, AiProvider, FollowUpContext, WorkloadProfile } from "./types";

/**
 * Deterministic, rule-based "AI" layer. No language model is called here —
 * there is no LLM API key configured in this environment, and per the
 * project's rules this app must never fabricate AI responses that appear
 * to come from a real model. Every answer below is built by pattern-
 * matching the question and then pulling real data (products, specs,
 * prices, reasoning) that the recommendation engine already produced.
 *
 * This is intentionally the *only* AiProvider implementation right now.
 * See index.ts for how a real model-backed provider would be wired in
 * later without changing any UI code.
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

function extractBudget(text: string): number | undefined {
  const match = text.match(/\$\s?([\d,]{2,7})(?:\.\d+)?|([\d,]{3,7})\s?(?:dollars|usd|bucks)/i);
  const raw = match?.[1] ?? match?.[2];
  if (!raw) return undefined;
  const value = Number(raw.replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function findSpec(product: { specs: { label: string; value: string }[] } | undefined, labelPart: string) {
  return product?.specs.find((s) => s.label.toLowerCase().includes(labelPart.toLowerCase()))?.value;
}

function interpretRequest(text: string): WorkloadProfile {
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

function pickCostliestCategory(recommendations: Recommendation[]): Recommendation | undefined {
  return [...recommendations].sort((a, b) => b.product.priceUSD - a.product.priceUSD)[0];
}

async function answerFollowUp(
  context: FollowUpContext,
  question: string,
  _history: AiMessage[],
): Promise<AiFollowUpResponse> {
  const q = question.toLowerCase();
  const goal = getGoal(context.goalId);
  if (!goal) {
    return { message: "I don't have an active build to work from — start a plan first." };
  }

  // "What if my budget increases to $X" / "budget of $X"
  const newBudget = extractBudget(question);
  if (newBudget && /(budget|spend|increase|afford)/i.test(question)) {
    const updatedAnswers: PlanAnswers = { ...context.answers, budget: newBudget };
    const updated = generateRecommendations(context.goalId, updatedAnswers);
    const newTotal = updated.reduce((s, r) => s + r.product.priceUSD, 0);
    return {
      message: `With a $${newBudget.toLocaleString("en-US")} budget, here's the updated build — new estimated total is $${newTotal.toLocaleString("en-US")}.`,
      updatedRecommendations: updated,
      updatedAnswers,
    };
  }

  // "Why did you pick this / why this GPU / why [category]"
  if (/^why\b/.test(q.trim()) || q.includes("why did you") || q.includes("why this")) {
    const mentionedCategory = context.recommendations.find((r) => {
      const category = getCategory(r.categoryId);
      return category && q.includes(category.name.toLowerCase());
    });
    const target = mentionedCategory ?? context.recommendations[0];
    if (!target) return { message: "I don't have a recommendation to explain yet." };
    const category = getCategory(target.categoryId);
    return {
      message: `${category?.name ?? "This part"} — ${target.product.brand} ${target.product.name}: ${target.reasoning.join(" ")}`,
    };
  }

  // "Can I save $X" / "cheaper" / "reduce cost" / "lower budget"
  if (/(save|cheaper|less expensive|reduce cost|lower (the )?(price|budget|cost))/i.test(q)) {
    const costliest = pickCostliestCategory(context.recommendations);
    if (!costliest) return { message: "There's no build to trim yet — generate a recommendation first." };
    const category = getCategory(costliest.categoryId);
    const cheaperOptions = productsByCategory(costliest.categoryId)
      .filter((p) => p.priceUSD < costliest.product.priceUSD)
      .sort((a, b) => b.priceUSD - a.priceUSD);
    const cheaper = cheaperOptions[0];
    if (!cheaper) {
      return { message: `${category?.name ?? "That part"} is already the most affordable option in the catalog for this category.` };
    }
    const savings = costliest.product.priceUSD - cheaper.priceUSD;
    return {
      message: `Swapping the ${category?.name ?? "part"} from ${costliest.product.name} to ${cheaper.brand} ${cheaper.name} saves about $${savings.toLocaleString("en-US")}. ${cheaper.summary}`,
    };
  }

  // "More VRAM" / "more memory"
  if (/(more vram|more (video )?memory)/i.test(q)) {
    const gpuRec = context.recommendations.find((r) => r.categoryId === "gpu");
    if (!gpuRec) return { message: "This build doesn't include a GPU to upgrade." };
    const currentVram = findSpec(gpuRec.product, "vram");
    const higher = productsByCategory("gpu")
      .filter((p) => p.priceUSD > gpuRec.product.priceUSD)
      .sort((a, b) => a.priceUSD - b.priceUSD)[0];
    if (!higher) return { message: `${gpuRec.product.name} already has the most VRAM available in the catalog for this tier.` };
    const higherVram = findSpec(higher, "vram");
    return {
      message: `${higher.brand} ${higher.name} steps up from ${currentVram ?? "the current VRAM"} to ${higherVram ?? "more VRAM"} for about $${(higher.priceUSD - gpuRec.product.priceUSD).toLocaleString("en-US")} more.`,
    };
  }

  // "AMD instead" / "Intel instead" / "NVIDIA instead"
  const brandMatch = question.match(/\b(AMD|Intel|NVIDIA|Nvidia)\b/);
  if (brandMatch && /instead|switch|change/i.test(q)) {
    const brand = brandMatch[1].toUpperCase() === "NVIDIA" ? "NVIDIA" : brandMatch[1][0].toUpperCase() + brandMatch[1].slice(1).toLowerCase();
    const target = context.recommendations.find((r) => ["cpu", "gpu"].includes(r.categoryId) && r.product.brand !== brand);
    if (!target) return { message: `The current build doesn't have a ${brand} alternative to swap in for that category.` };
    const category = getCategory(target.categoryId);
    const swap = productsByCategory(target.categoryId).find((p) => p.brand === brand);
    if (!swap) {
      return { message: `There's no ${brand} option in the ${category?.name ?? "that"} category in the catalog yet.` };
    }
    return {
      message: `${swap.brand} ${swap.name} is the closest ${brand} alternative for ${category?.name ?? "this part"} — ${swap.summary}`,
    };
  }

  // "Quieter" / "less noise"
  if (/(quiet|less noise|noise level)/i.test(q)) {
    const cooler = context.recommendations.find((r) => r.categoryId === "cooler");
    if (cooler) {
      const noise = findSpec(cooler.product, "noise");
      return {
        message: noise
          ? `${cooler.product.name} is rated at ${noise}. Liquid coolers and larger air towers generally run quieter under load than compact single-fan coolers.`
          : `For a quieter build, prioritize a larger air cooler or an AIO liquid cooler over compact options, and lower-RPM case fans.`,
      };
    }
    return { message: "For quieter operation generally: larger coolers and fans moving air more slowly beat small ones spinning fast." };
  }

  // "Upgrade path" / "future-proof"
  if (/(upgrade path|future.?proof|later)/i.test(q)) {
    const withNotes = context.recommendations.filter((r) => r.product.upgradeNote);
    if (withNotes.length === 0) return { message: "No specific upgrade notes are available for this build's parts yet." };
    return {
      message: withNotes.map((r) => `${getCategory(r.categoryId)?.name}: ${r.product.upgradeNote}`).join(" "),
    };
  }

  // "Smaller" / "compact" / "small form factor"
  if (/(smaller|compact|small form factor|sff|mini)/i.test(q)) {
    const caseRec = context.recommendations.find((r) => r.categoryId === "case");
    const smallerCase = productsByCategory("case").find(
      (p) => p.id !== caseRec?.product.id && /mini-itx|micro-atx|compact/i.test(p.specs.map((s) => s.value).join(" ") + p.name),
    );
    if (smallerCase) {
      return {
        message: `${smallerCase.brand} ${smallerCase.name} is a more compact option in the catalog — check its max GPU length and cooler height against the rest of this build before switching.`,
      };
    }
    return { message: "A smaller case is possible, but double-check GPU length and cooler height clearance before switching — the catalog doesn't have a confirmed smaller fit for this exact build yet." };
  }

  // "Care more about gaming" / shift priority toward performance
  if (/(care more about|prioritize|focus on) (gaming|performance)/i.test(q)) {
    const updatedAnswers: PlanAnswers = { ...context.answers, performancePreference: "performance" };
    const updated = generateRecommendations(context.goalId, updatedAnswers);
    return {
      message: "Shifted toward maximum performance within your existing budget — here's the updated build.",
      updatedRecommendations: updated,
      updatedAnswers,
    };
  }

  // "Make this build cheaper" (whole-build value pass)
  if (/(make (this|it) cheaper|value build|best value)/i.test(q)) {
    const updatedAnswers: PlanAnswers = { ...context.answers, performancePreference: "value" };
    const updated = generateRecommendations(context.goalId, updatedAnswers);
    const newTotal = updated.reduce((s, r) => s + r.product.priceUSD, 0);
    return {
      message: `Re-weighted toward value across the whole build — new estimated total is $${newTotal.toLocaleString("en-US")}.`,
      updatedRecommendations: updated,
      updatedAnswers,
    };
  }

  const examplePrompts = [
    "Can I save $200?",
    "What if my budget increases to $2,000?",
    "Give me a quieter build",
    "Why did you pick this GPU?",
    "Can I use AMD instead?",
  ];
  return {
    message: `I didn't quite catch a build change in that — try something like: "${examplePrompts[Math.floor(Math.random() * examplePrompts.length)]}"`,
  };
}

const productAiExamplePrompts = [
  "Is this enough for gaming?",
  "Can this run a local LLM?",
  "What should I pair with this?",
  "Is there a cheaper alternative?",
];

/**
 * Answers a question about one specific product page — grounded entirely in
 * that product's real specs, its catalog neighbors, and the declarative
 * compatibility relationships in compatibility.ts. Never invents a spec,
 * price, or pairing that isn't already in the catalog.
 */
async function answerAboutProduct(product: HardwareProduct, question: string): Promise<string> {
  const q = question.toLowerCase();
  const category = getCategory(product.categoryId);
  const categoryName = category?.name ?? "this category";

  if (/gaming/.test(q) && /(enough|good|ready|is this|can (it|this))/.test(q)) {
    const gamingReady = (product.useCases ?? []).includes("gaming");
    return gamingReady
      ? `Yes — ${product.name} is catalogued as gaming-ready. ${product.summary}`
      : `${product.name} isn't tagged for gaming in the catalog. Check the ${categoryName} directory and filter by "Gaming" to see options that are.`;
  }

  if (/(local llm|run.*model|local ai|inference|large language model)/.test(q)) {
    const vram = findSpec(product, "vram");
    if (vram) {
      const num = Number(vram.match(/\d+/)?.[0]);
      const sizeGuess =
        num >= 20 ? "larger (30B+) models with quantization" : num >= 12 ? "mid-sized (7B-13B) models comfortably" : "smaller (7B and under) models, usually quantized";
      return `${product.name} has ${vram} of VRAM, which generally supports ${sizeGuess}. VRAM is the main ceiling for local model size, more than any other spec.`;
    }
    return `${product.name} doesn't have a VRAM spec on file, so it isn't the right part to judge local-AI capability by — that's mainly a GPU question.`;
  }

  if (/cheaper|less expensive|lower price|budget option|cheaper alternative/.test(q)) {
    const cheaper = productsByCategory(product.categoryId)
      .filter((p) => p.id !== product.id && p.priceUSD < product.priceUSD)
      .sort((a, b) => b.priceUSD - a.priceUSD)[0];
    if (!cheaper) return `${product.name} is already the most affordable ${categoryName} option in the catalog.`;
    const savings = product.priceUSD - cheaper.priceUSD;
    return `${cheaper.brand} ${cheaper.name} is about $${savings.toLocaleString("en-US")} cheaper — ${cheaper.summary}`;
  }

  if (/pair|goes (well )?with|match(es)? with|what (should i|.* should i)/.test(q)) {
    const mentioned = categories.find((c) => c.id !== product.categoryId && q.includes(c.name.toLowerCase()));
    const links = linksFor(product.categoryId);
    const linkedId = links[0] ? (links[0].from === product.categoryId ? links[0].to : links[0].from) : undefined;
    const targetId = mentioned?.id ?? linkedId;
    const targetCategory = targetId ? getCategory(targetId) : undefined;
    const pick = targetId ? pickByTier(targetId, product.tier) ?? productsByCategory(targetId)[0] : undefined;
    if (pick && targetCategory) {
      return `${pick.brand} ${pick.name} is a solid ${targetCategory.name} match at a similar tier to ${product.name}. Check the Compatibility page for the specific requirement this pairing needs to satisfy.`;
    }
    return `There's no specific compatible pairing on file for ${categoryName} yet — the Compatibility page lists what it needs to work with.`;
  }

  if (/strength|good at|best (for|at)/.test(q)) {
    return product.strengths.length > 0
      ? `${product.name}'s real strengths: ${product.strengths.join("; ")}.`
      : `No specific strengths are noted for ${product.name} yet.`;
  }

  if (/limitation|weakness|downside|con(s)?\b|worse at/.test(q)) {
    return product.considerations.length > 0
      ? `Worth knowing: ${product.considerations.join("; ")}.`
      : `No specific limitations are noted for ${product.name} yet.`;
  }

  return `I didn't catch a specific question there — try something like: "${productAiExamplePrompts[Math.floor(Math.random() * productAiExamplePrompts.length)]}"`;
}

export const heuristicAiProvider: AiProvider = {
  id: "heuristic-v1",
  label: "HardwareNeeds Recommendation Assistant",
  isGenerativeModel: false,
  interpretRequest,
  answerFollowUp,
  answerAboutProduct,
};

/** Exposed for the Plan quick-start UI, which needs the full goal list to fall back on. */
export const knownGoalIds = goals.map((g) => g.id);
