import type { HardwareProduct } from "@/lib/data/types";
import type { RetailerLink, RetailerProvider } from "./types";

/**
 * Reputable general retailers to search for any product. Each generates a
 * search URL from the exact product name — no scraping, no inventory API,
 * nothing that could go stale or claim false availability.
 */
const searchRetailers: { retailer: string; buildUrl: (query: string) => string }[] = [
  { retailer: "Amazon", buildUrl: (q) => `https://www.amazon.com/s?k=${q}` },
  { retailer: "Newegg", buildUrl: (q) => `https://www.newegg.com/p/pl?d=${q}` },
  { retailer: "Best Buy", buildUrl: (q) => `https://www.bestbuy.com/site/searchpage.jsp?st=${q}` },
  { retailer: "B&H Photo Video", buildUrl: (q) => `https://www.bhphotovideo.com/c/search?Ntt=${q}` },
  { retailer: "Micro Center", buildUrl: (q) => `https://www.microcenter.com/search/search_results.aspx?Ntt=${q}` },
];

/**
 * Official manufacturer domains for brands actually in the HardwareNeeds
 * catalog. Only used to link to the brand's homepage — never a guessed
 * product URL. A brand missing here simply doesn't get a manufacturer tile,
 * rather than linking somewhere wrong.
 */
const manufacturerDomains: Record<string, string> = {
  AMD: "amd.com",
  NVIDIA: "nvidia.com",
  Intel: "intel.com",
  ASUS: "asus.com",
  MSI: "msi.com",
  Corsair: "corsair.com",
  Crucial: "crucial.com",
  Kingston: "kingston.com",
  "G.Skill": "gskill.com",
  HyperX: "hyperx.com",
  "Cooler Master": "coolermaster.com",
  "Fractal Design": "fractal-design.com",
  "Lian Li": "lian-li.com",
  NZXT: "nzxt.com",
  Noctua: "noctua.at",
  Samsung: "samsung.com",
  Seagate: "seagate.com",
  "Western Digital": "westerndigital.com",
  Synology: "synology.com",
  "TP-Link": "tp-link.com",
  Ubiquiti: "ui.com",
  Apple: "apple.com",
  "Raspberry Pi": "raspberrypi.com",
  Arduino: "arduino.cc",
  LG: "lg.com",
  Logitech: "logitech.com",
  Microsoft: "microsoft.com",
  Elgato: "elgato.com",
  Creative: "creative.com",
  "StarTech.com": "startech.com",
  UGREEN: "ugreen.com",
  CalDigit: "caldigit.com",
  APC: "apc.com",
  AOC: "aoc.com",
};

function queryFor(product: HardwareProduct): string {
  return encodeURIComponent(`${product.brand} ${product.name}`);
}

class DefaultRetailerProvider implements RetailerProvider {
  readonly id = "search-links-v1";
  readonly label = "Retailer search links";

  getProductLink(): string | undefined {
    // No verified direct-product URLs are on file for any catalog entry yet —
    // intentionally returns undefined rather than guessing one.
    return undefined;
  }

  getSearchLink(product: HardwareProduct): string {
    return searchRetailers[0].buildUrl(queryFor(product));
  }

  async getCurrentPrice(): Promise<number | undefined> {
    return undefined;
  }

  async getAvailability(): Promise<"in_stock" | "out_of_stock" | "unknown"> {
    return "unknown";
  }
}

export const retailerProvider: RetailerProvider = new DefaultRetailerProvider();

/** All the "Where to buy" links for one product — what the UI actually renders. */
export function retailerLinksFor(product: HardwareProduct): RetailerLink[] {
  const query = queryFor(product);
  const links: RetailerLink[] = searchRetailers.map((r) => ({
    retailer: r.retailer,
    url: r.buildUrl(query),
    kind: "search",
  }));

  const domain = manufacturerDomains[product.brand];
  if (domain) {
    links.push({ retailer: product.brand, url: `https://www.${domain}`, kind: "homepage" });
  }

  return links;
}
