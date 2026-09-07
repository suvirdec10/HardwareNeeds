import type { Metadata } from "next";
import { UpgradeExperience } from "@/components/upgrade/upgrade-experience";

export const metadata: Metadata = {
  title: "Upgrade Mode",
  description: "Tell us what you already have. We'll figure out what's actually worth upgrading.",
};

export default function UpgradePage() {
  return <UpgradeExperience />;
}
