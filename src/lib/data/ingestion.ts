import type { DataConfidence, HardwareProduct, ProductTier } from "./types";
import { getCategory } from "./categories";

/**
 * Normalization layer for importing hardware data from external sources
 * (manufacturer datasets, retailer APIs, structured JSON/CSV exports,
 * manually-verified spreadsheets) into the canonical `HardwareProduct`
 * schema used everywhere else in the app.
 *
 * Nothing currently calls this against a real external source — there
 * isn't one wired up. This exists so that when one is, the app doesn't
 * need to change: every page and every recommendation/compatibility
 * function already reads `HardwareProduct[]` from `products.ts`, so a
 * future importer just needs to produce that same shape and merge it in.
 *
 * Ground rule: normalization never invents a value. A field that isn't
 * present (or isn't confidently parseable) in the raw record is omitted,
 * not guessed. `normalizeProduct` returns `null` with a reason when a
 * record is missing something required, rather than silently filling gaps.
 */

/**
 * The loose shape a raw import record might arrive in — field names are
 * intentionally permissive (common aliases from different possible
 * sources) since nothing external is standardized yet. Extend this as
 * real source formats are integrated, rather than widening the canonical
 * `HardwareProduct` type to match any one source's quirks.
 */
export interface RawImportRecord {
  id?: string;
  slug?: string;
  categoryId?: string;
  category?: string; // alias
  manufacturer?: string;
  brand?: string; // alias
  model?: string;
  name?: string; // alias
  subcategory?: string;
  tier?: string;
  priceUsd?: number;
  price?: number; // alias
  summary?: string;
  description?: string; // alias
  specs?: Record<string, string> | { label: string; value: string }[];
  strengths?: string[];
  pros?: string[]; // alias
  considerations?: string[];
  cons?: string[]; // alias
  useCases?: string[];
  powerConsumptionW?: number;
  tdpW?: number; // alias
  upgradeNote?: string;
  releaseGeneration?: string;
  generation?: string; // alias
  dataConfidence?: string;
  source?: string;
  sourceUrl?: string;
  lastVerified?: string;
}

export interface NormalizationResult {
  ok: boolean;
  product?: HardwareProduct;
  /** Populated when ok is false, or to flag soft issues even when ok is true. */
  issues: string[];
}

const VALID_TIERS: ProductTier[] = ["essential", "balanced", "performance"];
const VALID_CONFIDENCE: DataConfidence[] = ["verified", "estimated"];

function normalizeSpecs(raw: RawImportRecord["specs"]): { label: string; value: string }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw).map(([label, value]) => ({ label, value }));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Converts one raw import record into a canonical `HardwareProduct`, or
 * reports why it couldn't. Required fields: a resolvable category, a
 * manufacturer/brand, a model/name, and a price. Everything else is
 * optional and simply omitted if absent — never fabricated.
 */
export function normalizeProduct(raw: RawImportRecord, existingIds: Set<string>): NormalizationResult {
  const issues: string[] = [];

  const categoryRef = raw.categoryId ?? raw.category;
  const category = categoryRef ? getCategory(categoryRef) : undefined;
  if (!category) {
    issues.push(`Unrecognized category: "${categoryRef ?? "(none provided)"}"`);
    return { ok: false, issues };
  }

  const brand = raw.manufacturer ?? raw.brand;
  if (!brand) issues.push("Missing manufacturer/brand");

  const name = raw.model ?? raw.name;
  if (!name) issues.push("Missing model/name");

  const price = raw.priceUsd ?? raw.price;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    issues.push("Missing or invalid price");
  }

  if (issues.length > 0) return { ok: false, issues };

  const tier: ProductTier = VALID_TIERS.includes(raw.tier as ProductTier)
    ? (raw.tier as ProductTier)
    : "balanced";
  if (raw.tier && tier !== raw.tier) issues.push(`Unrecognized tier "${raw.tier}" — defaulted to "balanced"`);

  const dataConfidence: DataConfidence = VALID_CONFIDENCE.includes(raw.dataConfidence as DataConfidence)
    ? (raw.dataConfidence as DataConfidence)
    : "estimated";

  const slug = raw.slug ?? slugify(`${brand}-${name}`);
  let id = raw.id ?? `${category.id}-import-${slug}`;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${category.id}-import-${slug}-${suffix}`;
    suffix += 1;
  }

  const product: HardwareProduct = {
    id,
    slug,
    categoryId: category.id,
    subcategory: raw.subcategory,
    brand: brand!,
    name: name!,
    tier,
    priceUSD: price!,
    summary: raw.summary ?? raw.description ?? "",
    specs: normalizeSpecs(raw.specs),
    strengths: raw.strengths ?? raw.pros ?? [],
    considerations: raw.considerations ?? raw.cons ?? [],
    useCases: raw.useCases,
    powerConsumptionW: raw.powerConsumptionW ?? raw.tdpW,
    upgradeNote: raw.upgradeNote,
    releaseGeneration: raw.releaseGeneration ?? raw.generation,
    dataConfidence,
    source: raw.source,
    sourceUrl: raw.sourceUrl,
    lastVerified: raw.lastVerified,
    isSampleData: true,
  };

  if (!product.summary) issues.push("No summary provided — product will show with blank summary");

  return { ok: true, product, issues };
}

/** Batch helper — normalizes many records, skipping (and reporting) any that fail. */
export function normalizeBatch(records: RawImportRecord[], existingIds: Set<string>) {
  const accepted: HardwareProduct[] = [];
  const rejected: { record: RawImportRecord; issues: string[] }[] = [];
  const ids = new Set(existingIds);

  for (const record of records) {
    const result = normalizeProduct(record, ids);
    if (result.ok && result.product) {
      accepted.push(result.product);
      ids.add(result.product.id);
    } else {
      rejected.push({ record, issues: result.issues });
    }
  }

  return { accepted, rejected };
}
