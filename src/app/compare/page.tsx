import { Suspense } from "react";
import type { Metadata } from "next";
import { CompareExperience } from "@/components/compare/compare-experience";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare hardware side by side, translated into plain English.",
};

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareExperience />
    </Suspense>
  );
}
