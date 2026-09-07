import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories, getCategory } from "@/lib/data/categories";
import { productsByCategory } from "@/lib/data/products";
import { linksFor } from "@/lib/data/compatibility";
import { getLearnTopic } from "@/lib/data/learn";
import { ProductCard } from "@/components/hardware/product-card";
import { Eyebrow } from "@/components/ui/tag";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: category.name, description: category.tagline };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = productsByCategory(category.id);
  const links = linksFor(category.id);
  const learnTopic = getLearnTopic(category.id);
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] ?? Icons.Box;

  return (
    <div className="container-page py-32 md:py-40">
      <Eyebrow>{category.group}</Eyebrow>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-accent-strong">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h1 className="text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
              {category.name}
            </h1>
          </div>
          <p className="mt-4 text-balance leading-relaxed text-text-muted">{category.tagline}</p>
        </div>

        {learnTopic && (
          <Link
            href={`/learn/${category.slug}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-4 py-2.5 text-[13px] font-medium text-text transition-colors hover:border-accent-border hover:text-accent-strong"
          >
            Learn how {category.name} works <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {links.length > 0 && (
        <div className="mt-10 rounded-xl border border-border bg-canvas-raised p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Compatibility notes
          </p>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {links.map((link) => {
              const other = link.from === category.id ? link.to : link.from;
              const otherCategory = getCategory(other);
              return (
                <li key={`${link.from}-${link.to}`} className="text-[13px] leading-snug text-text-muted">
                  <span className="text-text">{otherCategory?.name}:</span> {link.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-14">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Sample products
          </p>
          <span className="text-[12px] text-text-faint">{products.length} shown</span>
        </div>

        {products.length === 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
            No sample products in this category yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-4 divider-fade-top pt-10">
        <Link
          href={`/plan`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:text-accent"
        >
          Not sure which one you need? Use the planner <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
