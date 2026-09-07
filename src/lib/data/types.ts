/**
 * Core data contracts for HardwareNeeds.
 *
 * Everything under `src/lib/data` is sample/demo data shaped the way a real
 * catalog + compatibility API would be. Swap the static arrays here for
 * fetch calls without touching the pages/components that consume them.
 */

export type CategoryGroup =
  | "Compute"
  | "System"
  | "Display & Input"
  | "Networking"
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
}

export type ProductTier = "essential" | "balanced" | "performance";

export interface HardwareProduct {
  id: string;
  slug: string;
  categoryId: string;
  brand: string;
  name: string;
  tier: ProductTier;
  /** Approximate USD price for sample purposes only. */
  priceUSD: number;
  summary: string;
  specs: { label: string; value: string }[];
  strengths: string[];
  considerations: string[];
  /** True for every entry — surfaced in the UI so nobody mistakes this for live pricing/stock. */
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
