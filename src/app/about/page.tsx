import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "What HardwareNeeds is, who built it, and the philosophy behind it.",
};

const chain = [
  { label: "You say", text: "“I want to do X.”" },
  { label: "We translate", text: "That means you need Y." },
  { label: "We recommend", text: "This hardware provides Y." },
  { label: "We explain", text: "Here's why — and how it fits the rest of your system." },
  { label: "You learn", text: "Here's what you can understand about it, permanently." },
];

const whoItsFor = [
  "Students picking their first build, or their first internship laptop",
  "Developers who need a real machine for the workloads they actually run",
  "Small businesses buying a server or NAS without an IT department to ask",
  "Creators, gamers, and hobbyists who just want an honest answer",
];

export default function AboutPage() {
  return (
    <div>
      <div className="container-page py-32 md:py-40">
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
            Hardware, made understandable.
          </h1>
          <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-text-muted">
            HardwareNeeds exists to answer one question well:{" "}
            <span className="text-text">what hardware do I actually need for what I&apos;m trying to accomplish?</span>
          </p>
        </Reveal>
      </div>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div>
              <Eyebrow>Who&apos;s behind this</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-text sm:text-3xl">
                Built by Suvir Rao.
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">
                A high school student at Amador Valley High School with an interest in hardware,
                computing, and technology.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-4 leading-relaxed text-text-muted">
              <p>
                I started HardwareNeeds because I kept running into the same problem myself:
                there are thousands of CPUs, GPUs, prebuilt computers, servers, storage devices,
                and networking products on the market at any given time, and almost none of them
                come with a straight answer to the only question that actually matters —{" "}
                <span className="text-text">will this do what I need it to do?</span>
              </p>
              <p>
                Spec sheets assume you already know what a spec sheet means. Review sites rank
                things against each other without asking what you&apos;re actually building for.
                For students, developers, small businesses, creators, and anyone who isn&apos;t
                already deep into hardware, that gap makes a genuinely simple decision feel
                confusing.
              </p>
              <p>
                HardwareNeeds is my attempt to close that gap: start from what you&apos;re trying
                to do, not from a wall of specifications, and work backward to hardware that
                actually fits — with the reasoning shown, not hidden.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text">
              Who it&apos;s for
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {whoItsFor.map((item, i) => (
              <Reveal key={item} delay={i * 70} className="rounded-lg border border-border bg-surface px-5 py-4">
                <p className="text-[13.5px] leading-relaxed text-text-muted">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text">
              What we won&apos;t say
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-text-muted">
              &ldquo;Buy this because it&apos;s powerful&rdquo; isn&apos;t a reason — it&apos;s a
              sales pitch. Every recommendation on this site follows the same chain of reasoning
              instead:
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-5">
            {chain.map((step, i) => (
              <div key={step.label} className="bg-canvas p-5">
                <span className="font-mono text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[12.5px] font-medium uppercase tracking-[0.06em] text-accent">
                  {step.label}
                </p>
                <p className="mt-2 text-[13.5px] leading-snug text-text-muted">{step.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text">
                About the data on this site
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Every product you see is a real, named product with specs drawn from public
                manufacturer and retailer listings — not invented. Prices are estimated street
                prices, not live inventory, and will drift over time, so every card is labeled
                honestly rather than presented as a live catalog.
              </p>
              <p className="mt-3 leading-relaxed text-text-muted">
                The catalog is a small, carefully-sourced slice of what&apos;s out there, not
                everything — the data model is built to grow into a much larger catalog over
                time without changing how recommendations, compatibility, or comparisons work.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text">
                What HardwareNeeds is for
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Planning a new build, upgrading what you have, understanding what a spec sheet
                actually means, or just learning how a GPU differs from a CPU — this is a reference
                built around understanding, not just a purchase funnel.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="divider-fade-top py-20 md:py-24">
        <Reveal className="container-page flex flex-col items-center gap-5 text-center">
          <p className="max-w-md text-text-muted">
            The best way to understand HardwareNeeds is to use it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LinkButton href="/plan" size="lg">
              Plan your hardware <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/learn" variant="secondary" size="lg">
              Browse Learn
            </LinkButton>
          </div>
          <Link href="/" className="mt-1 text-[13px] text-text-faint hover:text-text-muted">
            Back to home
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
