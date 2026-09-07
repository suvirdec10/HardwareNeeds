import type { Goal, PlanAnswers, ProductTier, Recommendation } from "./types";
import { pickByTier, productsByCategory } from "./products";
import { getGoal } from "./goals";

const tierOrder: ProductTier[] = ["essential", "balanced", "performance"];

function clampTier(index: number): ProductTier {
  return tierOrder[Math.max(0, Math.min(tierOrder.length - 1, index))];
}

function asString(v: string | string[] | number | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return typeof v === "number" ? String(v) : v ?? "";
}

/** Base tier from budget, nudged by stated performance preference. */
function baseTier(answers: PlanAnswers): ProductTier {
  const budget = typeof answers.budget === "number" ? answers.budget : 1500;
  let index = budget < 1000 ? 0 : budget < 2500 ? 1 : 2;

  const pref = asString(answers.performancePreference);
  if (pref === "value") index -= 1;
  if (pref === "performance") index += 1;

  return clampTier(index);
}

/** Per-category tier nudges based on goal-specific answers. */
function categoryOverride(
  goalId: string,
  categoryId: string,
  answers: PlanAnswers,
  fallback: ProductTier,
): ProductTier {
  let index = tierOrder.indexOf(fallback);

  if (goalId === "gaming") {
    const res = asString(answers.resolution);
    const refresh = asString(answers.refreshRate);
    if (["gpu", "monitor"].includes(categoryId)) {
      if (res === "4k") index = Math.max(index, 2);
      else if (res === "1440p") index = Math.max(index, 1);
      if (refresh === "max") index = Math.min(2, index + 1);
    }
  }

  if (goalId === "video-editing" || goalId === "content-creation") {
    const res = asString(answers.resolution);
    const complexity = asString(answers.complexity);
    if (["gpu", "cpu", "ram"].includes(categoryId)) {
      if (res === "8k" || complexity === "heavy") index = Math.max(index, 2);
      else if (res === "4k" || complexity === "moderate") index = Math.max(index, 1);
    }
    if (categoryId === "storage") {
      const need = asString(answers.storageNeeds);
      if (need === "huge") index = Math.max(index, 2);
      else if (need === "large") index = Math.max(index, 1);
    }
  }

  if (goalId === "3d-rendering") {
    const complexity = asString(answers.sceneComplexity);
    if (["gpu", "cpu", "ram"].includes(categoryId)) {
      if (complexity === "heavy") index = Math.max(index, 2);
      else if (complexity === "moderate") index = Math.max(index, 1);
    }
  }

  if (goalId === "home-server" && categoryId === "storage") {
    const amount = asString(answers.storageAmount);
    if (amount === "large") index = Math.max(index, 2);
    else if (amount === "medium") index = Math.max(index, 1);
  }

  if (goalId === "programming") {
    const env = asString(answers.environments);
    if (categoryId === "ram" || categoryId === "cpu") {
      if (env === "heavy") index = Math.max(index, 2);
      else if (env === "moderate") index = Math.max(index, 1);
    }
  }

  return clampTier(index);
}

