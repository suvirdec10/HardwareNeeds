import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { goals } from "@/lib/data/goals";

const featured = goals.filter((g) =>
  ["gaming", "video-editing", "programming", "streaming", "3d-rendering", "networking"].includes(g.id),
);

export function PlannerTeaser() {
  return (
    <section className="relative divider-fade-top py-28 md:py-40">
      <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <Reveal>
          <div>
            <Eyebrow>Planning</Eyebrow>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.02em] text-text sm:text-5xl">
              Start with what you&apos;re building.
            </h2>
            <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-text-muted">
              Pick a goal, answer only what&apos;s relevant, and get a specific hardware
              recommendation — with the reasoning behind every part of it.
            </p>
            <LinkButton href="/plan" size="lg" className="mt-8">
              Plan your hardware
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>

        {/* Framed product preview — not a link grid, a look at the actual planner. */}
        <Reveal delay={120} className="relative">
          <div className="overflow-hidden rounded-2xl border border-border-strong bg-canvas-raised shadow-[0_40px_80px_-32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-danger/60" />
              <span className="h-2 w-2 rounded-full bg-warning/60" />
              <span className="h-2 w-2 rounded-full bg-success/60" />
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
                hardwareneeds.com/plan
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Step 1 of 2</p>
              <p className="mt-3 text-xl font-medium tracking-[-0.01em] text-text sm:text-2xl">
                What are you building?
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {featured.map((goal) => {
                  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[goal.icon] ?? Icons.Box;
                  return (
                    <Link
                      key={goal.id}
                      href={`/plan?goal=${goal.id}`}
                      className="group flex flex-col items-start gap-2.5 rounded-lg border border-border bg-surface p-3.5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent-border hover:bg-surface-2 sm:p-4"
                    >
                      <Icon className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent-strong" />
                      <span className="text-[12.5px] font-medium text-text">{goal.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-6 -z-10 rounded-[2rem] opacity-60"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, rgba(76,141,255,0.08), transparent 65%)",
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
