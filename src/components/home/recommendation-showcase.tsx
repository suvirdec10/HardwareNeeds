import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Eyebrow, Tag } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getProduct } from "@/lib/data/products";

const reasons = [
  "You said you're building for 1440p gaming — that resolution sets the floor for VRAM and rendering power.",
  "This tier comfortably clears that bar, with room to keep settings high instead of scraping by.",
  "12GB of VRAM covers demanding textures without becoming the bottleneck at this resolution.",
];

export function RecommendationSection() {
  const product = getProduct("raster-x6-12g");
  if (!product) return null;

  return (
    <section className="relative divider-fade-top bg-canvas-raised py-28 md:py-40">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Recommendations</Eyebrow>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.02em] text-text sm:text-5xl">
              Every recommendation has a reason.
            </h2>
            <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-text-muted">
              Not &ldquo;buy this because it&apos;s powerful.&rdquo; Here&apos;s the kind of answer
              you actually get.
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="bg-canvas p-8 sm:p-10">
            <Tag tone="accent">Recommended · GPU</Tag>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-text sm:text-3xl">
              {product.brand} {product.name}
            </h3>
            <p className="mt-2 text-text-muted">{product.summary}</p>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
              Why we recommend it
            </p>
            <ul className="mt-4 space-y-3.5">
              {reasons.map((reason, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text-muted">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {reason}
                </li>
              ))}
            </ul>

            <Link
              href="/plan"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong transition-colors hover:text-accent"
            >
              Get a recommendation like this <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-col justify-between bg-canvas p-8 sm:p-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Important specifications
              </p>
              <dl className="mt-4 divide-y divide-border-faint">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between py-3">
                    <dt className="text-[13.5px] text-text-muted">{spec.label}</dt>
                    <dd className="font-mono text-[13.5px] text-text">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-8 flex items-center justify-between divider-fade-top pt-6">
              <span className="font-mono text-2xl text-text">${product.priceUSD.toLocaleString("en-US")}</span>
              <LinkButton href="/hardware/gpu" variant="secondary" size="sm">
                Compare GPUs
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