function reasoningFor(
  goal: Goal,
  categoryId: string,
  answers: PlanAnswers,
  picks: Map<string, { name: string }>,
): string[] {
  const reasons: string[] = [];
  const goalLabel = goal.label.toLowerCase();

  switch (categoryId) {
    case "gpu": {
      const res = asString(answers.resolution) || "your target resolution";
      reasons.push(`You're building for ${goalLabel}, targeting ${res === "your target resolution" ? res : res.toUpperCase()}.`);
      reasons.push("That resolution and workload set the floor for how much GPU performance and VRAM you actually need.");
      reasons.push("This GPU comfortably covers that target with room to keep settings high rather than scraping by.");
      break;
    }
    case "cpu": {
      reasons.push(`For ${goalLabel}, the CPU needs to keep up with the GPU and any background work without becoming the limiting factor.`);
      reasons.push("This tier balances single-core speed and core count for what you described.");
      break;
    }
    case "ram": {
      reasons.push(`${goal.label} workloads determine how much can comfortably stay in fast memory at once.`);
      reasons.push("This capacity avoids the system falling back to slow storage swaps during normal use.");
      break;
    }
    case "storage": {
      reasons.push("Capacity and speed are sized to your stated project/library needs, not just the OS.");
      break;
    }
    case "motherboard": {
      const cpu = picks.get("cpu");
      reasons.push(cpu ? `Matches the socket and chipset needed for ${cpu.name}.` : "Matches the socket and chipset needed for your CPU.");
      reasons.push("Supports the RAM type and speed selected above.");
      break;
    }
    case "psu": {
      const gpu = picks.get("gpu");
      reasons.push(
        gpu
          ? `Sized with headroom above ${gpu.name}'s rated draw, plus the rest of the system.`
          : "Sized with headroom above your system's combined power draw.",
      );
      break;
    }
    case "cooler": {
      const cpu = picks.get("cpu");
      reasons.push(
        cpu
          ? `Rated to keep ${cpu.name} within safe temperatures under sustained ${goalLabel} workloads.`
          : "Rated to keep your CPU within safe temperatures under sustained load.",
      );
      break;
    }
    case "case": {
      const gpu = picks.get("gpu");
      reasons.push(gpu ? `Has clearance for ${gpu.name} and the cooler recommended alongside it.` : "Sized to fit the rest of this recommendation.");
      break;
    }
    case "monitor": {
      const res = asString(answers.resolution);
      reasons.push(res ? `Matches the ${res.toUpperCase()} resolution you're targeting.` : "Matched to the GPU recommended above so neither component is wasted.");
      break;
    }
    default: {
      reasons.push(`Selected to support your ${goalLabel} setup based on what you told us.`);
    }
  }

  return reasons;
}

export function generateRecommendations(goalId: string, answers: PlanAnswers): Recommendation[] {
  const goal = getGoal(goalId);
  if (!goal) return [];

  const base = baseTier(answers);
  const results: Recommendation[] = [];
  const picks = new Map<string, { name: string }>();

  // Resolve in an order that lets later reasoning reference earlier picks.
  const order = ["cpu", "gpu", "ram", "storage", "motherboard", "cooler", "psu", "case", "monitor"];
  const orderedCategories = [
    ...order.filter((c) => goal.focusCategories.includes(c)),
    ...goal.focusCategories.filter((c) => !order.includes(c)),
  ];

  for (const categoryId of orderedCategories) {
    const tier = categoryOverride(goal.id, categoryId, answers, base);
    const product = pickByTier(categoryId, tier);
    if (!product) continue;
    picks.set(categoryId, { name: product.name });

    const alternatives = productsByCategory(categoryId).filter((p) => p.id !== product.id);
    const alternative =
      alternatives.find((p) => p.tier === tierOrder[Math.min(2, tierOrder.indexOf(tier) + 1)]) ?? alternatives[0];

    results.push({
      categoryId,
      product,
      role: roleLabel(categoryId),
      reasoning: reasoningFor(goal, categoryId, answers, picks),
      alternative,
    });
  }

  return results;
}

function roleLabel(categoryId: string): string {
  const labels: Record<string, string> = {
    cpu: "Handles instruction execution and single/multi-core workloads.",
    gpu: "Renders graphics and accelerates parallel workloads.",
    ram: "Holds active data for fast access by the CPU/GPU.",
    storage: "Stores your OS, applications, and files.",
    motherboard: "Connects every component and defines compatibility.",
    psu: "Delivers stable power to every component.",
    cooler: "Keeps the CPU within safe operating temperatures.",
    case: "Houses and physically supports the whole build.",
    monitor: "Displays the output your GPU renders.",
  };
  return labels[categoryId] ?? "Supports your setup.";
}
