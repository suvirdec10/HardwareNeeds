"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { productsByCategory } from "@/lib/data/products";
import { explainSpec } from "@/lib/data/spec-explanations";
import { Select } from "@/components/ui/select";
import { Eyebrow, Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

const compareCategories = categories.filter((c) => productsByCategory(c.id).length >= 2);

export function CompareExperience() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [categoryId, setCategoryId] = React.useState(
    compareCategories.find((c) => c.id === initialCategory)?.id ?? compareCategories[0]?.id,
  );

  const products = React.useMemo(() => productsByCategory(categoryId ?? ""), [categoryId]);
  const [productAId, setProductAId] = React.useState(products[0]?.id);
  const [productBId, setProductBId] = React.useState(products[1]?.id ?? products[0]?.id);

  const [prevCategoryId, setPrevCategoryId] = React.useState(categoryId);
  if (categoryId !== prevCategoryId) {
    setPrevCategoryId(categoryId);
    setProductAId(products[0]?.id);
    setProductBId(products[1]?.id ?? products[0]?.id);
  }

  const productA = products.find((p) => p.id === productAId) ?? products[0];
  const productB = products.find((p) => p.id === productBId) ?? products[1] ?? products[0];
  const category = compareCategories.find((c) => c.id === categoryId);

  if (!category || !productA || !productB) {
    return (
      <div className="container-page py-32 text-center text-text-muted md:py-40">
        Not enough sample data to compare yet.
      </div>
    );
  }

  const specRows = productA.specs.map((spec) => ({
    label: spec.label,
    a: spec.value,
    b: productB.specs.find((s) => s.label === spec.label)?.value ?? "—",
  }));

  return (
    <>
      <div className="container-page py-32 md:py-40">
        <Eyebrow>Compare</Eyebrow>
        <h1 className="mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
          See the difference, in plain English.
        </h1>
        <p className="mt-4 max-w-lg text-balance leading-relaxed text-text-muted">
          Pick a category and two products. We&apos;ll show the specs — and what they actually
          mean.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {compareCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryId(c.id)}
              className={`rounded-md border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                c.id === categoryId
                  ? "border-accent-border bg-accent-dim text-accent-strong"
                  : "border-border bg-surface text-text-muted hover:border-border-strong hover:text-text"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Select
            value={productA.id}
            onValueChange={setProductAId}
            options={products.map((p) => ({ value: p.id, label: `${p.brand} ${p.name}` }))}
          />
          <Select
            value={productB.id}
            onValueChange={setProductBId}
            options={products.map((p) => ({ value: p.id, label: `${p.brand} ${p.name}` }))}
          />
        </div>

        <div className="mt-6 grid items-stretch gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-[1fr_auto_1fr]">
          {[productA, productB].map((p, i) => (
            <div key={p.id + i} className="animate-fade-in-fast bg-canvas p-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                {i === 0 ? "Product A" : "Product B"}
              </span>
              <p className="mt-2 text-xl font-semibold tracking-[-0.01em] text-text">
                {p.brand} {p.name}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{p.summary}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-2xl text-text">${p.priceUSD.toLocaleString("en-US")}</span>
                {productA.priceUSD !== productB.priceUSD &&
                  p.priceUSD === Math.min(productA.priceUSD, productB.priceUSD) && (
                    <span className="text-[12px] font-medium text-success">
                      ${Math.abs(productA.priceUSD - productB.priceUSD).toLocaleString("en-US")} less
                    </span>
                  )}
              </div>
            </div>
          ))}
          <div className="hidden items-center justify-center bg-canvas px-2 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-surface font-mono text-[11px] text-text-faint">
              vs
            </span>
          </div>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3 px-1 pb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint sm:gap-4">
            <span>Specification</span>
            <span className="truncate" title={`${productA.brand} ${productA.name}`}>
              {productA.brand}
            </span>
            <span className="truncate" title={`${productB.brand} ${productB.name}`}>
              {productB.brand}
            </span>
          </div>
          <div key={`${productA.id}-${productB.id}`} className="animate-fade-in-fast divide-y divide-border-faint rounded-xl border border-border">
            {specRows.map((row) => {
              const explanation = explainSpec(category.id, row.label);
              const differs = row.a !== row.b;
              return (
                <div key={row.label} className={cn("px-4 py-4 transition-colors duration-300 sm:px-5", differs && "bg-accent-dim")}>
                  <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 text-[13px] text-text-muted">
                      {differs && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />}
                      {row.label}
                    </div>
                    <div
                      className={cn(
                        "font-mono text-[13.5px]",
                        differs ? "font-semibold text-accent-strong" : "text-text-muted",
                      )}
                    >
                      {row.a}
                    </div>
                    <div
                      className={cn(
                        "font-mono text-[13.5px]",
                        differs ? "font-semibold text-accent-strong" : "text-text-muted",
                      )}
                    >
                      {row.b}
                    </div>
                  </div>
                  {explanation && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-text-faint">{explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/learn/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:text-accent"
          >
            Learn about {category.name} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/hardware/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text"
          >
            Browse all {category.name} options <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Tag tone="neutral" className="mt-10">
          Sample data for demonstration
        </Tag>
      </div>
    </>
  );
}
