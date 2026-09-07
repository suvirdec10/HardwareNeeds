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

const groupMeta: Record<
  string,
  { index: string; description: string; variant: "featured" | "compact" | "list" }
> = {
  Compute: {
    index: "01",
    description: "The parts that do the actual work — what everything else exists to support.",
    variant: "featured",
  },
  System: {
    index: "02",
    description: "What holds compute together, feeds it power, and keeps it from overheating.",
    variant: "featured",
  },
  "Display & Input": {
    index: "03",
    description: "What you see, and how you control everything else.",
    variant: "compact",
  },
  Networking: {
    index: "04",
    description: "Getting every device online, reliably.",
    variant: "compact",
  },
  Other: {
    index: "05",
    description: "Everything else worth knowing about.",
    variant: "list",
  },
};

const groupOrder = ["Compute", "System", "Display & Input", "Networking", "Other"];

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

      {groupOrder
        .filter((group) => groups.has(group))
        .map((group) => (
          <CategorySection
            key={group}
            id={group.toLowerCase().replace(/\s+/g, "-")}
            index={groupMeta[group]?.index ?? ""}
            title={group}
            description={groupMeta[group]?.description ?? ""}
            categories={groups.get(group) ?? []}
            variant={groupMeta[group]?.variant ?? "compact"}
          />
        ))}
    </div>
  );
}
