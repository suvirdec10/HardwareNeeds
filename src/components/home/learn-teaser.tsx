import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { learnTopics } from "@/lib/data/learn";
import { getCategory } from "@/lib/data/categories";

const featured = ["cpu", "gpu", "ram", "storage"];

export function LearnTeaser() {
  const topics = featured
    .map((id) => learnTopics.find((t) => t.categoryId === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow>Learn</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
              Understand what you&apos;re buying.
            </h2>
            <p className="mt-4 text-balance leading-relaxed text-text-muted">
              A hardware encyclopedia written to actually explain things — what each part does,
              how it works, and what specs are worth paying attention to.
            </p>
          </div>
          <LinkButton href="/learn" variant="secondary">
            Browse all topics
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => {
            const category = getCategory(topic.categoryId);
            return (
              <Link
                key={topic.categoryId}
                href={`/learn/${category?.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                  {topic.title}
                </span>
                <p className="mt-3 text-[14.5px] leading-relaxed text-text-muted">{topic.hook}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-text transition-colors group-hover:text-accent-strong">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
