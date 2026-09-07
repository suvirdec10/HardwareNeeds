import type { HardwareProduct } from "./types";

/**
 * Plain-English "quick take" callouts for a two-product comparison —
 * derived entirely from real spec values already on the products (never
 * invented), so this works for any category without per-category copy.
 */
export interface CompareCallout {
  label: string;
  winner: "a" | "b";
}

interface Dimension {
  specLabelPart: string;
  direction: "higher" | "lower";
  label: (product: HardwareProduct) => string;
}

const categoryDimensions: Record<string, Dimension[]> = {
  gpu: [
    { specLabelPart: "vram", direction: "higher", label: () => "More VRAM" },
    { specLabelPart: "tdp", direction: "lower", label: () => "Lower power draw" },
  ],
  cpu: [
    { specLabelPart: "cores", direction: "higher", label: () => "More cores" },
    { specLabelPart: "tdp", direction: "lower", label: () => "Lower power draw" },
  ],
  ram: [
    { specLabelPart: "capacity", direction: "higher", label: () => "More capacity" },
    { specLabelPart: "speed", direction: "higher", label: () => "Faster memory speed" },
  ],
  storage: [
    { specLabelPart: "capacity", direction: "higher", label: () => "More capacity" },
    { specLabelPart: "sequential read", direction: "higher", label: () => "Faster reads" },
  ],
  psu: [{ specLabelPart: "wattage", direction: "higher", label: () => "More power headroom" }],
  monitor: [{ specLabelPart: "refresh rate", direction: "higher", label: () => "Smoother motion (higher refresh)" }],
  motherboard: [{ specLabelPart: "m.2 slots", direction: "higher", label: () => "More M.2 storage slots" }],
};

function firstNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : undefined;
}

function specFor(product: HardwareProduct, labelPart: string) {
  return product.specs.find((s) => s.label.toLowerCase().includes(labelPart))?.value;
}

const UPGRADE_FRIENDLY = /expected to receive|current platform|upgradeable/i;
const UPGRADE_LIMITED = /outgoing|no newer|soldered|not upgradeable|fixed at purchase/i;

function upgradeScore(product: HardwareProduct): number {
  if (!product.upgradeNote) return 0;
  if (UPGRADE_FRIENDLY.test(product.upgradeNote)) return 1;
  if (UPGRADE_LIMITED.test(product.upgradeNote)) return -1;
  return 0;
}

export function compareCallouts(
  productA: HardwareProduct,
  productB: HardwareProduct,
  categoryId: string,
): CompareCallout[] {
  const callouts: CompareCallout[] = [];
  const dimensions = categoryDimensions[categoryId] ?? [];

  for (const dim of dimensions) {
    const a = firstNumber(specFor(productA, dim.specLabelPart));
    const b = firstNumber(specFor(productB, dim.specLabelPart));
    if (a === undefined || b === undefined || a === b) continue;
    const aWins = dim.direction === "higher" ? a > b : a < b;
    callouts.push({ label: dim.label(aWins ? productA : productB), winner: aWins ? "a" : "b" });
  }

  // Price: cheaper isn't automatically "better," but it's a real, useful callout.
  if (productA.priceUSD !== productB.priceUSD) {
    callouts.push({ label: "Better value", winner: productA.priceUSD < productB.priceUSD ? "a" : "b" });
  }

  // Workload fit, from real useCases tags — only when they clearly differ.
  const workloadLabels: Record<string, string> = { gaming: "Best for gaming", "ai-ml": "Best for AI/ML", "video-editing": "Best for video editing", "3d-rendering": "Best for 3D rendering" };
  for (const [tag, label] of Object.entries(workloadLabels)) {
    const aHas = (productA.useCases ?? []).includes(tag);
    const bHas = (productB.useCases ?? []).includes(tag);
    if (aHas !== bHas) callouts.push({ label, winner: aHas ? "a" : "b" });
  }

  const upgradeDiff = upgradeScore(productA) - upgradeScore(productB);
  if (upgradeDiff !== 0) callouts.push({ label: "More upgradeable", winner: upgradeDiff > 0 ? "a" : "b" });

  return callouts;
}
