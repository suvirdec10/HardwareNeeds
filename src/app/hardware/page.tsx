import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";
import { HardwareExplorer } from "@/components/hardware/hardware-explorer";

export const metadata: Metadata = {
  title: "Hardware Directory",
  description: "Browse every hardware category HardwareNeeds covers.",
};

export default function HardwarePage() {
  return (
    <div>
      <div className="container-page pb-10 pt-32 md:pt-40">
        <Eyebrow>Hardware directory</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-[-0.01em] text-text sm:text-5xl">
            Every category, explained.
          </h1>
          <LinkButton href="/plan" variant="secondary">
            Not sure where to start? Plan instead
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>

      <HardwareExplorer />
    </div>
  );
}
