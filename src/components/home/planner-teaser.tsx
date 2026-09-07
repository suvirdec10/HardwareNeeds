import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { goals } from "@/lib/data/goals";

const featured = goals.filter((g) =>
  ["gaming", "video-editing", "programming", "3d-rendering", "streaming", "networking"].includes(g.id),
);

export function PlannerTeaser() {
  return (
    <section className="divider-fade-top py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow>The planner</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
              Start with what you&apos;re building.
            </h2>
            <p className="mt-4 text-balance leading-relaxed text-text-muted">
              Answer a few questions specific to your goal. We&apos;ll turn them into a hardware
              recommendation you can actually understand.
            </p>
          </div>
          <LinkButton href="/plan" variant="secondary">
            Open the planner
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((goal) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[goal.icon] ?? Icons.Box;
            return (
              <Link
                key={goal.id}
                href={`/plan?goal=${goal.id}`}
                className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-canvas text-text-muted transition-colors group-hover:border-accent-border group-hover:text-accent-strong">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[13.5px] font-medium text-text">{goal.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
