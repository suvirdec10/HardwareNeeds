import type { HardwareProduct, PlanAnswers } from "@/lib/data/types";
import { getGoal } from "@/lib/data/goals";
import { pickByTier, productsByCategory } from "@/lib/data/products";
import { categories, getCategory } from "@/lib/data/categories";
import { linksFor, linkBetween } from "@/lib/data/compatibility";
import { generateRecommendations } from "@/lib/data/recommend";
import { compareCallouts } from "@/lib/data/compare-insights";
import { interpretRequest, extractBudget } from "./goal-match";
import type { AiMessage, AssistantContext } from "./types";

/**
 * The deterministic answer source — no model call, ever. Every response is
 * built by pattern-matching the question and then reading real data
 * (products, specs, prices, scores, compatibility rules) already produced
 * by the recommendation/compatibility engines. This is what runs when no
 * live provider is configured, and it's also what silently backstops a
 * failed live call — see src/app/api/ai/assistant/route.ts.
 */

export interface DeterministicResult {
  message: string;
  updatedRecommendations?: import("@/lib/data/types").Recommendation[];
  updatedAnswers?: PlanAnswers;
}

function findSpec(product: HardwareProduct | undefined, labelPart: string) {
  return product?.specs.find((s) => s.label.toLowerCase().includes(labelPart.toLowerCase()))?.value;
}

function firstNumber(value: string | undefined): number | undefined {
  const match = value?.match(/(\d+(?:,\d{3})*)/);
  return match ? Number(match[1].replace(/,/g, "")) : undefined;
}

function pickCostliest<T extends { product: HardwareProduct }>(recs: T[]): T | undefined {
  return [...recs].sort((a, b) => b.product.priceUSD - a.product.priceUSD)[0];
}

// ---------------------------------------------------------------------------
// Plan context
// ---------------------------------------------------------------------------

