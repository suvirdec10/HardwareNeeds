import { ExternalLink, ShoppingBag } from "lucide-react";
import type { HardwareProduct } from "@/lib/data/types";
import { retailerLinksFor } from "@/lib/retail/retailers";

/**
 * "Where to Buy" — search links only, never a claim about live stock or
 * price. Not an affiliate program and not a partnership with any retailer
 * named here; every link just runs a search for the exact product name on
 * that retailer's own site. See src/lib/retail for the full disclosure in
 * code and src/lib/retail/types.ts for why getCurrentPrice/getAvailability
 * are honest stubs rather than guesses.
 */
export function WhereToBuy({ product, compact = false }: { product: HardwareProduct; compact?: boolean }) {
  const links = retailerLinksFor(product);

  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
        <ShoppingBag className="h-3.5 w-3.5" /> Where to buy
      </p>
      {!compact && (
        <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-text-faint">
          These open a search for &ldquo;{product.brand} {product.name}&rdquo; on each retailer&apos;s
          own site — not live pricing or confirmed stock, and not affiliate links. You&apos;re
          leaving HardwareNeeds.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.retailer}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-[12.5px] font-medium text-text-muted transition-colors hover:border-border-strong hover:text-text"
          >
            {link.kind === "homepage" ? `${link.retailer} site` : link.retailer}
            <ExternalLink className="h-3 w-3 text-text-faint" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
      </div>
    </div>
  );
}
