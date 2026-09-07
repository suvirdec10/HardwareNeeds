import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/tag";

const steps = [
  { label: "Goal", detail: "What you're trying to accomplish." },
  { label: "Hardware", detail: "What that actually requires." },
  { label: "Compatibility", detail: "What fits together, and why." },
  { label: "Recommendation", detail: "A specific, reasoned answer." },
  { label: "Explanation", detail: "Why it's the right fit." },
  { label: "Learning", detail: "How it actually works." },
];

export function ConceptSection() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container-page">
        <div className="max-w-xl">
          <Eyebrow>How HardwareNeeds thinks</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
            We don&apos;t start with hardware. We start with what you&apos;re trying to do.
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-text-muted">
            Every recommendation on this site follows the same reasoning path — so you always
            understand why, not just what.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((step, i) => (
            <div key={step.label} className="group relative bg-canvas p-6 transition-colors duration-300 hover:bg-surface">
              <span className="font-mono text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-[15px] font-medium text-text">{step.label}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-text-muted">{step.detail}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute right-3 top-6 hidden h-3.5 w-3.5 text-text-faint lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
