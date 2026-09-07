import type { HardwareProduct } from "@/lib/data/types";

/**
 * Where-to-buy architecture, kept separate from recommendation logic on
 * purpose: nothing here ever influences scoring or which product gets
 * recommended (see src/lib/data/recommend.ts) — it only helps a user act on
 * a choice they've already arrived at.
 *
 * HardwareNeeds has no live pricing/availability integration today, so
 * `getCurrentPrice` and `getAvailability` are honest stubs that resolve to
 * "unknown" rather than a guess. The interface exists so a real retailer
 * API (with real rate limits, auth, and caching) could implement it later
 * without changing any calling code — see RetailerProvider below.
 */

export interface RetailerLink {
  /** Display name, e.g. "Amazon". */
  retailer: string;
  url: string;
  /**
   * "product" = a verified direct product page (never guessed — only used
   * when one is actually on file); "search" = a generated retailer search
   * for the exact product name (the honest default); "homepage" = the
   * manufacturer's official site root, not a specific product page.
   */
  kind: "product" | "search" | "homepage";
}

export interface RetailerProvider {
  readonly id: string;
  readonly label: string;
  /** A verified direct product URL, only when one is actually on file — never guessed. */
  getProductLink(product: HardwareProduct): string | undefined;
  /** Always available — a safe, retailer-generated search for the exact product name. */
  getSearchLink(product: HardwareProduct): string;
  /** Not implemented: no reliable live pricing source exists yet. Always resolves to undefined. */
  getCurrentPrice(product: HardwareProduct): Promise<number | undefined>;
  /** Not implemented: no reliable live availability source exists yet. Always resolves to "unknown". */
  getAvailability(product: HardwareProduct): Promise<"in_stock" | "out_of_stock" | "unknown">;
}