async function answerPlan(
  context: Extract<AssistantContext, { kind: "plan" }>,
  question: string,
): Promise<DeterministicResult> {
  const q = question.toLowerCase();
  const goal = getGoal(context.goalId);
  if (!goal) return { message: "I don't have an active build to work from — start a plan first." };

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

  if (/^why\b/.test(q.trim()) || q.includes("why did you") || q.includes("why this")) {
    const mentioned = context.recommendations.find((r) => {
      const category = getCategory(r.categoryId);
      return category && q.includes(category.name.toLowerCase());
    });
    const target = mentioned ?? context.recommendations[0];
    if (!target) return { message: "I don't have a recommendation to explain yet." };
    const category = getCategory(target.categoryId);
    return { message: `${category?.name ?? "This part"} — ${target.product.brand} ${target.product.name}: ${target.reasoning.join(" ")}` };
  }

  if (/(save|cheaper|less expensive|reduce cost|lower (the )?(price|budget|cost))/i.test(q)) {
    const costliest = pickCostliest(context.recommendations);
    if (!costliest) return { message: "There's no build to trim yet — generate a recommendation first." };
    const category = getCategory(costliest.categoryId);
    const cheaper = productsByCategory(costliest.categoryId)
      .filter((p) => p.priceUSD < costliest.product.priceUSD)
      .sort((a, b) => b.priceUSD - a.priceUSD)[0];
    if (!cheaper) return { message: `${category?.name ?? "That part"} is already the most affordable option in the catalog for this category.` };
    const savings = costliest.product.priceUSD - cheaper.priceUSD;
    return { message: `Swapping the ${category?.name ?? "part"} from ${costliest.product.name} to ${cheaper.brand} ${cheaper.name} saves about $${savings.toLocaleString("en-US")}. ${cheaper.summary}` };
  }

  if (/(more vram|more (video )?memory)/i.test(q)) {
    const gpuRec = context.recommendations.find((r) => r.categoryId === "gpu");
    if (!gpuRec) return { message: "This build doesn't include a GPU to upgrade." };
    const currentVram = findSpec(gpuRec.product, "vram");
    const higher = productsByCategory("gpu")
      .filter((p) => p.priceUSD > gpuRec.product.priceUSD)
      .sort((a, b) => a.priceUSD - b.priceUSD)[0];
    if (!higher) return { message: `${gpuRec.product.name} already has the most VRAM available in the catalog for this tier.` };
    const higherVram = findSpec(higher, "vram");
    return { message: `${higher.brand} ${higher.name} steps up from ${currentVram ?? "the current VRAM"} to ${higherVram ?? "more VRAM"} for about $${(higher.priceUSD - gpuRec.product.priceUSD).toLocaleString("en-US")} more.` };
  }

  const brandMatch = question.match(/\b(AMD|Intel|NVIDIA|Nvidia)\b/);
  if (brandMatch && /instead|switch|change/i.test(q)) {
    const brand = brandMatch[1].toUpperCase() === "NVIDIA" ? "NVIDIA" : brandMatch[1][0].toUpperCase() + brandMatch[1].slice(1).toLowerCase();
    const target = context.recommendations.find((r) => ["cpu", "gpu"].includes(r.categoryId) && r.product.brand !== brand);
    if (!target) return { message: `The current build doesn't have a ${brand} alternative to swap in for that category.` };
    const category = getCategory(target.categoryId);
    const swap = productsByCategory(target.categoryId).find((p) => p.brand === brand);
    if (!swap) return { message: `There's no ${brand} option in the ${category?.name ?? "that"} category in the catalog yet.` };
    return { message: `${swap.brand} ${swap.name} is the closest ${brand} alternative for ${category?.name ?? "this part"} — ${swap.summary}` };
  }

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

  if (/(improve ai performance|more ai power|ai workload)/i.test(q)) {
    const gpuRec = context.recommendations.find((r) => r.categoryId === "gpu");
    if (!gpuRec) return { message: "This build doesn't include a GPU — that's the main lever for AI performance." };
    const currentVram = findSpec(gpuRec.product, "vram");
    const higher = productsByCategory("gpu")
      .filter((p) => p.priceUSD > gpuRec.product.priceUSD)
      .sort((a, b) => a.priceUSD - b.priceUSD)[0];
    if (!higher) return { message: `${gpuRec.product.name} already has the strongest AI-relevant specs available in the catalog for this tier.` };
    const higherVram = findSpec(higher, "vram");
    return { message: `${higher.brand} ${higher.name} steps up from ${currentVram ?? "the current VRAM"} to ${higherVram ?? "more VRAM"} for about $${(higher.priceUSD - gpuRec.product.priceUSD).toLocaleString("en-US")} more — VRAM is the main ceiling for local AI/model work.` };
  }

  if (/(compare (with|to|against) (another|a different)|compare this build)/i.test(q)) {
    return { message: "I can't generate a second build inside this conversation yet — start a new plan with different answers (a different goal, budget, or preference), then use Compare on the individual parts to see the differences side by side." };
  }

  if (/(upgrade path|future.?proof|later|upgrade this|upgradeab)/i.test(q)) {
    const withNotes = context.recommendations.filter((r) => r.product.upgradeNote);
    if (withNotes.length === 0) return { message: "No specific upgrade notes are available for this build's parts yet." };
    return { message: withNotes.map((r) => `${getCategory(r.categoryId)?.name}: ${r.product.upgradeNote}`).join(" ") };
  }

  if (/(smaller|compact|small form factor|sff|mini)/i.test(q)) {
    const caseRec = context.recommendations.find((r) => r.categoryId === "case");
    const smallerCase = productsByCategory("case").find(
      (p) => p.id !== caseRec?.product.id && /mini-itx|micro-atx|compact/i.test(p.specs.map((s) => s.value).join(" ") + p.name),
    );
    if (smallerCase) return { message: `${smallerCase.brand} ${smallerCase.name} is a more compact option in the catalog — check its max GPU length and cooler height against the rest of this build before switching.` };
    return { message: "A smaller case is possible, but double-check GPU length and cooler height clearance before switching — the catalog doesn't have a confirmed smaller fit for this exact build yet." };
  }

  if (/(care more about|prioritize|focus on|improve) (gaming|performance)/i.test(q)) {
    const updatedAnswers: PlanAnswers = { ...context.answers, performancePreference: "performance" };
    const updated = generateRecommendations(context.goalId, updatedAnswers);
    return { message: "Shifted toward maximum performance within your existing budget — here's the updated build.", updatedRecommendations: updated, updatedAnswers };
  }

  if (/(make (this|it) cheaper|value build|best value|use less power|lower power)/i.test(q)) {
    const updatedAnswers: PlanAnswers = { ...context.answers, performancePreference: "value" };
    const updated = generateRecommendations(context.goalId, updatedAnswers);
    const newTotal = updated.reduce((s, r) => s + r.product.priceUSD, 0);
    return { message: `Re-weighted toward value and efficiency across the whole build — new estimated total is $${newTotal.toLocaleString("en-US")}.`, updatedRecommendations: updated, updatedAnswers };
  }

  if (/(more storage|bigger (ssd|drive)|more capacity)/i.test(q)) {
    const storageRec = context.recommendations.find((r) => r.categoryId === "storage");
    if (!storageRec) return { message: "This build doesn't include storage to expand yet." };
    const bigger = productsByCategory("storage")
      .filter((p) => p.priceUSD > storageRec.product.priceUSD)
      .sort((a, b) => a.priceUSD - b.priceUSD)[0];
    if (!bigger) return { message: `${storageRec.product.name} is already the largest storage option in the catalog for this tier.` };
    return { message: `${bigger.brand} ${bigger.name} steps up from ${findSpec(storageRec.product, "capacity") ?? "the current capacity"} to ${findSpec(bigger, "capacity") ?? "more capacity"} for about $${(bigger.priceUSD - storageRec.product.priceUSD).toLocaleString("en-US")} more.` };
  }

  if (/(alternative|other option|something else)/i.test(q)) {
    const target = pickCostliest(context.recommendations);
    if (!target) return { message: "There's no build to find alternatives for yet." };
    const category = getCategory(target.categoryId);
    const alt = productsByCategory(target.categoryId).find((p) => p.id !== target.product.id);
    if (!alt) return { message: `${category?.name ?? "That category"} only has one option in the catalog right now.` };
    return { message: `${alt.brand} ${alt.name} is a real alternative for ${category?.name ?? "that part"} — ${alt.summary}` };
  }

  if (/(explain (this|the) build|walk me through|summari[sz]e)/i.test(q)) {
    const parts = context.recommendations.map((r) => `${getCategory(r.categoryId)?.name}: ${r.product.brand} ${r.product.name}`).join(", ");
    return { message: `This ${goal.label.toLowerCase()} build is: ${parts}. Each part was picked from the catalog to fit your budget and workload, then checked for compatibility with the rest — see the reasoning under each card for the specifics.` };
  }

  const examplePrompts = ["Can I save $200?", "What if my budget increases to $2,000?", "Give me a quieter build", "Why did you pick this GPU?", "Can I use AMD instead?"];
  return { message: `I didn't quite catch a build change in that — try something like: "${examplePrompts[Math.floor(Math.random() * examplePrompts.length)]}"` };
}

