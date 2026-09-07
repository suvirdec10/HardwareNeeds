import { Eyebrow } from "@/components/ui/tag";

export function ProblemSection() {
  return (
    <section className="relative divider-fade-top py-28 md:py-40">
      <div className="container-page">
        <Eyebrow>The problem</Eyebrow>
        <div className="mt-8 max-w-4xl space-y-3">
          <p className="text-balance text-3xl font-medium leading-[1.15] tracking-[-0.015em] text-text-faint sm:text-4xl lg:text-5xl">
            Most hardware decisions start with specifications.
          </p>
          <p className="text-balance text-3xl font-medium leading-[1.15] tracking-[-0.015em] text-text-faint sm:text-4xl lg:text-5xl">
            But you don&apos;t start with specifications.
          </p>
          <p className="text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.015em] text-text sm:text-4xl lg:text-5xl">
            You start with what you&apos;re trying to do.
          </p>
        </div>
      </div>
    </section>
  );
}
