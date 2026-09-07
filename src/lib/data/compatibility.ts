import type { CompatibilityLink } from "./types";

/**
 * Declarative compatibility relationships between hardware categories.
 *
 * This models *why* two categories depend on each other, not live
 * part-to-part validation against real SKUs. It's structured so a future
 * rules engine (checking actual socket/wattage/clearance data per product)
 * can slot in without changing how the UI reads these relationships.
 */
export const compatibilityLinks: CompatibilityLink[] = [
  {
    from: "cpu",
    to: "motherboard",
    kind: "critical",
    label: "Socket must match",
    detail:
      "A CPU only physically fits motherboards built for its socket (e.g. AM5, LGA1851). This is the first compatibility check in any build.",
  },
  {
    from: "motherboard",
    to: "ram",
    kind: "critical",
    label: "Memory type must match",
    detail:
      "Motherboards support one memory generation — DDR4 or DDR5, not both. RAM speed above the board's supported limit will run at a lower speed.",
  },
  {
    from: "cpu",
    to: "cooler",
    kind: "critical",
    label: "Cooler socket support required",
    detail:
      "CPU coolers ship with mounting hardware for specific sockets. Most modern coolers support current sockets, but it's worth confirming for older or newer platforms.",
  },
  {
    from: "cooler",
    to: "case",
    kind: "physical",
    label: "Clearance must fit",
    detail:
      "Air coolers have a height limit set by the case's side panel. Liquid coolers need a radiator mount of the matching size (240mm, 280mm, 360mm) in the case.",
  },
  {
    from: "gpu",
    to: "case",
    kind: "physical",
    label: "Length must fit",
    detail:
      "Longer, more powerful GPUs need more internal case clearance. Compact cases often cap supported GPU length well below full-size cards.",
  },
  {
    from: "gpu",
    to: "psu",
    kind: "critical",
    label: "Power headroom required",
    detail:
      "The power supply must comfortably exceed the combined draw of the GPU, CPU, and other components — with headroom for boost/transient spikes.",
  },
  {
    from: "psu",
    to: "case",
    kind: "physical",
    label: "Form factor must fit",
    detail:
      "Most desktop PSUs use the ATX form factor, but compact cases sometimes require SFX or SFX-L instead.",
  },
  {
    from: "storage",
    to: "motherboard",
    kind: "critical",
    label: "Interface must be supported",
    detail:
      "NVMe drives need an M.2 slot with a matching PCIe generation to hit their rated speed; SATA drives need a SATA header and cable.",
  },
  {
    from: "motherboard",
    to: "case",
    kind: "physical",
    label: "Form factor must fit",
    detail:
      "ATX, Micro-ATX, and Mini-ITX motherboards each need a case built to support that mounting size.",
  },
  {
    from: "case-fans",
    to: "case",
    kind: "physical",
    label: "Mount size must match",
    detail: "Fans are sized (120mm/140mm) to specific mounting points a case provides.",
  },
  {
    from: "monitor",
    to: "gpu",
    kind: "performance",
    label: "Resolution/refresh should match GPU output",
    detail:
      "A monitor's resolution and refresh rate are only fully useful if the GPU can render at that resolution and frame rate for your workloads.",
  },
  {
    from: "wifi-adapter",
    to: "motherboard",
    kind: "physical",
    label: "Requires an open PCIe slot",
    detail: "Internal Wi-Fi adapters need a free PCIe slot and, usually, motherboard antenna headers.",
  },
  {
    from: "access-point",
    to: "router",
    kind: "performance",
    label: "Needs an upstream router",
    detail: "Access points extend coverage but rely on a router (or switch connected to one) to actually reach the internet.",
  },
];

export function linksFor(categoryId: string) {
  return compatibilityLinks.filter(
    (l) => l.from === categoryId || l.to === categoryId,
  );
}

export function linkBetween(a: string, b: string) {
  return compatibilityLinks.find(
    (l) => (l.from === a && l.to === b) || (l.from === b && l.to === a),
  );
}
