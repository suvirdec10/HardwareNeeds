/**
 * Plain-English translations for spec labels, keyed by "categoryId:specLabel".
 * Falls back to a generic-by-label entry if no category-specific one exists.
 * Only the specs that actually show up in the catalog need an entry —
 * this is meant to demystify the confusing ones, not annotate everything.
 */
const explanations: Record<string, string> = {
  "cpu:Cores / Threads": "More cores let more tasks genuinely run at once — useful for multitasking, rendering, and compiling. Threads fill idle gaps within each core.",
  "cpu:Base / Boost Clock": "Base is the guaranteed minimum speed; boost is the practical ceiling for single-threaded speed, which most games and everyday apps lean on heavily.",
  "cpu:P-Core Boost Clock": "The top speed of this chip's performance cores — the ones handling your most demanding single task at any moment.",
  "cpu:L3 Cache": "Fast on-chip memory that reduces how often the CPU waits on slower RAM — meaningfully affects gaming frame rates.",
  "cpu:TDP": "A rough guide to heat output and cooling requirements — higher means you need a more capable cooler.",
  "cpu:Socket": "Must match your motherboard exactly. Not a performance spec, but a hard compatibility requirement.",
  "cpu:Integrated Graphics": "Lets the system display video without a separate GPU — useful as a fallback or for basic use.",

  "gpu:VRAM": "Memory dedicated to the graphics card. More VRAM helps with high-resolution textures, larger AI models, and GPU-heavy workloads — running out causes stutters or forces lower settings.",
  "gpu:Memory Bus": "A wider bus generally moves more data per cycle — matters most at higher resolutions.",
  "gpu:Boost Clock": "Higher clocks generally mean faster rendering, though architecture matters as much as raw clock speed.",
  "gpu:TDP": "Determines cooling and power supply headroom requirements.",
  "gpu:Outputs": "Determines how many, and what type of, monitors you can connect.",
  "gpu:Recommended PSU": "The minimum power supply wattage recommended to run this card reliably alongside the rest of a typical system.",
  "gpu:Form Factor": "Whether the card fits a standard case slot or needs a specific low-profile / server chassis.",
  "gpu:Target Use": "What the card is actually tuned and marketed for — not every GPU is meant for gaming.",

  "ram:Capacity": "Sets a ceiling on how much can be held in fast memory before the system falls back to much slower storage.",
  "ram:Speed": "Higher speed generally improves performance, especially on platforms sensitive to memory bandwidth.",
  "ram:Latency": "Lower is better at the same speed — it's the delay before memory responds to a request.",
  "ram:Voltage": "The voltage the memory is rated to run at — mostly relevant for compatibility and stability, not a performance lever on its own.",
  "ram:Error Correction": "ECC memory can detect and fix single-bit errors automatically. Standard on servers where silent corruption is unacceptable; requires CPU and motherboard support.",

  "storage:Capacity": "How much you can install before needing to manage space — size this around your largest actual use case.",
  "storage:Interface": "NVMe is substantially faster than SATA. Worth prioritizing for a primary/OS drive.",
  "storage:Sequential Read": "Affects large file transfers and loading big assets quickly.",
  "storage:Sequential Write": "Affects how fast large files (like exported video) can be saved to the drive.",
  "storage:Endurance": "Total data the drive is rated to write over its lifetime. Typical use rarely approaches this, but sustained heavy workloads should account for it.",
  "storage:Spindle Speed": "How fast a hard drive's platters physically spin — higher generally means faster access, at the cost of more noise and heat.",

  "motherboard:Socket": "The physical and electrical interface the CPU plugs into. A motherboard only supports CPUs built for its exact socket.",
  "motherboard:Chipset": "Determines which CPU generation, overclocking features, and PCIe/USB capabilities the board supports.",
  "motherboard:Form Factor": "Sets which cases the board physically fits — ATX, Micro-ATX, and Mini-ITX each need matching case support.",
  "motherboard:RAM Support": "The maximum memory type, speed, and total capacity the board can run.",
  "motherboard:M.2 Slots": "Each slot holds one NVMe SSD directly on the board — more slots mean more fast storage without cables.",
  "motherboard:PCIe": "The expansion slot(s) used by the GPU and other add-in cards — generation and lane count affect maximum throughput.",
  "motherboard:Wi-Fi": "Built-in wireless networking, so you don't need a separate USB or PCIe Wi-Fi adapter.",

  "psu:Wattage": "The maximum power the supply can deliver. Needs headroom above your GPU + CPU + rest-of-system combined draw, not just enough to match it exactly.",
  "psu:Efficiency": "80+ certification tiers (Bronze/Gold/Platinum) indicate how much wall power is wasted as heat — higher tiers run cooler and cost less to operate.",
  "psu:Modularity": "Fully modular lets you attach only the cables you need, for cleaner airflow and cable management. Non-modular means every cable is permanently attached.",
  "psu:Warranty": "A longer warranty is often a signal of higher build quality — PSU failures can damage other components, so this matters more than on most parts.",

  "cooler:Type": "Air coolers are simpler and near-maintenance-free; liquid (AIO) coolers handle higher heat loads and free up space around the CPU socket.",
  "cooler:Height": "Must clear your case's side panel — check your case's maximum cooler height before buying a tall air cooler.",
  "cooler:Radiator": "The size of a liquid cooler's radiator — larger radiators dissipate more heat, but need a case with matching mount support.",
  "cooler:Fan": "The fan(s) that push air through the cooler — larger and more fans generally move more air at the same noise level.",
  "cooler:Fans": "The fan(s) that push air through the cooler — larger and more fans generally move more air at the same noise level.",
  "cooler:Noise": "Lower dBA means quieter operation — matters most if the PC sits near you.",
  "cooler:TDP Rating": "The maximum CPU heat output this cooler is rated to handle — pick a cooler rated above your CPU's TDP.",

  "case:Form Factor Support": "Which motherboard sizes physically fit — always check this against the motherboard you're pairing it with.",
  "case:Max GPU Length": "The longest graphics card the case can physically fit — measure your GPU choice against this before buying.",
  "case:Max Cooler Height": "The tallest air cooler the case can fit under its side panel.",
  "case:Radiator Support": "Which liquid cooler radiator sizes (240mm, 280mm, 360mm) the case has mounting points for.",
  "case:Included Fans": "Fans that ship with the case — more included fans means less you need to buy separately for good airflow.",

  "monitor:Size": "Larger isn't strictly better — it should match your desk distance and resolution.",
  "monitor:Resolution": "Higher resolution means sharper detail, but requires more GPU power to drive at high frame rates.",
  "monitor:Refresh Rate": "Higher refresh rates show motion more smoothly — but only if your GPU can produce enough frames to match.",
  "monitor:Panel": "IPS panels generally offer the best color accuracy and viewing angles; VA offers stronger contrast; TN is fastest but weakest on color.",
  "monitor:Response Time": "Lower values reduce motion blur in fast-moving scenes.",
  "monitor:Color Coverage": "Higher percentages mean more accurate, vivid color — most relevant for creative and color-critical work.",
  "monitor:HDR": "Higher dynamic range shows brighter highlights and deeper shadows simultaneously — needs real local dimming zones to matter, not just an HDR label.",

  "ai-accelerator:VRAM": "Memory dedicated to the accelerator. Sets the ceiling on how large a model (or how many concurrent requests) it can hold.",
  "ai-accelerator:TDP": "Power draw — data-center accelerators are often tuned for far lower TDP than a gaming GPU with similar compute.",

  "nas:Bays": "How many drives the enclosure can hold — sets your maximum total and redundant (RAID) storage capacity.",
  "nas:Memory": "RAM used to run the NAS's operating system and any apps/containers — more helps with virtualization and heavier self-hosted workloads.",

  "single-board-computer:Memory": "Fixed at purchase on most single-board computers — you can't add more later, so buy for your actual project's needs.",
  "single-board-computer:Power": "Total power draw — matters for battery/solar projects and for choosing an adequate power supply.",

  "edge-ai-device:AI Performance": "A rough throughput measure (TOPS) for how much AI inference work the device can do per second — higher supports larger or faster models.",
  "edge-ai-device:Memory": "Shared between the CPU and GPU on these devices — it's the real limit on how large a model you can run locally.",
};

export function explainSpec(categoryId: string, label: string): string | undefined {
  return explanations[`${categoryId}:${label}`];
}