// ---------------------------------------------------------------------------
// Product context
// ---------------------------------------------------------------------------

const productExamplePrompts = ["Is this enough for gaming?", "Can this run a local LLM?", "What should I pair with this?", "Is there a cheaper alternative?"];

async function answerProduct(context: Extract<AssistantContext, { kind: "product" }>, question: string): Promise<DeterministicResult> {
  const q = question.toLowerCase();
  const product = context.product;
  const category = getCategory(product.categoryId);
  const categoryName = category?.name ?? "this category";

  if (/gaming/.test(q) && /(enough|good|ready|is this|can (it|this))/.test(q)) {
    const gamingReady = (product.useCases ?? []).includes("gaming");
    return { message: gamingReady ? `Yes — ${product.name} is catalogued as gaming-ready. ${product.summary}` : `${product.name} isn't tagged for gaming in the catalog. Check the ${categoryName} directory and filter by "Gaming" to see options that are.` };
  }

  if (/(local llm|run.*model|local ai|inference|large language model)/.test(q)) {
    const vram = findSpec(product, "vram");
    if (vram) {
      const num = Number(vram.match(/\d+/)?.[0]);
      const sizeGuess = num >= 20 ? "larger (30B+) models with quantization" : num >= 12 ? "mid-sized (7B-13B) models comfortably" : "smaller (7B and under) models, usually quantized";
      return { message: `${product.name} has ${vram} of VRAM, which generally supports ${sizeGuess}. VRAM is the main ceiling for local model size, more than any other spec.` };
    }
    return { message: `${product.name} doesn't have a VRAM spec on file, so it isn't the right part to judge local-AI capability by — that's mainly a GPU question.` };
  }

  if (/cheaper|less expensive|lower price|budget option|cheaper alternative/.test(q)) {
    const cheaper = productsByCategory(product.categoryId)
      .filter((p) => p.id !== product.id && p.priceUSD < product.priceUSD)
      .sort((a, b) => b.priceUSD - a.priceUSD)[0];
    if (!cheaper) return { message: `${product.name} is already the most affordable ${categoryName} option in the catalog.` };
    const savings = product.priceUSD - cheaper.priceUSD;
    return { message: `${cheaper.brand} ${cheaper.name} is about $${savings.toLocaleString("en-US")} cheaper — ${cheaper.summary}` };
  }

  if (/(will this work|current build|my (pc|computer|build|system))/.test(q)) {
    return { message: `I can't check that without knowing what else is in your build — open Plan or Compatibility and select the other part(s) so I can check real specs against ${product.name}.` };
  }

  if (/(how long|useful|last|future.?proof)/.test(q)) {
    return { message: product.upgradeNote ? `On longevity: ${product.upgradeNote}` : `HardwareNeeds doesn't have a verified longevity note for ${product.name} yet.` };
  }

  if (/pair|goes (well )?with|match(es)? with|what (should i|.* should i)/.test(q)) {
    const mentioned = categories.find((c) => c.id !== product.categoryId && q.includes(c.name.toLowerCase()));
    const links = linksFor(product.categoryId);
    const linkedId = links[0] ? (links[0].from === product.categoryId ? links[0].to : links[0].from) : undefined;
    const targetId = mentioned?.id ?? linkedId;
    const targetCategory = targetId ? getCategory(targetId) : undefined;
    const pick = targetId ? (pickByTier(targetId, product.tier) ?? productsByCategory(targetId)[0]) : undefined;
    if (pick && targetCategory) return { message: `${pick.brand} ${pick.name} is a solid ${targetCategory.name} match at a similar tier to ${product.name}. Check the Compatibility page for the specific requirement this pairing needs to satisfy.` };
    return { message: `There's no specific compatible pairing on file for ${categoryName} yet — the Compatibility page lists what it needs to work with.` };
  }

  if (/strength|good at|best (for|at)/.test(q)) {
    return { message: product.strengths.length > 0 ? `${product.name}'s real strengths: ${product.strengths.join("; ")}.` : `No specific strengths are noted for ${product.name} yet.` };
  }

  if (/limitation|weakness|downside|con(s)?\b|worse at/.test(q)) {
    return { message: product.considerations.length > 0 ? `Worth knowing: ${product.considerations.join("; ")}.` : `No specific limitations are noted for ${product.name} yet.` };
  }

  const spec = product.specs.find((s) => q.includes(s.label.toLowerCase()));
  if (spec) return { message: `${spec.label} on ${product.name}: ${spec.value}.` };

  return { message: `I didn't catch a specific question there — try something like: "${productExamplePrompts[Math.floor(Math.random() * productExamplePrompts.length)]}"` };
}

