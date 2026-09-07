import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-canvas-raised px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(76,141,255,0.10), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
              You said what you want to do.
              <br className="hidden sm:block" /> Let&apos;s figure out what you need.
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <LinkButton href="/plan" size="lg">
                Plan Your Hardware
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/learn" variant="secondary" size="lg">
                Explore Learn
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
