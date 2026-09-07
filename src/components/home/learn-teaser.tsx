import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { learnTopics } from "@/lib/data/learn";
import { getCategory } from "@/lib/data/categories";

const featured = ["cpu", "gpu", "ram", "storage", "motherboard", "monitor"];

export function LearnTeaser() {
  const topics = featured
    .map((id) => learnTopics.find((t) => t.categoryId === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <section className="relative divider-fade-top py-28 md:py-40">
      <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div>
            <Eyebrow>Learning</Eyebrow>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.02em] text-text sm:text-5xl">
              Understand what you&apos;re buying.
            </h2>
            <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-text-muted">
              A hardware encyclopedia written to actually explain things — what each part does, how
              it works, and what specs are worth paying attention to.
            </p>
            <LinkButton href="/learn" variant="secondary" size="lg" className="mt-8">
              Browse all topics
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>

        <div className="divide-y divide-border-faint divider-fade-top">
          {topics.map((topic, i) => {
            const category = getCategory(topic.categoryId);
            if (!category) return null;
            return (
              <Reveal key={topic.categoryId} delay={i * 70} className="first:pt-0 last:pb-0">
                <Link
                  href={`/learn/${category.slug}`}
                  className="group flex items-center justify-between gap-6 py-5 transition-colors"
                >
                  <div>
                    <p className="text-lg font-medium text-text transition-colors group-hover:text-accent-strong">
                      {topic.title}
                    </p>
                    <p className="mt-1 max-w-md text-[13.5px] leading-snug text-text-muted">{topic.hook}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-strong" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