// ---------------------------------------------------------------------------
// Compare context
// ---------------------------------------------------------------------------

async function answerCompare(context: Extract<AssistantContext, { kind: "compare" }>, question: string): Promise<DeterministicResult> {
  const q = question.toLowerCase();
  const { productA, productB, categoryId } = context;
  const callouts = compareCallouts(productA, productB, categoryId);
  const winnerName = (winner: "a" | "b") => (winner === "a" ? productA.name : productB.name);
  const find = (label: string) => callouts.find((c) => c.label.toLowerCase().includes(label));

  if (/power|watt|efficien/.test(q)) {
    const c = find("power draw");
    return { message: c ? `${winnerName(c.winner)} uses less power.` : `HardwareNeeds doesn't have a verified power-draw comparison for these two.` };
  }
  if (/upgrade/.test(q)) {
    const c = find("upgradeable");
    return { message: c ? `${winnerName(c.winner)} has the better upgrade path.` : `Neither has a clearly better upgrade path on file — check each product's Upgradeability note.` };
  }
  if (/gaming/.test(q)) {
    const c = find("gaming");
    return { message: c ? `${winnerName(c.winner)} is the one tagged for gaming.` : `Neither is specifically tagged for gaming over the other — compare the raw specs below.` };
  }
  if (/(ai|llm|local model)/.test(q)) {
    const c = find("ai") ?? find("vram");
    return { message: c ? `${winnerName(c.winner)} is the stronger pick for local AI work.` : `HardwareNeeds doesn't have enough on file to call this one for AI workloads — compare VRAM directly below.` };
  }
  if (/worth it|extra (cost|money)|more expensive/.test(q)) {
    const diff = Math.abs(productA.priceUSD - productB.priceUSD);
    const pricier = productA.priceUSD > productB.priceUSD ? productA : productB;
    const cheaper = pricier === productA ? productB : productA;
    const advantages = callouts.filter((c) => c.winner === (pricier === productA ? "a" : "b"));
    return {
      message: advantages.length > 0
        ? `${pricier.name} costs about $${diff.toLocaleString("en-US")} more than ${cheaper.name}, and gets you: ${advantages.map((a) => a.label.toLowerCase()).join(", ")}. Worth it depends on whether those matter for what you're doing.`
        : `${pricier.name} costs about $${diff.toLocaleString("en-US")} more than ${cheaper.name} without a clear catalog-backed advantage — the cheaper option looks like the better value here.`,
    };
  }
  if (/which (one )?(should i|to) buy|better( overall)?|recommend/.test(q)) {
    if (callouts.length === 0) return { message: "These two are close enough that the raw specs below are the real deciding factor — no standout winner on file." };
    const grouped = callouts.reduce<Record<"a" | "b", string[]>>((acc, c) => { acc[c.winner].push(c.label); return acc; }, { a: [], b: [] });
    const lines = (["a", "b"] as const)
      .filter((k) => grouped[k].length > 0)
      .map((k) => `${winnerName(k)}: ${grouped[k].join(", ")}`)
      .join(". ");
    return { message: `${lines}. Pick based on whichever of those matters more for what you're doing.` };
  }

  return { message: "Try asking which one is better for a specific use (gaming, AI, power, upgrade path), or whether the pricier option is worth it." };
}

