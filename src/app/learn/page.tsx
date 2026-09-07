import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { learnTopics } from "@/lib/data/learn";
import { getCategory } from "@/lib/data/categories";
import { Eyebrow } from "@/components/ui/tag";

export const metadata: Metadata = {
  title: "Learn",
  description: "A hardware encyclopedia written to actually explain things.",
};

export default function LearnIndexPage() {
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

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learnTopics.map((topic) => {
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
