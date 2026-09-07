/**
 * Plain-English translations for spec labels, keyed by "categoryId:specLabel".
 * Falls back to a generic-by-label entry if no category-specific one exists.
 */
const explanations: Record<string, string> = {
  "cpu:Cores / Threads": "More cores let more tasks genuinely run at once — useful for multitasking, rendering, and compiling. Threads fill idle gaps within each core.",
  "cpu:Boost Clock": "The practical ceiling for single-threaded speed, which most games and everyday apps lean on heavily.",
  "cpu:Cache": "Fast on-chip memory that reduces how often the CPU waits on slower RAM — meaningfully affects gaming frame rates.",
  "cpu:TDP": "A rough guide to heat output and cooling requirements — higher means you need a more capable cooler.",
  "cpu:Socket": "Must match your motherboard exactly. Not a performance spec, but a hard compatibility requirement.",
  "cpu:Integrated Graphics": "Lets the system display video without a separate GPU — useful as a fallback or for basic use.",

  "gpu:VRAM": "Useful for high-resolution textures, demanding games, and certain professional workloads. Running out causes stutters or forces lower settings.",
  "gpu:Memory Bus": "A wider bus generally moves more data per cycle — matters most at higher resolutions.",
  "gpu:Boost Clock": "Higher clocks generally mean faster rendering, though architecture matters as much as raw clock speed.",
  "gpu:TDP": "Determines cooling and power supply headroom requirements.",
  "gpu:Outputs": "Determines how many, and what type of, monitors you can connect.",
  "gpu:Recommended PSU": "The minimum power supply wattage recommended to run this card reliably alongside the rest of a typical system.",

  "ram:Capacity": "Sets a ceiling on how much can be held in fast memory before the system falls back to much slower storage.",
  "ram:Speed": "Higher speed generally improves performance, especially on platforms sensitive to memory bandwidth.",
  "ram:Latency": "Lower is better at the same speed — it's the delay before memory responds to a request.",
  "ram:Voltage": "The voltage the memory is rated to run at — mostly relevant for compatibility and stability, not a performance lever on its own.",

  "storage:Capacity": "How much you can install before needing to manage space — size this around your largest actual use case.",
  "storage:Interface": "NVMe is substantially faster than SATA. Worth prioritizing for a primary/OS drive.",
  "storage:Sequential Read": "Affects large file transfers and loading big assets quickly.",
  "storage:Sequential Write": "Affects how fast large files (like exported video) can be saved to the drive.",
  "storage:Endurance": "Total data the drive is rated to write over its lifetime. Typical use rarely approaches this, but sustained heavy workloads should account for it.",

  "monitor:Size": "Larger isn't strictly better — it should match your desk distance and resolution.",
  "monitor:Resolution": "Higher resolution means sharper detail, but requires more GPU power to drive at high frame rates.",
  "monitor:Refresh Rate": "Higher refresh rates show motion more smoothly — but only if your GPU can produce enough frames to match.",
  "monitor:Panel": "IPS panels generally offer the best color accuracy and viewing angles; VA offers stronger contrast; TN is fastest but weakest on color.",
  "monitor:Response Time": "Lower values reduce motion blur in fast-moving scenes.",
  "monitor:Color Coverage": "Higher percentages mean more accurate, vivid color — most relevant for creative and color-critical work.",
};

export function explainSpec(categoryId: string, label: string): string | undefined {
  return explanations[`${categoryId}:${label}`];
}
