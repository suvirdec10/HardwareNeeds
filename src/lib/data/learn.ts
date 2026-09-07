import type { LearnTopic } from "./types";

export const learnTopics: LearnTopic[] = [
  {
    categoryId: "cpu",
    title: "CPU",
    hook: "The general-purpose processor that executes almost every instruction your system runs.",
    whatIsIt:
      "The CPU (Central Processing Unit) is the chip that carries out the instructions of your operating system and applications. Everything from opening a file to running a game's logic passes through it.",
    whatItDoes:
      "It fetches instructions, decodes them, and executes them — billions of times per second, across multiple independent cores working in parallel.",
    howItWorks: [
      {
        heading: "Cores",
        body: "A CPU contains multiple physical cores, each capable of independently executing instructions. More cores let more tasks run truly in parallel — helpful for multitasking, compiling, and rendering.",
      },
      {
        heading: "Threads",
        body: "Many CPUs run two threads per core (simultaneous multithreading), letting each core juggle two instruction streams to fill idle execution time.",
      },
      {
        heading: "Cache",
        body: "Small, extremely fast on-chip memory (L1/L2/L3) that stores frequently used data close to the cores, avoiding slower trips to system RAM.",
      },
      {
        heading: "Clock speed",
        body: "How many cycles per second a core can execute, measured in GHz. Higher clocks generally mean faster execution of a single instruction stream, which matters most for tasks that can't be split across cores.",
      },
    ],
    specsThatMatter: [
      { name: "Cores / Threads", matters: "Determines how much work can genuinely run in parallel — matters for multitasking, rendering, and compiling." },
      { name: "Boost Clock", matters: "The practical ceiling for single-threaded speed, which most games and everyday apps lean on heavily." },
      { name: "Cache", matters: "Larger cache reduces how often the CPU waits on slower RAM — a meaningful factor in gaming frame rates." },
      { name: "TDP", matters: "A rough guide to how much heat the cooler needs to dissipate and how much power the CPU draws under load." },
    ],
    whyItMatters:
      "The CPU sets a ceiling on how fast everything else in the system can be fed work. A powerful GPU paired with a weak CPU will often sit idle waiting for instructions — this is called a CPU bottleneck.",
    performanceImpact:
      "For gaming, single-core speed and cache size tend to matter most, especially at lower resolutions. For rendering, compiling, and encoding, core/thread count tends to matter more because those workloads split cleanly across many cores.",
    interactsWith: [
      { categoryId: "motherboard", note: "Must match the board's CPU socket." },
      { categoryId: "cooler", note: "Needs a cooler rated for its TDP and socket." },
      { categoryId: "ram", note: "Memory speed and latency affect how well a fast CPU is fed data." },
      { categoryId: "gpu", note: "A weak CPU can bottleneck a powerful GPU, especially at lower resolutions." },
    ],
    commonMistakes: [
      "Buying a high-end GPU with a low-end CPU, creating a bottleneck.",
      "Ignoring cooler requirements for high-TDP performance-tier CPUs.",
      "Assuming more cores always means faster gaming — many games favor fewer, faster cores.",
    ],
    howToChoose: [
      "Start from your primary workload: gaming leans on single-core speed, creative/technical work leans on core count.",
      "Match the CPU tier to your GPU tier so neither bottlenecks the other.",
      "Confirm the cooler you're pairing it with is rated for its TDP.",
    ],
    hasVisualization: true,
  },
  {
    categoryId: "gpu",
    title: "GPU",
    hook: "A massively parallel processor built to render graphics and accelerate parallel workloads.",
    whatIsIt:
      "The GPU (Graphics Processing Unit) is a specialized processor with thousands of small cores optimized for doing the same kind of calculation across huge amounts of data simultaneously — like shading millions of pixels.",
    whatItDoes:
      "It renders 3D scenes, applies visual effects, decodes/encodes video, and accelerates other highly parallel workloads like 3D rendering and some AI tasks.",
    howItWorks: [
      {
        heading: "Parallel cores",
        body: "Instead of a few very fast cores like a CPU, a GPU has thousands of simpler cores that each handle a small piece of a much larger calculation at the same time.",
      },
      {
        heading: "VRAM",
        body: "Dedicated high-speed memory that stores textures, frame buffers, and geometry the GPU needs immediate access to. Running out of VRAM causes stuttering or forces lower texture quality.",
      },
      {
        heading: "Memory bandwidth",
        body: "How quickly the GPU can move data in and out of VRAM — set by the width of the memory bus and the memory's speed. Higher bandwidth matters more at higher resolutions.",
      },
    ],
    specsThatMatter: [
      { name: "VRAM", matters: "Useful for high-resolution textures, demanding games, and certain professional or creative workloads." },
      { name: "Memory Bus", matters: "A wider bus generally moves more data per cycle, mattering most at higher resolutions." },
      { name: "TDP", matters: "Determines cooling and power supply headroom requirements." },
      { name: "Outputs", matters: "Determines how many and what type of monitors you can connect." },
    ],
    whyItMatters:
      "The GPU is usually the single biggest factor in gaming frame rates and the primary accelerator for 3D rendering, video editing effects, and many creative tools.",
    performanceImpact:
      "Resolution scales GPU demand dramatically — going from 1080p to 4K roughly quadruples the pixel count the GPU has to render. Refresh rate matters too: a 240Hz monitor needs far more frames per second than a 60Hz one to look smooth.",
    interactsWith: [
      { categoryId: "psu", note: "Power draw must fit comfortably within the PSU's rated wattage." },
      { categoryId: "case", note: "Physical length must fit within the case's clearance." },
      { categoryId: "cpu", note: "A weak CPU can prevent a strong GPU from reaching its full frame rate." },
      { categoryId: "monitor", note: "Resolution and refresh rate should be matched to what the GPU can actually drive." },
    ],
    commonMistakes: [
      "Undersizing the power supply for the GPU's actual power draw.",
      "Buying a 4K monitor without a GPU capable of driving it at playable frame rates.",
      "Not checking case clearance before buying a large, high-end card.",
    ],
    howToChoose: [
      "Pick VRAM and performance tier based on your target resolution and refresh rate, not just budget.",
      "Check the recommended PSU wattage against your actual power supply.",
      "Measure your case's maximum GPU length before buying a large card.",
    ],
  },
  {
    categoryId: "ram",
    title: "RAM",
    hook: "Fast, short-term memory that holds the data your CPU and GPU are actively working with.",
    whatIsIt:
      "RAM (Random Access Memory) is volatile, high-speed memory that temporarily stores data and instructions actively in use — unlike storage, it's cleared when the system powers off.",
    whatItDoes:
      "It sits between storage and the CPU, giving the processor near-instant access to whatever it's currently working on, rather than reading from much slower storage every time.",
    howItWorks: [
      {
        heading: "Capacity",
        body: "How much data can be held at once. Running out forces the system to swap data to much slower storage, causing stutters and slowdowns.",
      },
      {
        heading: "Speed",
        body: "Measured in MT/s (often labeled MHz), speed affects how quickly data moves between RAM and the CPU. Some platforms are more sensitive to RAM speed than others.",
      },
      {
        heading: "Dual-channel",
        body: "Using two matched sticks instead of one lets the memory controller read/write across both simultaneously, roughly doubling effective bandwidth.",
      },
    ],
    specsThatMatter: [
      { name: "Capacity", matters: "Sets a hard ceiling on how much can be held in fast memory before the system falls back to slower storage." },
      { name: "Speed", matters: "Higher speed generally improves performance, especially on platforms sensitive to memory bandwidth." },
      { name: "Latency (CL)", matters: "Lower is better at the same speed — it's the delay before memory responds to a request." },
    ],
    whyItMatters:
      "Insufficient RAM is one of the most common causes of a system that feels slow despite having a fast CPU and GPU — it forces constant, slow round-trips to storage.",
    performanceImpact:
      "Gaming typically plateaus in benefit past a certain capacity, but creative work (video editing, 3D, many browser tabs, virtual machines) can meaningfully benefit from more.",
    interactsWith: [
      { categoryId: "motherboard", note: "Must match the memory type (e.g. DDR5) the board supports." },
      { categoryId: "cpu", note: "Some CPU platforms see larger real-world gains from faster memory than others." },
    ],
    commonMistakes: [
      "Buying a single stick instead of a matched pair, losing dual-channel bandwidth.",
      "Buying RAM faster than the motherboard/CPU officially supports without checking compatibility lists.",
      "Underestimating capacity needs for heavy multitasking or large creative projects.",
    ],
    howToChoose: [
      "Match capacity to your workload — everyday use is fine with less, heavy creative work benefits from more.",
      "Buy in a matched dual-channel kit, not a single stick.",
      "Confirm the motherboard supports the memory type and speed you're buying.",
    ],
  },
  {
    categoryId: "storage",
    title: "Storage",
    hook: "Where your operating system, applications, and files persist between power cycles.",
    whatIsIt:
      "Storage holds data permanently — unlike RAM, it keeps everything after the system is powered off. Modern systems typically use SSDs (solid-state), which have no moving parts and are far faster than older mechanical hard drives.",
    whatItDoes:
      "It stores the operating system, installed applications, games, and personal files, and feeds data to the rest of the system on demand.",
    howItWorks: [
      {
        heading: "NVMe vs SATA",
        body: "NVMe drives connect directly over PCIe lanes for very high speed. SATA drives (SSD or HDD) use an older, slower interface but remain useful for bulk, low-cost storage.",
      },
      {
        heading: "Sequential vs random performance",
        body: "Sequential speed matters for large file transfers; random performance matters more for everyday responsiveness — booting, launching apps, loading game levels.",
      },
      {
        heading: "Endurance",
        body: "SSDs have a finite number of write cycles, rated in TBW (terabytes written). Typical use rarely approaches this limit, but sustained heavy write workloads should account for it.",
      },
    ],
    specsThatMatter: [
      { name: "Capacity", matters: "Sets how much you can install and store before needing to manage space." },
      { name: "Interface", matters: "NVMe is substantially faster than SATA — worth prioritizing for a primary drive." },
      { name: "Sequential Read/Write", matters: "Affects large file transfer and load times for big assets." },
    ],
    whyItMatters:
      "Storage speed directly affects boot time, application launch time, and level/asset load times — one of the most noticeable everyday performance factors.",
    performanceImpact:
      "Moving from a hard drive to an SSD is one of the largest felt upgrades possible. Moving from SATA SSD to NVMe is a smaller, but still real, improvement — most noticeable in large file operations.",
    interactsWith: [
      { categoryId: "motherboard", note: "M.2 slot availability and PCIe generation determine the maximum speed achievable." },
    ],
    commonMistakes: [
      "Underestimating how quickly game libraries and creative project files fill a drive.",
      "Buying a high-speed NVMe drive but installing it in a PCIe slot/generation that limits it.",
      "Not separating an OS drive from bulk storage on tight budgets.",
    ],
    howToChoose: [
      "Prioritize NVMe for your primary/OS drive when the budget allows.",
      "Size capacity around your largest actual use case (game library, video project files), not just the OS.",
      "For sustained heavy write workloads, check endurance (TBW) ratings.",
    ],
  },
  {
    categoryId: "motherboard",
    title: "Motherboard",
    hook: "The board that physically connects every other component and defines what's compatible with what.",
    whatIsIt:
      "The motherboard is the central circuit board that every other component connects to — CPU, RAM, storage, GPU, power, and peripherals all attach to it directly or indirectly.",
    whatItDoes:
      "It routes power and data between components, and its chipset determines which features (PCIe lanes, USB ports, overclocking support) are available.",
    howItWorks: [
      {
        heading: "Socket",
        body: "A physical and electrical interface that only accepts CPUs designed for it. This is the first, hardest compatibility constraint in any build.",
      },
      {
        heading: "Chipset",
        body: "Controls available features — how many M.2 slots, USB ports, and PCIe lanes you get, and whether overclocking is supported.",
      },
      {
        heading: "Form factor",
        body: "ATX, Micro-ATX, and Mini-ITX describe physical size, which determines case compatibility and how much expansion room you have.",
      },
    ],
    specsThatMatter: [
      { name: "Socket", matters: "Must exactly match your CPU — there is no flexibility here." },
      { name: "RAM Support", matters: "Defines the maximum memory type, speed, and capacity you can install." },
      { name: "M.2 Slots", matters: "Sets how many fast NVMe drives you can install without adapters." },
      { name: "PCIe", matters: "Determines GPU and expansion card bandwidth and slot availability." },
    ],
    whyItMatters:
      "The motherboard is the compatibility backbone of a build — it constrains which CPU, RAM, storage, and case you can use, more than almost any other component.",
    performanceImpact:
      "A motherboard rarely adds raw performance itself, but a weak VRM (power delivery) can prevent a high-end CPU from sustaining its full boost clocks under load.",
    interactsWith: [
      { categoryId: "cpu", note: "Socket must match exactly." },
      { categoryId: "ram", note: "Memory type and maximum supported speed are set by the board." },
      { categoryId: "storage", note: "M.2/SATA slot count and generation limit installable drives." },
      { categoryId: "case", note: "Form factor must be supported by the case." },
    ],
    commonMistakes: [
      "Buying a CPU and motherboard with mismatched sockets.",
      "Choosing a board with too few M.2 slots for planned storage.",
      "Overlooking VRM quality when pairing with a high-core, high-TDP CPU.",
    ],
    howToChoose: [
      "Start from your CPU's socket — it eliminates most of the decision immediately.",
      "Confirm the form factor fits your chosen case.",
      "Count the M.2 slots and PCIe lanes against your actual storage and expansion plans.",
    ],
  },
  {
    categoryId: "psu",
    title: "Power Supply",
    hook: "Converts wall power into the clean, stable power every other component depends on.",
    whatIsIt:
      "The power supply unit (PSU) converts AC power from the wall into the various DC voltages components need, and delivers it cleanly and reliably.",
    whatItDoes:
      "It powers every component in the system simultaneously, with enough headroom to handle momentary power spikes from the CPU and GPU under load.",
    howItWorks: [
      {
        heading: "Wattage",
        body: "The maximum continuous power the unit can safely deliver. Real-world draw should sit comfortably below this, leaving headroom for transient spikes.",
      },
      {
        heading: "Efficiency rating",
        body: "80+ Bronze/Gold/Platinum ratings indicate how much input power is wasted as heat rather than delivered as usable output — higher ratings mean less waste and often better build quality.",
      },
      {
        heading: "Modularity",
        body: "Modular PSUs let you attach only the cables you need, improving airflow and cable management versus fixed-cable units.",
      },
    ],
    specsThatMatter: [
      { name: "Wattage", matters: "Must comfortably exceed your system's combined power draw, with headroom for spikes." },
      { name: "Efficiency", matters: "Higher ratings reduce wasted heat and often indicate better internal components." },
      { name: "Modularity", matters: "Affects cable clutter and airflow, especially in smaller cases." },
    ],
    whyItMatters:
      "An undersized or low-quality power supply is one of the few components that can cause instability, random shutdowns, or in rare cases damage other hardware.",
    performanceImpact:
      "A properly sized PSU doesn't add performance, but an undersized one can cause a system to throttle or crash under peak load — especially with modern GPUs' power spikes.",
    interactsWith: [
      { categoryId: "gpu", note: "Must comfortably exceed the GPU's rated and peak power draw." },
      { categoryId: "case", note: "Form factor (ATX vs SFX) must be supported by the case." },
    ],
    commonMistakes: [
      "Sizing the PSU to the average draw instead of the peak/transient draw.",
      "Buying the cheapest available unit for a high-end GPU build.",
      "Ignoring form factor requirements in small-form-factor cases.",
    ],
    howToChoose: [
      "Add up your components' rated power draw and leave meaningful headroom — don't cut it close.",
      "Prioritize a reputable efficiency rating over raw wattage alone.",
      "Choose modular cabling for easier builds and better airflow in compact cases.",
    ],
  },
  {
    categoryId: "cooler",
    title: "CPU Cooler",
    hook: "Keeps the CPU inside safe thermal limits so it can sustain its rated performance.",
    whatIsIt:
      "A CPU cooler removes heat generated by the processor and dissipates it into the surrounding air, either through a metal heatsink and fan (air cooling) or a closed liquid loop (AIO liquid cooling).",
    whatItDoes:
      "It keeps the CPU below its thermal throttling point, allowing it to sustain higher clock speeds for longer under load instead of slowing itself down to avoid overheating.",
    howItWorks: [
      {
        heading: "Air cooling",
        body: "A metal heatsink (often with heat pipes) draws heat away from the CPU, and one or more fans push air through it to carry heat away.",
      },
      {
        heading: "Liquid cooling (AIO)",
        body: "A pump circulates liquid through a block on the CPU and a radiator, where fans dissipate the heat. Larger radiators (240mm, 280mm, 360mm) can dissipate more heat.",
      },
    ],
    specsThatMatter: [
      { name: "TDP Rating", matters: "Should meet or exceed your CPU's thermal design power for sustained performance." },
      { name: "Height / Radiator Size", matters: "Must physically fit within your case's clearance." },
      { name: "Noise", matters: "Larger, slower-spinning fans and radiators are typically quieter for the same cooling capacity." },
    ],
    whyItMatters:
      "An undersized cooler forces the CPU to throttle — reducing clock speed to stay within safe temperatures — which directly reduces real-world performance regardless of how capable the CPU itself is.",
    performanceImpact:
      "Better cooling lets a CPU sustain higher boost clocks for longer under continuous load (renders, exports, long gaming sessions), even if it doesn't change the CPU's rated maximum speed.",
    interactsWith: [
      { categoryId: "cpu", note: "Must be rated for the CPU's socket and TDP." },
      { categoryId: "case", note: "Height (air) or radiator size (liquid) must fit within case clearance." },
    ],
    commonMistakes: [
      "Pairing a performance-tier, high-TDP CPU with a budget air cooler.",
      "Not checking radiator clearance before buying a liquid cooler.",
      "Assuming liquid cooling is always quieter or better — a good large air cooler often matches a 240mm AIO.",
    ],
    howToChoose: [
      "Match the cooler's TDP rating to your CPU, with some headroom.",
      "Measure case clearance for air tower height or radiator size before buying.",
      "For essential/balanced builds, a quality air cooler is often the better value than an entry AIO.",
    ],
  },
  {
    categoryId: "case",
    title: "Case",
    hook: "Physically houses every component and constrains what fits together.",
    whatIsIt:
      "The case is the enclosure that holds the motherboard, PSU, storage, cooling, and GPU, while managing airflow and protecting components.",
    whatItDoes:
      "Beyond housing components, its internal layout and included fans directly influence how well heat is removed from the system.",
    howItWorks: [
      {
        heading: "Airflow",
        body: "Cases are designed around intake and exhaust fan positions to create consistent airflow across hot components — good airflow can meaningfully lower temperatures versus a restrictive design.",
      },
      {
        heading: "Clearance",
        body: "Maximum GPU length, cooler height, and radiator size are all set by the case's internal dimensions.",
      },
    ],
    specsThatMatter: [
      { name: "Form Factor Support", matters: "Determines which motherboard sizes physically fit." },
      { name: "Max GPU Length", matters: "Must exceed your GPU's physical length." },
      { name: "Max Cooler Height / Radiator Support", matters: "Must accommodate your chosen cooling solution." },
    ],
    whyItMatters:
      "The case is the final compatibility check in a build — even perfectly compatible components can fail to physically fit together in the wrong case.",
    performanceImpact:
      "A well-ventilated case can lower CPU and GPU temperatures by several degrees compared to a restrictive one, indirectly helping sustained performance.",
    interactsWith: [
      { categoryId: "motherboard", note: "Must support the board's form factor." },
      { categoryId: "gpu", note: "Must have enough length clearance." },
      { categoryId: "cooler", note: "Must accommodate cooler height or radiator size." },
      { categoryId: "case-fans", note: "Fan mount count and size determine airflow potential." },
    ],
    commonMistakes: [
      "Buying a compact case before confirming GPU and cooler clearance.",
      "Prioritizing looks over airflow, resulting in higher sustained temperatures.",
      "Forgetting to check motherboard form factor support.",
    ],
    howToChoose: [
      "Check GPU length and cooler/radiator clearance against your specific components first.",
      "Prioritize mesh front panels and clear airflow paths for sustained performance builds.",
      "Confirm motherboard form factor support.",
    ],
  },
  {
    categoryId: "monitor",
    title: "Monitor",
    hook: "Where the output of every other component is actually seen.",
    whatIsIt:
      "The monitor displays everything the GPU renders. Its resolution, refresh rate, and panel type determine how sharp, smooth, and accurate that image looks.",
    whatItDoes:
      "It converts the GPU's video output into a visible image, at a resolution and refresh rate the panel supports.",
    howItWorks: [
      {
        heading: "Resolution",
        body: "The number of pixels displayed (e.g. 2560x1440). Higher resolution means sharper detail, but requires significantly more GPU power to render at high frame rates.",
      },
      {
        heading: "Refresh rate",
        body: "How many times per second the display updates its image, in Hz. Higher refresh rates show motion more smoothly, but only if the GPU can produce enough frames per second to match.",
      },
      {
        heading: "Panel type",
        body: "IPS panels generally offer the best color accuracy and viewing angles; VA panels offer stronger contrast; TN panels are the fastest but weakest on color and viewing angle.",
      },
    ],
    specsThatMatter: [
      { name: "Resolution", matters: "Determines image sharpness and how much GPU power is required to drive it well." },
      { name: "Refresh Rate", matters: "Determines how smooth motion appears — most valuable for fast-paced games." },
      { name: "Panel Type", matters: "Affects color accuracy, contrast, and response time trade-offs." },
      { name: "Response Time", matters: "Lower values reduce motion blur in fast-moving scenes." },
    ],
    whyItMatters:
      "A monitor that outpaces your GPU wastes its own capability; a GPU that outpaces your monitor wastes its own performance. The two should be matched.",
    performanceImpact:
      "Higher resolution and refresh rate both increase GPU rendering demand substantially — a monitor upgrade often means a GPU upgrade is needed to actually benefit from it.",
    interactsWith: [
      { categoryId: "gpu", note: "Resolution and refresh rate should be matched to what the GPU can drive in your target games/software." },
    ],
    commonMistakes: [
      "Buying a high-refresh monitor without a GPU capable of reaching those frame rates.",
      "Buying a 4K monitor for competitive gaming where high frame rates at lower resolution matter more.",
      "Overlooking panel type when color accuracy matters for creative work.",
    ],
    howToChoose: [
      "Match resolution and refresh rate to what your GPU tier can realistically drive.",
      "Prioritize panel type (IPS) for color-critical creative work.",
      "For competitive gaming, prioritize refresh rate and response time over resolution.",
    ],
  },
  {
    categoryId: "router",
    title: "Router",
    hook: "Directs traffic between every device on your network and the internet.",
    whatIsIt:
      "A router connects your local devices to each other and to your internet service provider, directing traffic to the right destination.",
    whatItDoes:
      "It manages Wi-Fi and wired connections, assigns local addresses to devices, and routes internet traffic in and out of your network.",
    howItWorks: [
      {
        heading: "Wi-Fi standards",
        body: "Newer standards (Wi-Fi 6, 6E, 7) improve speed, latency, and how well the network handles many connected devices at once.",
      },
      {
        heading: "Bands",
        body: "2.4GHz travels further but is slower and more congested; 5GHz and 6GHz are faster with shorter range and less interference.",
      },
      {
        heading: "Coverage",
        body: "A single router's range is limited by walls, floors, and distance — larger or multi-floor homes often need a mesh system instead.",
      },
    ],
    specsThatMatter: [
      { name: "Standard", matters: "Newer Wi-Fi standards handle more devices and offer lower latency, not just higher top speed." },
      { name: "Coverage", matters: "Should match your home's actual size and layout, not just a marketing number." },
      { name: "Ethernet Ports", matters: "Determines how many devices can connect with a wired connection for maximum reliability." },
    ],
    whyItMatters:
      "A router mismatched to your home's size or device count is one of the most common causes of dead zones and inconsistent speeds.",
    performanceImpact:
      "Internet speed is capped by your ISP plan, but a weak router can prevent you from reaching that speed on Wi-Fi, or create dead zones that make the connection unusable in parts of your home.",
    interactsWith: [
      { categoryId: "access-point", note: "Access points extend a router's coverage but need it as the upstream connection." },
      { categoryId: "network-switch", note: "Switches expand wired ports beyond what the router provides directly." },
    ],
    commonMistakes: [
      "Buying based on top theoretical speed rather than actual coverage needs.",
      "Using a single router to cover a large or multi-floor home instead of a mesh system.",
      "Ignoring wired backhaul options for mesh systems, which can meaningfully improve reliability.",
    ],
    howToChoose: [
      "Match coverage rating to your home's actual square footage and layout, with margin.",
      "For multi-floor or larger homes, consider a mesh system over a single router.",
      "Prioritize the number of wired Ethernet ports if you have several wired devices.",
    ],
  },
];

export function getLearnTopic(categoryId: string) {
  return learnTopics.find((t) => t.categoryId === categoryId);
}
