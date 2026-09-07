import { Suspense } from "react";
import type { Metadata } from "next";
import { PlanExperience } from "@/components/plan/plan-experience";

export const metadata: Metadata = {
  title: "Plan Your Hardware",
  description: "Tell us what you're building. We'll turn it into a specific hardware recommendation.",
};

export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <PlanExperience />
    </Suspense>
  );
}
