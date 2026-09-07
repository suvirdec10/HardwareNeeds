import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getCategory } from "@/lib/data/categories";
import { learnTopics, getLearnTopic } from "@/lib/data/learn";
import { Eyebrow } from "@/components/ui/tag";
import { CpuScrollDemo } from "@/components/learn/cpu-scroll-demo";

export function generateStaticParams() {
  return learnTopics
    .map((t) => getCategory(t.categoryId))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  const topic = category ? getLearnTopic(category.id) : undefined;
  if (!topic) return {};
  return { title: topic.title, description: topic.hook };
}

export default async function LearnTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  const topic = category ? getLearnTopic(category.id) : undefined;
  if (!category || !topic) notFound();

  const relatedTopics = topic.interactsWith
    .map((rel) => {
      const relCategory = getCategory(rel.categoryId);
      const relTopic = getLearnTopic(rel.categoryId);
      if (!relCategory || !relTopic) return null;
      return { category: relCategory, topic: relTopic, note: rel.note };
    })
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .slice(0, 3);

  return (
    <div>
      <div className="container-page py-32 md:py-40">
        <div className="max-w-2xl">
          <Eyebrow>{category.group} · Learn</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
            {topic.title}
          </h1>
          <p className="mt-4 text-balance text-lg leading-relaxed text-text-muted">{topic.hook}</p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">What is it?</p>
            <p className="mt-3 max-w-prose leading-relaxed text-text-muted">{topic.whatIsIt}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">What does it do?</p>
            <p className="mt-3 max-w-prose leading-relaxed text-text-muted">{topic.whatItDoes}</p>
          </div>
        </div>
      </div>

      {topic.hasVisualization && category.id === "cpu" && (
        <div className="border-y border-border bg-canvas-raised">
          <div className="container-page py-20">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-text">
              What&apos;s actually inside.
            </h2>
          </div>
          <CpuScrollDemo />
        </div>
      )}

      {!topic.hasVisualization && (
        <div className="divider-fade-top">
          <div className="container-page py-20">
            <Eyebrow>How it works</Eyebrow>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {topic.howItWorks.map((section, i) => (
                <div
                  key={section.heading}
                  className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
                >
                  <span className="font-mono text-[11px] text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1.5 text-[15px] font-medium text-text">{section.heading}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="divider-fade-top bg-canvas-raised">
        <div className="container-page py-20">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>Specs that matter</Eyebrow>
              <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
                {topic.specsThatMatter.map((spec) => (
                  <div key={spec.name} className="p-5">
                    <p className="text-[14px] font-medium text-text">{spec.name}</p>
                    <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-text-muted">{spec.matters}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <Eyebrow>Why it matters</Eyebrow>
                <p className="mt-3 max-w-prose leading-relaxed text-text-muted">{topic.whyItMatters}</p>
              </div>
              <div>
                <Eyebrow>Performance impact</Eyebrow>
                <p className="mt-3 max-w-prose leading-relaxed text-text-muted">{topic.performanceImpact}</p>
              </div>
              {topic.interactsWith.length > 0 && (
                <div>
                  <Eyebrow>Works together with</Eyebrow>
                  <ul className="mt-3 space-y-2.5">
                    {topic.interactsWith.map((rel) => {
                      const relCategory = getCategory(rel.categoryId);
                      if (!relCategory) return null;
                      return (
                        <li key={rel.categoryId} className="flex items-start gap-2 text-[13.5px] text-text-muted">
                          <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-text-faint" />
                          <span>
                            <Link
                              href={`/learn/${relCategory.slug}`}
                              className="font-medium text-text hover:text-accent-strong"
                            >
                              {relCategory.name}
                            </Link>{" "}
                            — {rel.note}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="divider-fade-top">
        <div className="container-page grid gap-10 py-20 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-danger">
              <AlertTriangle className="h-3.5 w-3.5" /> Common mistakes
            </p>
            <ul className="mt-4 space-y-3">
              {topic.commonMistakes.map((mistake) => (
                <li key={mistake} className="text-[13.5px] leading-relaxed text-text-muted">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> How to choose
            </p>
            <ul className="mt-4 space-y-3">
              {topic.howToChoose.map((tip) => (
                <li key={tip} className="text-[13.5px] leading-relaxed text-text-muted">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {relatedTopics.length > 0 && (
        <div className="divider-fade-top">
          <div className="container-page py-20">
            <Eyebrow>Related topics</Eyebrow>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {relatedTopics.map((rt) => (
                <Link
                  key={rt.category.id}
                  href={`/learn/${rt.category.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2"
                >
                  <div>
                    <p className="text-[14.5px] font-medium text-text">{rt.topic.title}</p>
                    <p className="mt-1.5 text-[12.5px] leading-snug text-text-muted">{rt.note}</p>
                  </div>
                  <ArrowRight className="mt-4 h-3.5 w-3.5 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="divider-fade-top">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-16">
          <p className="text-text-muted">See {category.name} products and pricing, or get a build recommended.</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/hardware/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:text-accent"
            >
              Browse {category.name} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/compare?category=${category.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text"
            >
              Compare options <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/plan"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text"
            >
              Plan your hardware <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