// ---------------------------------------------------------------------------
// Compatibility context
// ---------------------------------------------------------------------------

function concreteCompatibilityCheck(context: Extract<AssistantContext, { kind: "compatibility" }>): string | undefined {
  const { productA, productB, categoryAId, categoryBId } = context;
  if (!productA || !productB) return undefined;
  const pair = new Set([categoryAId, categoryBId]);

  if (pair.has("cpu") && pair.has("motherboard")) {
    const cpu = categoryAId === "cpu" ? productA : productB;
    const mobo = categoryAId === "motherboard" ? productA : productB;
    const cpuSocket = findSpec(cpu, "socket");
    const moboSocket = findSpec(mobo, "socket");
    if (cpuSocket && moboSocket) {
      return cpuSocket === moboSocket
        ? `Yes — ${cpu.name} and ${mobo.name} both use the ${cpuSocket} socket, so they physically connect.`
        : `No — ${cpu.name} uses ${cpuSocket} while ${mobo.name} uses ${moboSocket}. Different sockets can't physically connect; you'd need a ${cpuSocket} motherboard instead.`;
    }
  }

  if (pair.has("gpu") && pair.has("psu")) {
    const gpu = categoryAId === "gpu" ? productA : productB;
    const psu = categoryAId === "psu" ? productA : productB;
    const rec = firstNumber(findSpec(gpu, "recommended psu"));
    const have = firstNumber(findSpec(psu, "wattage"));
    if (rec && have) {
      return have >= rec
        ? `Yes — ${gpu.name} recommends at least ${rec} W, and ${psu.name} provides ${have} W, so there's headroom.`
        : `Not comfortably — ${gpu.name} recommends at least ${rec} W, but ${psu.name} only provides ${have} W. A higher-wattage PSU would be safer.`;
    }
  }

  if (pair.has("motherboard") && (pair.has("ram") || pair.has("cpu"))) {
    const mobo = categoryAId === "motherboard" ? productA : productB;
    const other = mobo === productA ? productB : productA;
    const moboType = findSpec(mobo, "memory type") ?? findSpec(mobo, "ram type");
    const otherType = findSpec(other, "memory type") ?? findSpec(other, "type");
    if (moboType && otherType && (moboType.includes("DDR") || otherType.includes("DDR"))) {
      const match = moboType.split(/[\s,]/)[0] === otherType.split(/[\s,]/)[0];
      if (moboType !== otherType) {
        return match
          ? `Likely yes — both list ${moboType.split(/[\s,]/)[0]}, though double-check the exact speed supported.`
          : `Check carefully — ${mobo.name} lists "${moboType}" while ${other.name} lists "${otherType}"; a mismatch here means it won't run at rated speed, if it works at all.`;
      }
    }
  }

  return undefined;
}

