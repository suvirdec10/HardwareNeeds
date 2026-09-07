import type { ProductTier } from "./types";
import { pickByTier } from "./products";

export type CurrentTier = ProductTier | "unknown";

export interface UpgradeAnswers {
  current: Partial<Record<string, CurrentTier>>;
  concern: string;
}

export interface UpgradeCategoryResult {
  categoryId: string;
  action: "upgrade" | "keep";
  currentTier: CurrentTier;
  suggestedTier?: ProductTier;
  product?: ReturnType<typeof pickByTier>;
  reasoning: string[];
  compatibilityNote?: string;
}

export const upgradeCategories = ["cpu", "gpu", "ram", "storage", "cooler", "psu"];

export const upgradeConcerns: { value: string; label: string; description: string; targets: string[] }[] = [
  {
    value: "higher-resolution-gaming",
    label: "Play at a higher resolution or frame rate",
    description: "Your games feel capped by visuals or smoothness.",
    targets: ["gpu"],
  },
  {
    value: "smoother-multitasking",
    label: "Smoother multitasking",
    description: "Things feel sluggish with a lot open at once.",
    targets: ["ram", "cpu"],
  },
  {
    value: "faster-exports-renders",
    label: "Faster exports or renders",
    description: "Waiting too long on renders, exports, or builds.",
    targets: ["cpu", "gpu", "storage"],
  },
  {
    value: "more-storage",
    label: "Running out of storage",
    description: "You're constantly managing space.",
    targets: ["storage"],
  },
  {
    value: "quieter-cooler-temps",
    label: "Reduce noise or temperatures",
    description: "The system runs loud or hot under load.",
    targets: ["cooler"],
  },
  {
    value: "general-performance",
    label: "General performance feels dated",
    description: "Not sure exactly what's holding it back.",
    targets: ["cpu", "gpu", "ram", "storage"],
  },
];

const tierOrder: ProductTier[] = ["essential", "balanced", "performance"];

function nextTier(tier: CurrentTier): ProductTier | undefined {
  if (tier === "unknown") return "balanced";
  const idx = tierOrder.indexOf(tier);
  if (idx >= tierOrder.length - 1) return undefined;
  return tierOrder[idx + 1];
}

const categoryLabel: Record<string, string> = {
  cpu: "CPU",
  gpu: "GPU",
  ram: "RAM",
  storage: "Storage",
  cooler: "CPU Cooler",
  psu: "Power Supply",
};

export function generateUpgradePlan(answers: UpgradeAnswers): UpgradeCategoryResult[] {
  const concern = upgradeConcerns.find((c) => c.value === answers.concern);
  const targets = concern?.targets ?? [];

  return upgradeCategories.map((categoryId) => {
    const currentTier = answers.current[categoryId] ?? "unknown";
    const isTarget = targets.includes(categoryId);
    const label = categoryLabel[categoryId];

    if (currentTier === "performance") {
      return {
        categoryId,
        action: "keep",
        currentTier,
        reasoning: [`Your ${label} is already at a high tier — it isn't the limiting factor for what you described.`],
      };
    }

    if (!isTarget) {
      return {
        categoryId,
        action: "keep",
        currentTier,
        reasoning: [`Not the priority for the goal you selected — leave this as-is unless something else changes.`],
      };
    }

    const suggestedTier = nextTier(currentTier);
    if (!suggestedTier) {
      return {
        categoryId,
        action: "keep",
        currentTier,
        reasoning: [`Already at the top tier we track — no upgrade needed here.`],
      };
    }

    const product = pickByTier(categoryId, suggestedTier);
    const reasoning: string[] = [
      `You said you want to ${concern?.label.toLowerCase()}.`,
      currentTier === "unknown"
        ? `Since your current ${label} tier wasn't specified, we're suggesting a solid mid-tier upgrade as a safe next step.`
        : `Your current ${label} is entry-to-mid tier, which is a likely limiting factor for that goal.`,
      `Moving to a ${suggestedTier} tier ${label} directly addresses this.`,
    ];

    let compatibilityNote: string | undefined;
    if (categoryId === "cpu") {
      compatibilityNote =
        "A CPU upgrade may require a new motherboard (and possibly RAM) if it uses a different socket or memory type — confirm platform compatibility before buying.";
    }
    if (categoryId === "gpu") {
      compatibilityNote =
        "Check that your current power supply has enough wattage headroom for the new GPU before buying.";
    }
    if (categoryId === "cooler") {
      compatibilityNote = "Confirm the new cooler fits your case's clearance and supports your CPU's socket.";
    }

    return {
      categoryId,
      action: "upgrade",
      currentTier,
      suggestedTier,
      product,
      reasoning,
      compatibilityNote,
    };
  });
}
