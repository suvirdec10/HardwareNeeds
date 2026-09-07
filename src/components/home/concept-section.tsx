import { Eyebrow } from "@/components/ui/tag";

const steps = [
  { label: "Goal", detail: "What you're trying to accomplish." },
  { label: "Hardware", detail: "What that actually requires." },
  { label: "Compatibility", detail: "What fits together, and why." },
  { label: "Recommendation", detail: "A specific, reasoned answer." },
  { label: "Understanding", detail: "Why it's right — and how it works." },
];

export function ConceptSection() {
  return (
    <section className="relative divider-fade-top py-28 md:py-40">
      <div className="container-page">
        <div className="max-w-2xl">
          <Eyebrow>The HardwareNeeds approach</Eyebrow>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.02em] text-text sm:text-5xl">
            We don&apos;t start with hardware.
          </h2>
          <p className="mt-4 max-w-lg text-balance text-lg leading-relaxed text-text-muted">
            Every recommendation on this site follows the same chain of reasoning — so you always
            understand why, not just what.
          </p>
        </div>

        <div className="mt-20 lg:mt-24">
          {/* Desktop: a single connected horizontal flow */}
          <div className="relative hidden lg:block">
            <div className="absolute left-0 right-0 top-[13px] h-px bg-border-strong" aria-hidden />
            <div className="grid grid-cols-5">
              {steps.map((step, i) => (
                <div key={step.label} className="relative pr-8 last:pr-0">
                  <div className="flex items-center gap-3">
                    <span className="relative z-10 h-[9px] w-[9px] shrink-0 rounded-full border-2 border-accent bg-canvas" />
                    <span className="font-mono text-[11px] text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-5 text-xl font-medium tracking-[-0.01em] text-text">{step.label}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile / tablet: vertical flow */}
          <div className="space-y-0 lg:hidden">
            {steps.map((step, i) => (
              <div key={step.label} className="relative flex gap-5 pb-10 last:pb-0">
                {i < steps.length - 1 && (
                  <div className="absolute left-[4px] top-3 bottom-0 w-px bg-border-strong" aria-hidden />
                )}
                <span className="relative z-10 mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full border-2 border-accent bg-canvas" />
                <div>
                  <span className="font-mono text-[11px] text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1 text-xl font-medium tracking-[-0.01em] text-text">{step.label}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
