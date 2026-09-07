import { ArrowRight } from "lucide-react";
import { faqEntries } from "@/lib/data/faq";
import { Eyebrow } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const featured = ["vs-google", "vs-pcpartpicker", "real-specs", "uses-ai", "get-started"];

export function FaqTeaser() {
  const entries = featured
    .map((id) => faqEntries.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <section className="relative divider-fade-top py-28 md:py-40">
      <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.02em] text-text sm:text-5xl">
              Questions people actually ask.
            </h2>
            <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-text-muted">
              What makes this different from a search engine or a parts picker, and how honest it is
              about its limits.
            </p>
            <LinkButton href="/faq" variant="secondary" size="lg" className="mt-8">
              View all questions
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Accordion type="single" collapsible>
            {entries.map((entry) => (
              <AccordionItem key={entry.id} value={entry.id}>
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
      </div>
    </section>
  );
}
