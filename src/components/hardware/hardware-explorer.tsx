"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { Search, X } from "lucide-react";
import { products, allBrands, allUseCases } from "@/lib/data/products";
import { getCategory, categoriesByGroup } from "@/lib/data/categories";
import { Select } from "@/components/ui/select";
import { ProductCard } from "@/components/hardware/product-card";
import { CategorySection } from "@/components/hardware/category-section";
import { Reveal } from "@/components/ui/reveal";
import { workloadLabel } from "@/lib/utils";

const groupMeta: Record<string, { index: string; description: string; variant: "featured" | "compact" | "list" }> = {
  Compute: { index: "01", description: "The parts that do the actual work — what everything else exists to support.", variant: "featured" },
  System: { index: "02", description: "What holds compute together, feeds it power, and keeps it from overheating.", variant: "featured" },
  "Complete Systems": { index: "03", description: "Whole machines, built and tested as one unit — no assembly required.", variant: "compact" },
  "Storage & Backup": { index: "04", description: "Storage that lives outside a single build — shared, portable, or business-scale.", variant: "compact" },
  "Display & Input": { index: "05", description: "What you see, and how you control everything else.", variant: "compact" },
  Networking: { index: "06", description: "Getting every device online, reliably.", variant: "compact" },
  "Developer & Maker": { index: "07", description: "Boards and small hardware for building and prototyping, not everyday computing.", variant: "compact" },
  Other: { index: "08", description: "Everything else worth knowing about.", variant: "list" },
};

const sortOptions = [
  { value: "relevance", label: "Sort: Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

const maxPrice = Math.max(...products.map((p) => p.priceUSD));

export function HardwareExplorer() {
  const [query, setQuery] = React.useState("");
  const [brand, setBrand] = React.useState("all");
  const [useCase, setUseCase] = React.useState("all");
  const [tier, setTier] = React.useState<"all" | "essential" | "balanced" | "performance">("all");
  const [priceCap, setPriceCap] = React.useState(maxPrice);
  const [sortBy, setSortBy] = React.useState("relevance");

  const brandOptions = React.useMemo(
    () => [{ value: "all", label: "All manufacturers" }, ...allBrands().map((b) => ({ value: b, label: b }))],
    [],
  );
  const useCaseOptions = React.useMemo(
    () => [{ value: "all", label: "All use cases" }, ...allUseCases().map((u) => ({ value: u, label: workloadLabel(u) }))],
    [],
  );

  const filtersActive =
    query.trim().length > 0 || brand !== "all" || useCase !== "all" || tier !== "all" || priceCap < maxPrice;

  const results = React.useMemo(() => {
    if (!filtersActive) return [];
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const category = getCategory(p.categoryId);
      const haystack = `${p.brand} ${p.name} ${p.summary} ${category?.name ?? ""}`.toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (useCase !== "all" && !(p.useCases ?? []).includes(useCase)) return false;
      if (tier !== "all" && p.tier !== tier) return false;
      if (p.priceUSD > priceCap) return false;
      return true;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.priceUSD - b.priceUSD);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.priceUSD - a.priceUSD);
    else if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [filtersActive, query, brand, useCase, tier, priceCap, sortBy]);

  function clearFilters() {
    setQuery("");
    setBrand("all");
    setUseCase("all");
    setTier("all");
    setPriceCap(maxPrice);
    setSortBy("relevance");
  }

  const groups = categoriesByGroup();

  return (
    <div>
      <div className="container-page">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search products, brands, or categories…"
            className="h-12 w-full rounded-lg border border-border-strong bg-surface pl-11 pr-4 text-[14.5px] text-text placeholder:text-text-faint transition-colors focus:border-accent-border focus:outline-none"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={brand} onValueChange={setBrand} options={brandOptions} />
          <Select value={useCase} onValueChange={setUseCase} options={useCaseOptions} />
          <div className="flex h-11 items-center gap-1 rounded-md border border-border-strong bg-surface px-1.5">
            {(["all", "essential", "balanced", "performance"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`flex-1 rounded px-2 py-1.5 text-[12.5px] font-medium capitalize transition-colors ${
                  tier === t ? "bg-accent text-[#04070d]" : "text-text-muted hover:text-text"
                }`}
              >
                {t === "all" ? "Any tier" : t}
              </button>
            ))}
          </div>
          <Select value={sortBy} onValueChange={setSortBy} options={sortOptions} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex flex-1 items-center gap-3 rounded-md border border-border-strong bg-surface px-4 py-2.5">
            <span className="shrink-0 whitespace-nowrap text-[12.5px] text-text-muted">
              Up to <span className="font-mono text-text">${priceCap.toLocaleString("en-US")}</span>
            </span>
            <Slider.Root
              className="relative flex h-5 flex-1 touch-none items-center"
              min={0}
              max={maxPrice}
              step={25}
              value={[priceCap]}
              onValueChange={([v]) => setPriceCap(v)}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-surface-3">
                <Slider.Range className="absolute h-full rounded-full bg-accent" />
              </Slider.Track>
              <Slider.Thumb
                className="block h-4 w-4 rounded-full border-2 border-accent bg-canvas-raised transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Maximum price"
              />
            </Slider.Root>
          </div>
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-text"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {filtersActive ? (
        <div className="container-page mt-10 pb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          {results.length === 0 ? (
            <div className="mt-6 rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
              No products match those filters yet. Try widening your search.
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i, 8) * 40}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {Array.from(groups.entries()).map(([group, cats]) => (
            <CategorySection
              key={group}
              id={group.toLowerCase().replace(/\s+/g, "-")}
              index={groupMeta[group]?.index ?? ""}
              title={group}
              description={groupMeta[group]?.description ?? ""}
              categories={cats}
              variant={groupMeta[group]?.variant ?? "compact"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
