/**
 * Core data contracts for HardwareNeeds.
 *
 * Everything under `src/lib/data` is sample/demo data shaped the way a real
 * catalog + compatibility API would be. Swap the static arrays here for
 * fetch calls without touching the pages/components that consume them.
 */

/**
 * Top-level taxonomy groups shown in the hardware directory. Deliberately
 * kept to a browsable handful — depth within a group comes from
 * `HardwareCategory.subcategories` / `HardwareProduct.subcategory`, not from
 * multiplying top-level groups. New groups can be added here as the catalog
 * grows into areas not yet covered.
 */
export type CategoryGroup =
  | "Compute"
  | "System"
  | "Display & Input"
  | "Networking"
  | "Complete Systems"
  | "Storage & Backup"
  | "Developer & Maker"
  | "Other";

export interface HardwareCategory {
  id: string;
  slug: string;
  name: string;
  group: CategoryGroup;
  /** One line, shown in directory cards and hero hover tooltips. */
  tagline: string;
  /** Icon name from lucide-react. */
  icon: string;
  /** Whether this category appears in the 3D system visualization. */
  in3DSystem: boolean;
  /**
   * Optional named subdivisions within this category (e.g. CPU ->
   * "Desktop CPU" / "Server CPU" / "Laptop CPU"). Purely descriptive —
   * products reference these by string in `HardwareProduct.subcategory`,
   * so adding a new subcategory never requires a schema change.
   */
  subcategories?: string[];
}

export type ProductTier = "essential" | "balanced" | "performance";

/**
 * How confident HardwareNeeds is in a product entry's data, and where it
 * came from. Lets the UI (and a future import pipeline) distinguish
 * "verified against public specs" from anything softer, instead of a single
 * blanket "sample data" flag.
 */
export type DataConfidence = "verified" | "estimated";

export interface HardwareProduct {
  id: string;
  slug: string;
  categoryId: string;
  /** Free-text subdivision within the category, e.g. "Desktop CPU", "AI/Workstation GPU", "NVMe SSD". */
  subcategory?: string;
  brand: string;
  name: string;
  tier: ProductTier;
  /** Estimated street price in USD — not live pricing. Verify before purchase. */
  priceUSD: number;
  summary: string;
  specs: { label: string; value: string }[];
  strengths: string[];
  considerations: string[];
  /**
   * Workload/use-case tags used for filtering and by the recommendation
   * engine — e.g. "gaming", "ai-ml", "video-editing", "server",
   * "home-lab". Free-form so new workloads don't require a schema change.
   */
  useCases?: string[];
  /** Rated power draw in watts, where meaningful (CPU/GPU/PSU/etc). */
  powerConsumptionW?: number;
  /** Short note on whether/how this part can be upgraded or swapped later. */
  upgradeNote?: string;
  /** Release year or generation label, e.g. "2024", "14th Gen", "RDNA 3". */
  releaseGeneration?: string;
  /**
   * "verified" = specs cross-checked against public manufacturer/retailer
   * listings at time of writing. "estimated" = directionally correct but
   * some figures (usually price) are ballpark. Defaults to "estimated" in
   * the UI if omitted.
   */
  dataConfidence?: DataConfidence;
  /** True for every entry — surfaced in the UI so nobody mistakes this for a live, continuously-synced catalog. */
  isSampleData: true;
}

export type CompatibilityKind = "critical" | "physical" | "performance";

export interface CompatibilityLink {
  from: string; // category id
  to: string; // category id
  kind: CompatibilityKind;
  label: string;
  detail: string;
}

export interface LearnSection {
  heading: string;
  body: string;
}

export interface LearnSpec {
  name: string;
  matters: string;
}

export interface LearnTopic {
  categoryId: string;
  title: string;
  hook: string;
  whatIsIt: string;
  whatItDoes: string;
  howItWorks: LearnSection[];
  specsThatMatter: LearnSpec[];
  whyItMatters: string;
  performanceImpact: string;
  interactsWith: { categoryId: string; note: string }[];
  commonMistakes: string[];
  howToChoose: string[];
  hasVisualization?: boolean;
}

export type QuestionType = "single" | "multi" | "slider" | "toggle";

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface PlanQuestion {
  id: string;
  prompt: string;
  helper?: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
}

export interface Goal {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Category ids most relevant to this goal's recommendation. */
  focusCategories: string[];
  questions: PlanQuestion[];
}

export interface PlanAnswers {
  [questionId: string]: string | string[] | number;
}

export interface Recommendation {
  categoryId: string;
  product: HardwareProduct;
  role: string;
  reasoning: string[];
  alternative?: HardwareProduct;
}