async function answerCompatibility(context: Extract<AssistantContext, { kind: "compatibility" }>, question: string): Promise<DeterministicResult> {
  const categoryA = getCategory(context.categoryAId);
  const categoryB = getCategory(context.categoryBId);
  const link = linkBetween(context.categoryAId, context.categoryBId);
  const q = question.toLowerCase();

  const concrete = concreteCompatibilityCheck(context);
  if (concrete) return { message: concrete };

  if (!link) {
    return { message: `HardwareNeeds doesn't have a specific compatibility rule on file between ${categoryA?.name ?? context.categoryAId} and ${categoryB?.name ?? context.categoryBId}.` };
  }

  if (/(alternative|instead|what should i use|compatible option)/.test(q)) {
    return { message: `The rule to satisfy is: ${link.label} — ${link.detail} Browse ${categoryB?.name ?? "the other category"} and filter to options matching that requirement.` };
  }

  const kindNote = link.kind === "critical" ? "a hard requirement — get it wrong and the parts won't work together at all" : link.kind === "physical" ? "a physical fit requirement — both parts work, but only if they fit" : "not a hard blocker, but a mismatch here means you're not getting full value";
  return { message: `${categoryA?.name ?? "This"} and ${categoryB?.name ?? "that"} are linked by: "${link.label}" (${kindNote}). ${link.detail}` };
}

// ---------------------------------------------------------------------------
// General context
// ---------------------------------------------------------------------------

