import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden divider-fade-top py-32 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(76,141,255,0.1), transparent 70%)",
        }}
      />
      <div className="container-page relative text-center">
        <Eyebrow>Let&apos;s get started</Eyebrow>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-text sm:text-5xl lg:text-6xl">
          Tell us what you want to do.
          <br />
          Let&apos;s figure out what you need.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <LinkButton href="/plan" size="lg">
            Plan Your Hardware
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/learn" variant="secondary" size="lg">
            Explore Learn
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
