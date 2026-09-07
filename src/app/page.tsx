import { HeroExperience } from "@/components/home/hero-experience";
import { ConceptSection } from "@/components/home/concept-section";
import { PlannerTeaser } from "@/components/home/planner-teaser";
import { CompatibilityTeaser } from "@/components/home/compatibility-teaser";
import { LearnTeaser } from "@/components/home/learn-teaser";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <HeroExperience />
      <ConceptSection />
      <PlannerTeaser />
      <CompatibilityTeaser />
      <LearnTeaser />
      <FinalCta />
    </>
  );
}
