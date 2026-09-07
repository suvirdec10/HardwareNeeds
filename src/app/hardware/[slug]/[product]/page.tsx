import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { getCategory } from "@/lib/data/categories";
import { products, productsByCategory } from "@/lib/data/products";
import { linksFor } from "@/lib/data/compatibility";
import { getLearnTopic } from "@/lib/data/learn";
import { explainSpec } from "@/lib/data/spec-explanations";
import { Tag } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/hardware/product-card";
import { AskAiAboutProduct } from "@/components/hardware/ask-ai-about-product";
import { WhereToBuy } from "@/components/hardware/where-to-buy";
import { Reveal } from "@/components/ui/reveal";
import { workloadLabel } from "@/lib/utils";

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box;
  return <Cmp className={className} strokeWidth={1.75} />;
}

const tierLabel: Record<string, string> = {
  essential: "Essential tier",
  balanced: "Balanced tier",
  performance: "Performance tier",
};

const kindTone = {
  critical: "danger",
  physical: "warning",
  performance: "accent",
} as const;

export function generateStaticParams() {
  return products
    .map((p) => {
      const category = getCategory(p.categoryId);
      return category ? { slug: category.slug, product: p.slug } : null;
    })
    .filter((v): v is { slug: string; product: string } => v !== null);
}

function findProduct(categorySlug: string, productSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return { category: undefined, product: undefined };
  const product = productsByCategory(category.id).find((p) => p.slug === productSlug);
  return { category, product };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}): Promise<Metadata> {
  const { slug, product: productSlug } = await params;
  const { product } = findProduct(slug, productSlug);
  if (!product) return {};
  return {
    title: `${product.brand} ${product.name}`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { slug, product: productSlug } = await params;
  const { category, product } = findProduct(slug, productSlug);
  if (!category || !product) notFound();

  const links = linksFor(category.id);
  const learnTopic = getLearnTopic(category.id);
  const related = productsByCategory(category.id)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const relatedCategoryIds = Array.from(new Set(links.map((l) => (l.from === category.id ? l.to : l.from))));

  return (
    <div className="container-page py-32 md:py-40">
      <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-text-faint">
        <Link href="/hardware" className="hover:text-text-muted">
          Hardware
        </Link>
        <span>/</span>
        <Link href={`/hardware/${category.slug}`} className="hover:text-text-muted">
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-text-muted">{product.name}</span>
      </nav>

      <Reveal>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-accent-strong">
                <Icon name={category.icon} className="h-[18px] w-[18px]" />
              </span>
              <Tag tone="accent">{tierLabel[product.tier] ?? product.tier}</Tag>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                {product.dataConfidence === "verified" ? "Verified specs" : "Reference specs"}
              </span>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
              {product.brand} {product.name}
            </h1>
            <p className="mt-3 text-balance leading-relaxed text-text-muted">{product.summary}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl text-text">${product.priceUSD.toLocaleString("en-US")}</p>
            <p className="mt-1 text-[12px] text-text-faint">Estimated price — not live pricing</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-12 flex flex-wrap gap-3">
        <LinkButton href={`/compare?category=${category.id}`} variant="secondary" size="sm">
          Compare {category.name} options
          <ArrowRight className="h-3.5 w-3.5" />
        </LinkButton>
        <LinkButton href={`/plan?goal=custom-setup`} variant="ghost" size="sm">
          Get a full recommendation
        </LinkButton>
        {learnTopic && (
          <LinkButton href={`/learn/${category.slug}`} variant="ghost" size="sm">
            Learn how {category.name} works
            <ArrowUpRight className="h-3.5 w-3.5" />
          </LinkButton>
        )}
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
              Specifications
            </p>
            <dl className="mt-4 divide-y divide-border-faint rounded-xl border border-border">
              {product.specs.map((spec) => {
                const explanation = explainSpec(category.id, spec.label);
                return (
                  <div key={spec.label} className="px-4 py-3.5 sm:px-5">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[13.5px] text-text-muted">{spec.label}</dt>
                      <dd className="font-mono text-[13.5px] text-text">{spec.value}</dd>
                    </div>
                    {explanation && (
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-text-faint">{explanation}</p>
                    )}
                  </div>
                );
              })}
            </dl>

            {product.useCases && product.useCases.length > 0 && (
              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                  Best uses
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.useCases.map((u) => (
                    <Tag key={u} tone="neutral">
                      {workloadLabel(u)}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-8">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-success">
                <Check className="h-3.5 w-3.5" /> Strengths
              </p>
              <ul className="mt-3 space-y-2">
                {product.strengths.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {product.considerations.length > 0 && (
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-warning">
                  <X className="h-3.5 w-3.5" /> Limitations
                </p>
                <ul className="mt-3 space-y-2">
                  {product.considerations.map((c) => (
                    <li key={c} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-muted">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.upgradeNote && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                  Upgradeability
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">{product.upgradeNote}</p>
              </div>
            )}

            <AskAiAboutProduct product={product} />
          </div>
        </Reveal>
      </div>

      {links.length > 0 && (
        <Reveal className="mt-16 divider-fade-top pt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Compatibility
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {links.map((link) => {
              const otherId = link.from === category.id ? link.to : link.from;
              const otherCategory = getCategory(otherId);
              if (!otherCategory) return null;
              return (
                <div key={`${link.from}-${link.to}`} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Tag tone={kindTone[link.kind]}>{otherCategory.name}</Tag>
                    <span className="text-[13px] font-medium text-text">{link.label}</span>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-text-muted">{link.detail}</p>
                </div>
              );
            })}
          </div>
          {relatedCategoryIds.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedCategoryIds.map((id) => {
                const c = getCategory(id);
                if (!c) return null;
                return (
                  <Link
                    key={id}
                    href={`/hardware/${c.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-strong hover:text-accent"
                  >
                    Browse {c.name} <ArrowRight className="h-3 w-3" />
                  </Link>
                );
              })}
            </div>
          )}
        </Reveal>
      )}

      <Reveal className="mt-16 divider-fade-top pt-12">
        <WhereToBuy product={product} />
      </Reveal>

      {related.length > 0 && (
        <Reveal className="mt-16 divider-fade-top pt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
            Related {category.name} options
          </p>
          <div
            className={`mt-5 grid gap-5 sm:grid-cols-2 ${related.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
          >
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
