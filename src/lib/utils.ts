import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const workloadLabels: Record<string, string> = {
  "ai-ml": "AI / ML",
  "llm-inference": "Local LLM",
  cybersecurity: "Cybersecurity",
  "3d-rendering": "3D Rendering",
  "video-editing": "Video Editing",
  "data-science": "Data Science",
  "content-creation": "Content Creation",
  "home-server": "Home Server",
  "small-business": "Small Business",
  "edge-ai": "Edge AI",
};

/** Human-readable label for a free-form use-case/workload tag (e.g. "ai-ml" -> "AI / ML"). */
export function workloadLabel(useCase: string) {
  return workloadLabels[useCase] ?? useCase.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