const conceptGlossary: { pattern: RegExp; answer: string }[] = [
  { pattern: /pcie/i, answer: "PCIe (Peripheral Component Interconnect Express) is the high-speed connection GPUs, NVMe SSDs, and other add-in cards use to talk to the rest of the system. Newer generations (PCIe 4.0, 5.0) roughly double the bandwidth of the one before, and slots are backward-compatible — a PCIe 3.0 card works in a PCIe 5.0 slot, just at the older speed." },
  { pattern: /\bvram\b/i, answer: "VRAM is memory built into a graphics card, separate from your system RAM. It holds textures, frame buffers, and — for local AI work — the model itself. Running out of VRAM causes stutters in games or forces a model to load more slowly from system memory." },
  { pattern: /\btdp\b|wattage|power draw/i, answer: "TDP (Thermal Design Power) is roughly how much heat a component is rated to produce under sustained load, in watts. It's a good proxy for both cooling needs and power supply sizing, though real draw can spike above it briefly." },
  { pattern: /\bsocket\b/i, answer: "A CPU socket is the physical connector on a motherboard that a specific CPU family is built to fit. AMD and Intel use different, incompatible sockets, and even the same brand changes sockets every few CPU generations — that's the single most common compatibility mistake in a build." },
  { pattern: /\bnvme\b|\bssd\b/i, answer: "An SSD (solid-state drive) has no moving parts and is dramatically faster than a traditional hard drive. NVMe SSDs plug directly into an M.2 slot on the motherboard over PCIe, which is faster than the older SATA SSD interface." },
  { pattern: /\bddr\d?\b|ram speed|memory speed/i, answer: "DDR (DDR4, DDR5, etc.) is the RAM generation — each is faster and requires a motherboard built for that specific generation; they aren't interchangeable. Within a generation, higher-numbered speeds (e.g. DDR5-6000 vs DDR5-5200) mean more bandwidth, with diminishing real-world returns past a point." },
];

