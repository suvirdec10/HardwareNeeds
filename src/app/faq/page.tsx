import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { faqEntries } from "@/lib/data/faq";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the questions a new HardwareNeeds visitor would actually have.",
};

export default function FaqPage() {
  return (
    <div className="container-page py-32 md:py-40">
      <Reveal>
        <Eyebrow>Frequently asked questions</Eyebrow>
        <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
          Questions people actually ask.
        </h1>
        <p className="mt-5 max-w-xl text-balance leading-relaxed text-text-muted">
          What HardwareNeeds is, how it decides what to recommend, and where it&apos;s honest about
          its limits.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_300px]">
        <Reveal delay={100} className="max-w-3xl">
          <Accordion type="single" collapsible defaultValue={faqEntries[0]?.id}>
            {faqEntries.map((entry) => (
              <AccordionItem key={entry.id} value={entry.id} id={entry.id}>
                <AccordionTrigger>{entry.question}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {entry.answer.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={150} className="hidden lg:block">
          <div className="sticky top-28 space-y-5">
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Jump to a question
              </p>
              <nav className="mt-3 space-y-2.5">
                {faqEntries.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    className="block truncate text-[13px] leading-snug text-text-muted transition-colors hover:text-accent-strong"
                    title={entry.question}
                  >
                    {entry.question}
                  </a>
                ))}
              </nav>
            </div>

            <div className="rounded-xl border border-border bg-canvas-raised p-5">
              <p className="text-[13.5px] leading-relaxed text-text-muted">
                Still have a question this didn&apos;t answer?
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <LinkButton href="/plan" size="sm">
                  Plan your hardware <ArrowRight className="h-3.5 w-3.5" />
                </LinkButton>
                <LinkButton href="/about" variant="secondary" size="sm">
                  About HardwareNeeds
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={150}
        className="mt-16 flex flex-col items-center gap-4 rounded-xl border border-border bg-canvas-raised p-10 text-center lg:hidden"
      >
        <p className="max-w-md text-text-muted">Still have a question this didn&apos;t answer?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <LinkButton href="/plan" size="lg">
            Plan your hardware <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/about" variant="secondary" size="lg">
            About HardwareNeeds
          </LinkButton>
        </div>
        <Link href="/" className="mt-1 text-[13px] text-text-faint hover:text-text-muted">
          Back to home
        </Link>
      </Reveal>
    </div>
  );
}
