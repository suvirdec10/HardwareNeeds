import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "What HardwareNeeds is, and the philosophy behind it.",
};

const chain = [
  { label: "You say", text: "“I want to do X.”" },
  { label: "We translate", text: "That means you need Y." },
  { label: "We recommend", text: "This hardware provides Y." },
  { label: "We explain", text: "Here's why — and how it fits the rest of your system." },
  { label: "You learn", text: "Here's what you can understand about it, permanently." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="container-page py-32 md:py-40">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
          Hardware, made understandable.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-text-muted">
          HardwareNeeds exists to answer one question well:{" "}
          <span className="text-text">what hardware do I actually need for what I&apos;m trying to accomplish?</span>
        </p>
      </div>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page">
          <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text">
            What we won&apos;t say
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-text-muted">
            &ldquo;Buy this because it&apos;s powerful&rdquo; isn&apos;t a reason — it&apos;s a
            sales pitch. Every recommendation on this site follows the same chain of reasoning
            instead:
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-5">
            {chain.map((step, i) => (
              <div key={step.label} className="bg-canvas p-5">
                <span className="font-mono text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[12.5px] font-medium uppercase tracking-[0.06em] text-accent">
                  {step.label}
                </p>
                <p className="mt-2 text-[13.5px] leading-snug text-text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text">
              About the data on this site
            </h2>
            <p className="mt-3 leading-relaxed text-text-muted">
              Every product, price, and spec you see here is sample data, built to be realistic
              but not tied to live inventory or pricing. Every product card and recommendation is
              labeled as sample data for exactly this reason.
            </p>
            <p className="mt-3 leading-relaxed text-text-muted">
              The recommendation logic, compatibility rules, and upgrade reasoning are real —
              built to be swapped onto a live catalog and real compatibility data without changing
              how the site works.
            </p>
          </div>
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
        </div>
      </section>

      <section className="divider-fade-top py-20 md:py-24">
        <div className="container-page flex flex-col items-center gap-5 text-center">
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
        </div>
      </section>
    </div>
  );
}