async function answerGeneral(question: string): Promise<DeterministicResult> {
  const q = question.toLowerCase();

  const concept = conceptGlossary.find((c) => c.pattern.test(q));
  if (concept && /(explain|what is|what does|what's)/i.test(q)) return { message: concept.answer };

  const profile = interpretRequest(question);
  if (profile.goalId) {
    const goal = getGoal(profile.goalId);
    if (goal) {
      const answers: PlanAnswers = profile.budget ? { budget: profile.budget } : {};
      const recs = generateRecommendations(profile.goalId, answers);
      if (recs.length > 0) {
        const total = recs.reduce((s, r) => s + r.product.priceUSD, 0);
        const lines = recs.map((r) => `${getCategory(r.categoryId)?.name}: ${r.product.brand} ${r.product.name} ($${r.product.priceUSD.toLocaleString("en-US")})`).join(", ");
        return { message: `For ${goal.label.toLowerCase()}${profile.budget ? ` around $${profile.budget.toLocaleString("en-US")}` : ""}, HardwareNeeds would suggest: ${lines} — estimated total $${total.toLocaleString("en-US")}. Open Plan for the full breakdown, why each part was picked, and to fine-tune it.` };
      }
    }
  }

  return { message: "Ask me about a specific product, comparison, or build, or open Plan and describe what you're trying to do — I'll pull real recommendations from the HardwareNeeds catalog." };
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Post-build suggestions (Plan results "AI Suggestions" section)
// ---------------------------------------------------------------------------

/**
 * Practical, grounded next-step suggestions for a completed build — every
 * sentence is derived from real score data, specs, or catalog alternatives
 * already computed by the recommendation engine. Never filler: a build with
 * nothing notable to flag simply returns fewer suggestions.
 */
export function suggestImprovements(context: Extract<AssistantContext, { kind: "plan" }>): string[] {
  const { recommendations, goalId } = context;
  const suggestions: string[] = [];

  for (const rec of recommendations) {
    if (suggestions.length >= 5) break;
    const category = getCategory(rec.categoryId);
    const categoryName = category?.name ?? rec.categoryId;
    const score = rec.score;
    if (!score) continue;

    if (typeof score.budgetFit === "number" && score.budgetFit < 70) {
      const cheaper = productsByCategory(rec.categoryId)
        .filter((p) => p.priceUSD < rec.product.priceUSD)
        .sort((a, b) => b.priceUSD - a.priceUSD)[0];
      if (cheaper) {
        const savings = rec.product.priceUSD - cheaper.priceUSD;
        suggestions.push(`You could save about $${savings.toLocaleString("en-US")} by choosing ${cheaper.brand} ${cheaper.name} instead of ${rec.product.name}, without a major drop in ${categoryName} performance for this workload.`);
        continue;
      }
    }

    if (typeof score.efficiency === "number" && score.efficiency < 50) {
      suggestions.push(`${rec.product.name} draws more power than most ${categoryName} alternatives in the catalog — worth checking if a lower-power option would suit you better if efficiency matters.`);
      continue;
    }

    if (typeof score.upgradeability === "number" && score.upgradeability < 45 && rec.product.upgradeNote) {
      suggestions.push(`${categoryName}: ${rec.product.upgradeNote}`);
      continue;
    }
  }

  // RAM headroom for non-pure-gaming workloads (mirrors the worked example in the product brief).
  const ramRec = recommendations.find((r) => r.categoryId === "ram");
  if (ramRec && suggestions.length < 5 && goalId !== "gaming") {
    const capacity = firstNumber(findSpec(ramRec.product, "capacity"));
    if (capacity && capacity <= 16) {
      const bigger = productsByCategory("ram")
        .filter((p) => p.priceUSD > ramRec.product.priceUSD)
        .sort((a, b) => a.priceUSD - b.priceUSD)[0];
      if (bigger) {
        const biggerCapacity = findSpec(bigger, "capacity") ?? "more";
        suggestions.push(`Your build is solid as configured, but increasing RAM from ${capacity} GB to ${biggerCapacity} (${bigger.brand} ${bigger.name}, +$${(bigger.priceUSD - ramRec.product.priceUSD).toLocaleString("en-US")}) would make it more comfortable for multitasking and heavier workloads.`);
      }
    }
  }

  // PSU headroom above what the GPU actually needs.
  const gpuRec = recommendations.find((r) => r.categoryId === "gpu");
  const psuRec = recommendations.find((r) => r.categoryId === "psu");
  if (gpuRec && psuRec && suggestions.length < 5) {
    const recPsu = firstNumber(findSpec(gpuRec.product, "recommended psu"));
    const haveWattage = firstNumber(findSpec(psuRec.product, "wattage"));
    if (recPsu && haveWattage && haveWattage - recPsu >= 150) {
      suggestions.push(`${psuRec.product.name} gives you real headroom above what ${gpuRec.product.name} needs — enough to support a future GPU upgrade without replacing the power supply.`);
    }
  }

  // AI/ML workload specifically benefiting from more VRAM even if the current pick is fine for gaming.
  if (gpuRec && goalId === "ai-ml" && suggestions.length < 5) {
    const vram = firstNumber(findSpec(gpuRec.product, "vram"));
    if (vram && vram < 16) {
      const moreVram = productsByCategory("gpu")
        .filter((p) => (firstNumber(findSpec(p, "vram")) ?? 0) > vram)
        .sort((a, b) => a.priceUSD - b.priceUSD)[0];
      if (moreVram) {
        suggestions.push(`${gpuRec.product.name} is capable, but your local AI workload would benefit more from additional VRAM — ${moreVram.brand} ${moreVram.name} offers ${findSpec(moreVram, "vram")} for about $${(moreVram.priceUSD - gpuRec.product.priceUSD).toLocaleString("en-US")} more.`);
      }
    }
  }

  return suggestions.slice(0, 5);
}

export async function answerDeterministic(
  context: AssistantContext,
  question: string,
  _history: AiMessage[],
): Promise<DeterministicResult> {
  switch (context.kind) {
    case "plan":
      return answerPlan(context, question);
    case "product":
      return answerProduct(context, question);
    case "compare":
      return answerCompare(context, question);
    case "compatibility":
      return answerCompatibility(context, question);
    case "general":
    default:
      return answerGeneral(question);
  }
}
