import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight, Boxes } from "lucide-react";
import { learnTopics } from "@/lib/data/learn";
import { getCategory } from "@/lib/data/categories";
import { Eyebrow, Tag } from "@/components/ui/tag";

export const metadata: Metadata = {
  title: "Learn",
  description: "A hardware encyclopedia written to actually explain things.",
};

export default function LearnIndexPage() {
  const featured = learnTopics.filter((t) => t.hasVisualization);
  const rest = learnTopics.filter((t) => !t.hasVisualization);

  return (
    <div className="container-page py-32 md:py-40">
      <Eyebrow>Learn</Eyebrow>
      <h1 className="mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
        Understand what you&apos;re buying.
      </h1>
      <p className="mt-4 max-w-lg text-balance leading-relaxed text-text-muted">
        What each part is, what it does, how it works, and what specs actually matter — written
        to be understood, not skimmed past.
      </p>

      {featured.length > 0 && (
        <div className="mt-14 space-y-4">
          {featured.map((topic) => {
            const category = getCategory(topic.categoryId);
            if (!category) return null;
            return (
              <Link
                key={topic.categoryId}
                href={`/learn/${category.slug}`}
                className="group grid gap-6 overflow-hidden rounded-2xl border border-accent-border bg-gradient-to-br from-accent-dim to-transparent p-8 transition-colors hover:border-accent sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent-border bg-canvas text-accent-strong">
                  <Boxes className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div>
                  <Tag tone="accent">Interactive deep-dive</Tag>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-text">
                    {topic.title}: what&apos;s actually inside.
                  </p>
                  <p className="mt-1.5 max-w-lg text-[13.5px] leading-relaxed text-text-muted">
                    {topic.hook} Explore a 3D breakdown of the die, cores, and cache as you scroll.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-accent-strong transition-transform group-hover:translate-x-1 sm:justify-self-end" />
              </Link>
            );
          })}
          <p className="text-[12.5px] text-text-faint">
            More components are getting this treatment over time — starting with the parts that
            benefit most from seeing how they actually work.
          </p>
        </div>
      )}

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((topic) => {
          const category = getCategory(topic.categoryId);
          if (!category) return null;
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] ?? Icons.Box;
          return (
            <Link
              key={topic.categoryId}
              href={`/learn/${category.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2"
            >
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-canvas text-text-muted transition-colors group-hover:border-accent-border group-hover:text-accent-strong">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <p className="mt-4 text-[15px] font-medium text-text">{topic.title}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-text-muted">{topic.hook}</p>
              </div>
              <ArrowRight className="mt-6 h-3.5 w-3.5 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
