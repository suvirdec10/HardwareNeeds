import { HeroExperience } from "@/components/home/hero-experience";
import { ProblemSection } from "@/components/home/problem-section";
import { ConceptSection } from "@/components/home/concept-section";
import { PlannerTeaser } from "@/components/home/planner-teaser";
import { RecommendationSection } from "@/components/home/recommendation-showcase";
import { LearnTeaser } from "@/components/home/learn-teaser";
import { CompatibilityTeaser } from "@/components/home/compatibility-teaser";
import { FaqTeaser } from "@/components/home/faq-teaser";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <HeroExperience />
      <ProblemSection />
      <ConceptSection />
      <PlannerTeaser />
      <RecommendationSection />
      <LearnTeaser />
      <CompatibilityTeaser />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
