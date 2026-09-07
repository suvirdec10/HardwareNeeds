import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { categoriesByGroup } from "@/lib/data/categories";
import { CategorySection } from "@/components/hardware/category-section";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";

export const metadata: Metadata = {
  title: "Hardware Directory",
  description: "Browse every hardware category HardwareNeeds covers.",
};

const groupMeta: Record<string, { description: string; variant: "featured" | "compact" | "list" }> = {
  "Computer Hardware": {
    description: "The core components that make up a desktop system.",
    variant: "featured",
  },
  "Displays & Input": {
    description: "What you see, and how you control everything else.",
    variant: "compact",
  },
  Networking: {
    description: "Getting every device online, reliably.",
    variant: "compact",
  },
  Other: {
    description: "Everything else worth knowing about.",
    variant: "list",
  },
};

export default function HardwarePage() {
  const groups = categoriesByGroup();

  return (
    <div>
      <div className="container-page pb-16 pt-32 md:pt-40">
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

      {Array.from(groups.entries()).map(([group, categories]) => (
        <CategorySection
          key={group}
          id={group.toLowerCase().replace(/\s+/g, "-")}
          title={group}
          description={groupMeta[group]?.description ?? ""}
          categories={categories}
          variant={groupMeta[group]?.variant ?? "compact"}
        />
      ))}
    </div>
  );
}
