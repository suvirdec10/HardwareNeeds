import type { HardwareProduct } from "./types";

/**
 * Sample catalog. Prices and specs are realistic approximations for
 * demonstration only — not live inventory or pricing. Every entry carries
 * `isSampleData: true` so the UI can surface that honestly.
 */

let uid = 0;
function p(entry: Omit<HardwareProduct, "id" | "isSampleData">): HardwareProduct {
  uid += 1;
  return { ...entry, id: `${entry.categoryId}-${uid}`, isSampleData: true };
}

export const products: HardwareProduct[] = [
  // ---------------------------------------------------------------- CPU
  p({
    categoryId: "cpu",
    slug: "core-arc-5-6c",
    brand: "Arcadian",
    name: "Core Arc 5 6-Core",
    tier: "essential",
    priceUSD: 149,
    summary: "A balanced 6-core chip for everyday use, schoolwork, and light gaming.",
    specs: [
      { label: "Cores / Threads", value: "6 / 12" },
      { label: "Boost Clock", value: "4.4 GHz" },
      { label: "Cache", value: "24 MB" },
      { label: "TDP", value: "65 W" },
      { label: "Socket", value: "AM5" },
      { label: "Integrated Graphics", value: "Yes" },
    ],
    strengths: ["Efficient at stock power limits", "Includes usable integrated graphics", "Low cooling requirements"],
    considerations: ["Limits high-refresh gaming with a fast GPU", "Not ideal for heavy multitasking or rendering"],
  }),
  p({
    categoryId: "cpu",
    slug: "core-arc-7-8c",
    brand: "Arcadian",
    name: "Core Arc 7 8-Core",
    tier: "balanced",
    priceUSD: 329,
    summary: "The sweet spot for gaming and content creation without overspending.",
    specs: [
      { label: "Cores / Threads", value: "8 / 16" },
      { label: "Boost Clock", value: "5.2 GHz" },
      { label: "Cache", value: "40 MB" },
      { label: "TDP", value: "105 W" },
      { label: "Socket", value: "AM5" },
      { label: "Integrated Graphics", value: "No" },
    ],
    strengths: ["Excellent gaming performance paired with a mid-high GPU", "Handles multitasking and light rendering well", "Strong single-core performance"],
    considerations: ["Needs a dedicated GPU", "Benefits from a mid-tier cooler under sustained load"],
  }),
  p({
    categoryId: "cpu",
    slug: "core-arc-9-16c",
    brand: "Arcadian",
    name: "Core Arc 9 16-Core",
    tier: "performance",
    priceUSD: 599,
    summary: "High core count for rendering, compiling, and heavy parallel workloads.",
    specs: [
      { label: "Cores / Threads", value: "16 / 32" },
      { label: "Boost Clock", value: "5.7 GHz" },
      { label: "Cache", value: "80 MB" },
      { label: "TDP", value: "170 W" },
      { label: "Socket", value: "AM5" },
      { label: "Integrated Graphics", value: "No" },
    ],
    strengths: ["Excels at multi-threaded workloads (rendering, compiling, encoding)", "Headroom for years of demanding use", "Strong gaming performance too"],
    considerations: ["Requires a robust cooler (240mm+ AIO or high-end air)", "Overkill for gaming-only builds"],
  }),

  // ---------------------------------------------------------------- GPU
  p({
    categoryId: "gpu",
    slug: "raster-x4-8g",
    brand: "Prisma",
    name: "Raster X4 8GB",
    tier: "essential",
    priceUSD: 249,
    summary: "Comfortable 1080p gaming and light creative work.",
    specs: [
      { label: "VRAM", value: "8 GB GDDR6" },
      { label: "Memory Bus", value: "128-bit" },
      { label: "Boost Clock", value: "2.5 GHz" },
      { label: "TDP", value: "140 W" },
      { label: "Outputs", value: "3x DP, 1x HDMI" },
      { label: "Recommended PSU", value: "550 W" },
    ],
    strengths: ["Strong 1080p performance per dollar", "Low power draw", "Compact — fits most cases"],
    considerations: ["Not built for 1440p/4K at high settings", "8 GB VRAM limits some texture-heavy titles"],
  }),
  p({
    categoryId: "gpu",
    slug: "raster-x6-12g",
    brand: "Prisma",
    name: "Raster X6 12GB",
    tier: "balanced",
    priceUSD: 449,
    summary: "Smooth 1440p gaming and capable video editing performance.",
    specs: [
      { label: "VRAM", value: "12 GB GDDR6" },
      { label: "Memory Bus", value: "192-bit" },
      { label: "Boost Clock", value: "2.6 GHz" },
      { label: "TDP", value: "220 W" },
      { label: "Outputs", value: "3x DP, 1x HDMI" },
      { label: "Recommended PSU", value: "650 W" },
    ],
    strengths: ["High-refresh 1440p in most titles", "Enough VRAM for demanding textures and light 3D work", "Good encode engine for streaming"],
    considerations: ["4K needs upscaling in the heaviest titles", "Draws noticeably more power than the X4"],
  }),
  p({
    categoryId: "gpu",
    slug: "raster-x9-24g",
    brand: "Prisma",
    name: "Raster X9 24GB",
    tier: "performance",
    priceUSD: 1099,
    summary: "4K gaming, 3D rendering, and large creative or ML workloads.",
    specs: [
      { label: "VRAM", value: "24 GB GDDR6X" },
      { label: "Memory Bus", value: "384-bit" },
      { label: "Boost Clock", value: "2.7 GHz" },
      { label: "TDP", value: "350 W" },
      { label: "Outputs", value: "3x DP, 1x HDMI" },
      { label: "Recommended PSU", value: "850 W" },
    ],
    strengths: ["4K/high-refresh gaming headroom", "Large VRAM pool for rendering and AI workloads", "Strong ray tracing performance"],
    considerations: ["High power draw and heat output", "Physically large — verify case clearance"],
  }),

  // ---------------------------------------------------------------- RAM
  p({
    categoryId: "ram",
    slug: "linebuf-16-ddr5",
    brand: "Linebuf",
    name: "Linebuf 16GB DDR5",
    tier: "essential",
    priceUSD: 49,
    summary: "Enough headroom for browsing, office work, and light gaming.",
    specs: [
      { label: "Capacity", value: "16 GB (2x8GB)" },
      { label: "Speed", value: "DDR5-5200" },
      { label: "Latency", value: "CL40" },
      { label: "Voltage", value: "1.1 V" },
    ],
    strengths: ["Dual-channel out of the box", "Low cost of entry"],
    considerations: ["Tight for heavy multitasking or large creative projects"],
  }),
  p({
    categoryId: "ram",
    slug: "linebuf-32-ddr5",
    brand: "Linebuf",
    name: "Linebuf 32GB DDR5",
    tier: "balanced",
    priceUSD: 99,
    summary: "Comfortable headroom for gaming, editing, and multitasking.",
    specs: [
      { label: "Capacity", value: "32 GB (2x16GB)" },
      { label: "Speed", value: "DDR5-6000" },
      { label: "Latency", value: "CL36" },
      { label: "Voltage", value: "1.35 V" },
    ],
    strengths: ["Sweet spot for gaming + creative work", "Fast enough to matter for AMD platforms' Infinity Fabric"],
    considerations: ["Large video/3D projects may still want more"],
  }),
  p({
    categoryId: "ram",
    slug: "linebuf-64-ddr5",
    brand: "Linebuf",
    name: "Linebuf 64GB DDR5",
    tier: "performance",
    priceUSD: 219,
    summary: "For large timelines, big datasets, and heavy multitasking.",
    specs: [
      { label: "Capacity", value: "64 GB (2x32GB)" },
      { label: "Speed", value: "DDR5-6000" },
      { label: "Latency", value: "CL30" },
      { label: "Voltage", value: "1.35 V" },
    ],
    strengths: ["Comfortable for 4K/8K editing and 3D scenes", "Room for many concurrent applications and VMs"],
    considerations: ["Diminishing returns for gaming-only use"],
  }),

  // ---------------------------------------------------------------- Storage
  p({
    categoryId: "storage",
    slug: "swiftbyte-1tb-nvme",
    brand: "SwiftByte",
    name: "SwiftByte 1TB NVMe",
    tier: "essential",
    priceUSD: 69,
    summary: "Fast, affordable primary drive for OS and everyday applications.",
    specs: [
      { label: "Capacity", value: "1 TB" },
      { label: "Interface", value: "PCIe 4.0 x4 NVMe" },
      { label: "Sequential Read", value: "5,000 MB/s" },
      { label: "Sequential Write", value: "4,000 MB/s" },
    ],
    strengths: ["Fast boot and load times", "Good value per gigabyte"],
    considerations: ["May fill up quickly with large game libraries or media"],
  }),
  p({
    categoryId: "storage",
    slug: "swiftbyte-2tb-nvme",
    brand: "SwiftByte",
    name: "SwiftByte 2TB NVMe",
    tier: "balanced",
    priceUSD: 129,
    summary: "Room for a large game library or an active project folder.",
    specs: [
      { label: "Capacity", value: "2 TB" },
      { label: "Interface", value: "PCIe 4.0 x4 NVMe" },
      { label: "Sequential Read", value: "7,000 MB/s" },
      { label: "Sequential Write", value: "6,500 MB/s" },
    ],
    strengths: ["Comfortable capacity for most users", "High sustained throughput"],
    considerations: ["Video editors with large raw footage may still want more"],
  }),
  p({
    categoryId: "storage",
    slug: "swiftbyte-4tb-nvme",
    brand: "SwiftByte",
    name: "SwiftByte 4TB NVMe Pro",
    tier: "performance",
    priceUSD: 279,
    summary: "High-capacity, high-speed storage for demanding creative work.",
    specs: [
      { label: "Capacity", value: "4 TB" },
      { label: "Interface", value: "PCIe 4.0 x4 NVMe" },
      { label: "Sequential Read", value: "7,300 MB/s" },
      { label: "Sequential Write", value: "6,900 MB/s" },
      { label: "Endurance", value: "2,800 TBW" },
    ],
    strengths: ["Handles large raw video/RAW photo libraries", "High write endurance for sustained workloads"],
    considerations: ["Runs warm under sustained writes — check drive cooling"],
  }),

  // ---------------------------------------------------------------- Motherboard
  p({
    categoryId: "motherboard",
    slug: "corepath-b650",
    brand: "CorePath",
    name: "CorePath B650 Micro-ATX",
    tier: "essential",
    priceUSD: 129,
    summary: "A compact, reliable board covering the essentials.",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Form Factor", value: "Micro-ATX" },
      { label: "RAM Support", value: "DDR5, up to 96GB" },
      { label: "M.2 Slots", value: "2" },
      { label: "PCIe", value: "PCIe 4.0 x16" },
    ],
    strengths: ["Solid VRM for mid-range CPUs", "Good port selection for the price"],
    considerations: ["Fewer M.2 slots than ATX boards", "Limited PCIe expansion"],
  }),
  p({
    categoryId: "motherboard",
    slug: "corepath-x670-atx",
    brand: "CorePath",
    name: "CorePath X670 ATX",
    tier: "balanced",
    priceUSD: 229,
    summary: "Full-featured ATX board for gaming and creative builds.",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Form Factor", value: "ATX" },
      { label: "RAM Support", value: "DDR5, up to 128GB" },
      { label: "M.2 Slots", value: "4" },
      { label: "PCIe", value: "PCIe 5.0 x16" },
    ],
    strengths: ["Strong VRM handles high-core CPUs", "Ample M.2 and USB connectivity"],
    considerations: ["Larger footprint — needs a mid-tower or bigger case"],
  }),
  p({
    categoryId: "motherboard",
    slug: "corepath-x670e-extreme",
    brand: "CorePath",
    name: "CorePath X670E Extreme",
    tier: "performance",
    priceUSD: 449,
    summary: "Flagship connectivity and power delivery for enthusiast builds.",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Form Factor", value: "ATX" },
      { label: "RAM Support", value: "DDR5, up to 192GB" },
      { label: "M.2 Slots", value: "5" },
      { label: "PCIe", value: "PCIe 5.0 x16 + x8" },
      { label: "Networking", value: "10GbE + Wi-Fi 7" },
    ],
    strengths: ["Handles top-tier CPUs at full power", "Extensive expansion and connectivity"],
    considerations: ["Premium price for features many builds won't fully use"],
  }),

  // ---------------------------------------------------------------- PSU
  p({
    categoryId: "psu",
    slug: "voltframe-550-bronze",
    brand: "VoltFrame",
    name: "VoltFrame 550W Bronze",
    tier: "essential",
    priceUSD: 59,
    summary: "Reliable power for entry and mid-range single-GPU builds.",
    specs: [
      { label: "Wattage", value: "550 W" },
      { label: "Efficiency", value: "80+ Bronze" },
      { label: "Modularity", value: "Semi-modular" },
      { label: "Warranty", value: "5 years" },
    ],
    strengths: ["Covers most single-GPU essential/balanced builds", "Good value"],
    considerations: ["Not enough headroom for high-end GPUs"],
  }),
  p({
    categoryId: "psu",
    slug: "voltframe-750-gold",
    brand: "VoltFrame",
    name: "VoltFrame 750W Gold",
    tier: "balanced",
    priceUSD: 109,
    summary: "Headroom for mid-to-high-end GPUs with efficient operation.",
    specs: [
      { label: "Wattage", value: "750 W" },
      { label: "Efficiency", value: "80+ Gold" },
      { label: "Modularity", value: "Fully modular" },
      { label: "Warranty", value: "7 years" },
    ],
    strengths: ["Comfortable headroom for balanced-tier GPUs", "Fully modular cabling for cleaner builds"],
    considerations: [],
  }),
  p({
    categoryId: "psu",
    slug: "voltframe-1000-platinum",
    brand: "VoltFrame",
    name: "VoltFrame 1000W Platinum",
    tier: "performance",
    priceUSD: 209,
    summary: "High headroom for power-hungry GPUs and high-core CPUs.",
    specs: [
      { label: "Wattage", value: "1000 W" },
      { label: "Efficiency", value: "80+ Platinum" },
      { label: "Modularity", value: "Fully modular" },
      { label: "Warranty", value: "10 years" },
    ],
    strengths: ["Covers flagship GPU + high-core CPU combinations", "Very high efficiency reduces heat and noise"],
    considerations: ["More wattage than most single-GPU builds need"],
  }),

  // ---------------------------------------------------------------- Cooler
  p({
    categoryId: "cooler",
    slug: "thermatek-air-120",
    brand: "Thermatek",
    name: "Thermatek Air 120",
    tier: "essential",
    priceUSD: 35,
    summary: "Quiet, compact air cooler for essential and balanced CPUs.",
    specs: [
      { label: "Type", value: "Single-tower air" },
      { label: "Height", value: "155 mm" },
      { label: "Noise", value: "24 dBA" },
      { label: "TDP Rating", value: "up to 125 W" },
    ],
    strengths: ["Fits nearly every case", "Very quiet at idle and light load"],
    considerations: ["Not rated for high-TDP performance-tier CPUs"],
  }),
  p({
    categoryId: "cooler",
    slug: "thermatek-aio-240",
    brand: "Thermatek",
    name: "Thermatek Liquid 240",
    tier: "balanced",
    priceUSD: 89,
    summary: "240mm liquid cooling for sustained multi-core workloads.",
    specs: [
      { label: "Type", value: "240mm AIO liquid" },
      { label: "Radiator", value: "240 x 120 x 27mm" },
      { label: "Noise", value: "28 dBA" },
      { label: "TDP Rating", value: "up to 180 W" },
    ],
    strengths: ["Handles sustained boost clocks well", "Frees up case airflow compared to large air towers"],
    considerations: ["Requires case radiator mount clearance"],
  }),
  p({
    categoryId: "cooler",
    slug: "thermatek-aio-360",
    brand: "Thermatek",
    name: "Thermatek Liquid 360",
    tier: "performance",
    priceUSD: 149,
    summary: "360mm liquid cooling for high-core, high-TDP CPUs.",
    specs: [
      { label: "Type", value: "360mm AIO liquid" },
      { label: "Radiator", value: "360 x 120 x 27mm" },
      { label: "Noise", value: "30 dBA" },
      { label: "TDP Rating", value: "up to 250 W" },
    ],
    strengths: ["Keeps performance-tier CPUs cool under sustained load", "Maintains higher boost clocks longer"],
    considerations: ["Needs a case with 360mm top or front radiator support"],
  }),

  // ---------------------------------------------------------------- Case
  p({
    categoryId: "case",
    slug: "framewerk-compact",
    brand: "Framewerk",
    name: "Framewerk Compact",
    tier: "essential",
    priceUSD: 69,
    summary: "Small-footprint case for essential and balanced builds.",
    specs: [
      { label: "Form Factor Support", value: "Micro-ATX, Mini-ITX" },
      { label: "Max GPU Length", value: "310 mm" },
      { label: "Max Cooler Height", value: "160 mm" },
      { label: "Included Fans", value: "2" },
    ],
    strengths: ["Fits comfortably on or under a desk", "Clean, understated design"],
    considerations: ["Limited clearance for the largest GPUs and coolers"],
  }),
  p({
    categoryId: "case",
    slug: "framewerk-mid-tower",
    brand: "Framewerk",
    name: "Framewerk Mid Tower",
    tier: "balanced",
    priceUSD: 99,
    summary: "Balanced airflow and space for most gaming/creative builds.",
    specs: [
      { label: "Form Factor Support", value: "ATX, Micro-ATX, Mini-ITX" },
      { label: "Max GPU Length", value: "380 mm" },
      { label: "Max Cooler Height", value: "170 mm" },
      { label: "Radiator Support", value: "up to 280mm front" },
      { label: "Included Fans", value: "3" },
    ],
    strengths: ["Room for most GPUs and 240mm/280mm AIOs", "Strong front-to-back airflow"],
    considerations: [],
  }),
  p({
    categoryId: "case",
    slug: "framewerk-full-tower",
    brand: "Framewerk",
    name: "Framewerk Full Tower",
    tier: "performance",
    priceUSD: 179,
    summary: "Maximum airflow and clearance for flagship components.",
    specs: [
      { label: "Form Factor Support", value: "E-ATX, ATX, Micro-ATX, Mini-ITX" },
      { label: "Max GPU Length", value: "450 mm" },
      { label: "Max Cooler Height", value: "185 mm" },
      { label: "Radiator Support", value: "up to 360mm front + top" },
      { label: "Included Fans", value: "4" },
    ],
    strengths: ["Fits the largest GPUs and 360mm radiators", "Excellent sustained airflow for hot components"],
    considerations: ["Large footprint — measure your desk space"],
  }),

  // ---------------------------------------------------------------- Case Fans
  p({
    categoryId: "case-fans",
    slug: "airflow-120-3pack",
    brand: "Framewerk",
    name: "Airflow 120mm (3-Pack)",
    tier: "essential",
    priceUSD: 39,
    summary: "Standard case fans for extra intake or exhaust airflow.",
    specs: [
      { label: "Size", value: "120mm" },
      { label: "Airflow", value: "58 CFM" },
      { label: "Noise", value: "26 dBA" },
    ],
    strengths: ["Improves case airflow cheaply", "PWM speed control"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Monitor
  p({
    categoryId: "monitor",
    slug: "clearview-24-ips",
    brand: "ClearView",
    name: "ClearView 24\" IPS 165Hz",
    tier: "essential",
    priceUSD: 159,
    summary: "Sharp, responsive 1080p monitor for everyday gaming and work.",
    specs: [
      { label: "Size", value: "24\"" },
      { label: "Resolution", value: "1920x1080" },
      { label: "Refresh Rate", value: "165 Hz" },
      { label: "Panel", value: "IPS" },
      { label: "Response Time", value: "1ms (GtG)" },
    ],
    strengths: ["Smooth motion for fast-paced games", "Accurate color for an entry monitor"],
    considerations: ["1080p limits sharpness on larger desks"],
  }),
  p({
    categoryId: "monitor",
    slug: "clearview-27-qhd",
    brand: "ClearView",
    name: "ClearView 27\" QHD 165Hz",
    tier: "balanced",
    priceUSD: 279,
    summary: "The current sweet spot: sharp, fast, and comfortably sized.",
    specs: [
      { label: "Size", value: "27\"" },
      { label: "Resolution", value: "2560x1440" },
      { label: "Refresh Rate", value: "165 Hz" },
      { label: "Panel", value: "IPS" },
      { label: "Response Time", value: "1ms (GtG)" },
    ],
    strengths: ["Matches well with balanced-tier GPUs", "Great detail for both gaming and creative work"],
    considerations: [],
  }),
  p({
    categoryId: "monitor",
    slug: "clearview-32-4k",
    brand: "ClearView",
    name: "ClearView 32\" 4K 144Hz",
    tier: "performance",
    priceUSD: 599,
    summary: "Maximum detail for high-end gaming and professional color work.",
    specs: [
      { label: "Size", value: "32\"" },
      { label: "Resolution", value: "3840x2160" },
      { label: "Refresh Rate", value: "144 Hz" },
      { label: "Panel", value: "IPS" },
      { label: "Color Coverage", value: "98% DCI-P3" },
    ],
    strengths: ["Needs a performance-tier GPU to fully drive", "Excellent for color-critical creative work"],
    considerations: ["Text/UI scaling needed on some older software"],
  }),

  // ---------------------------------------------------------------- Keyboard
  p({
    categoryId: "keyboard",
    slug: "typewell-tkl",
    brand: "Typewell",
    name: "Typewell TKL Mechanical",
    tier: "balanced",
    priceUSD: 79,
    summary: "Tactile mechanical keyboard for gaming and daily typing.",
    specs: [
      { label: "Layout", value: "Tenkeyless" },
      { label: "Switches", value: "Mechanical, tactile" },
      { label: "Connection", value: "Wired / 2.4GHz" },
      { label: "Backlight", value: "Per-key RGB" },
    ],
    strengths: ["Responsive for both typing and gaming", "Compact — more mouse room"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Mouse
  p({
    categoryId: "mouse",
    slug: "pointform-lite",
    brand: "Pointform",
    name: "Pointform Lite",
    tier: "balanced",
    priceUSD: 49,
    summary: "Lightweight wireless mouse tuned for fast, precise movement.",
    specs: [
      { label: "Weight", value: "59 g" },
      { label: "Sensor", value: "26,000 DPI optical" },
      { label: "Connection", value: "2.4GHz wireless" },
      { label: "Battery Life", value: "~70 hours" },
    ],
    strengths: ["Excellent for fast-paced gaming", "Long battery life for the weight class"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Webcam
  p({
    categoryId: "webcam",
    slug: "focalpoint-1080p",
    brand: "FocalPoint",
    name: "FocalPoint 1080p",
    tier: "essential",
    priceUSD: 59,
    summary: "Clean, reliable video for calls and light streaming.",
    specs: [
      { label: "Resolution", value: "1080p @ 30fps" },
      { label: "Field of View", value: "78°" },
      { label: "Focus", value: "Autofocus" },
    ],
    strengths: ["Solid image quality in good lighting", "Plug-and-play on most platforms"],
    considerations: ["Struggles more in low light than higher-tier webcams"],
  }),
  p({
    categoryId: "webcam",
    slug: "focalpoint-4k",
    brand: "FocalPoint",
    name: "FocalPoint 4K Pro",
    tier: "performance",
    priceUSD: 179,
    summary: "High-detail video for professional streaming and recording.",
    specs: [
      { label: "Resolution", value: "4K @ 30fps / 1080p @ 60fps" },
      { label: "Field of View", value: "Adjustable 65°-90°" },
      { label: "Focus", value: "Autofocus with manual override" },
    ],
    strengths: ["Sharp detail even when cropped", "Handles low light noticeably better"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Microphone
  p({
    categoryId: "microphone",
    slug: "clearcast-usb",
    brand: "ClearCast",
    name: "ClearCast USB Condenser",
    tier: "balanced",
    priceUSD: 99,
    summary: "Broadcast-quality voice capture for streaming and recording.",
    specs: [
      { label: "Type", value: "Condenser" },
      { label: "Pattern", value: "Cardioid" },
      { label: "Connection", value: "USB-C" },
      { label: "Sample Rate", value: "48kHz / 24-bit" },
    ],
    strengths: ["Clear, present vocal capture", "Simple USB setup — no interface needed"],
    considerations: ["Sensitive to room echo without treatment"],
  }),

  // ---------------------------------------------------------------- Headset
  p({
    categoryId: "headset",
    slug: "auralite-wireless",
    brand: "Auralite",
    name: "Auralite Wireless",
    tier: "balanced",
    priceUSD: 119,
    summary: "Comfortable wireless headset with a detachable microphone.",
    specs: [
      { label: "Driver Size", value: "50mm" },
      { label: "Connection", value: "2.4GHz wireless + Bluetooth" },
      { label: "Battery Life", value: "~30 hours" },
      { label: "Microphone", value: "Detachable boom" },
    ],
    strengths: ["Balanced sound for games, music, and calls", "Long battery life"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Speakers
  p({
    categoryId: "speakers",
    slug: "roomtone-2-1",
    brand: "RoomTone",
    name: "RoomTone 2.1 Desktop",
    tier: "balanced",
    priceUSD: 89,
    summary: "Desktop speaker set with a dedicated subwoofer for fuller sound.",
    specs: [
      { label: "Configuration", value: "2.1 (stereo + subwoofer)" },
      { label: "Total Power", value: "40 W RMS" },
      { label: "Connection", value: "USB-C / 3.5mm / Bluetooth" },
    ],
    strengths: ["Noticeably fuller sound than laptop or monitor speakers", "Flexible connection options"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Controller
  p({
    categoryId: "controller",
    slug: "gripcore-wireless",
    brand: "GripCore",
    name: "GripCore Wireless",
    tier: "balanced",
    priceUSD: 59,
    summary: "Full-featured wireless controller for PC gaming.",
    specs: [
      { label: "Connection", value: "2.4GHz wireless + Bluetooth" },
      { label: "Battery Life", value: "~20 hours" },
      { label: "Vibration", value: "Dual + trigger feedback" },
    ],
    strengths: ["Wide compatibility with PC games", "Comfortable for extended sessions"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Wi-Fi Adapter
  p({
    categoryId: "wifi-adapter",
    slug: "aircard-wifi6e",
    brand: "AirCard",
    name: "AirCard Wi-Fi 6E PCIe",
    tier: "balanced",
    priceUSD: 49,
    summary: "Internal PCIe card bringing fast, low-latency Wi-Fi to a desktop.",
    specs: [
      { label: "Standard", value: "Wi-Fi 6E" },
      { label: "Max Speed", value: "2.4 Gbps" },
      { label: "Bands", value: "2.4 / 5 / 6 GHz" },
      { label: "Interface", value: "PCIe x1" },
    ],
    strengths: ["Much lower latency than USB adapters", "6GHz band avoids most household interference"],
    considerations: ["Requires an open PCIe slot and motherboard antenna headers"],
  }),

  // ---------------------------------------------------------------- Ethernet Adapter
  p({
    categoryId: "ethernet-adapter",
    slug: "linkbridge-2.5g",
    brand: "LinkBridge",
    name: "LinkBridge 2.5GbE USB",
    tier: "essential",
    priceUSD: 29,
    summary: "Adds fast wired networking to a laptop or a board without it.",
    specs: [
      { label: "Speed", value: "2.5 Gbps" },
      { label: "Connection", value: "USB-A / USB-C" },
    ],
    strengths: ["Plug-and-play on most operating systems", "More stable than Wi-Fi for large transfers"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Router
  p({
    categoryId: "router",
    slug: "meshpoint-ax",
    brand: "MeshPoint",
    name: "MeshPoint AX5400",
    tier: "essential",
    priceUSD: 129,
    summary: "Reliable Wi-Fi 6 router for apartments and small homes.",
    specs: [
      { label: "Standard", value: "Wi-Fi 6" },
      { label: "Max Speed", value: "5.4 Gbps (combined)" },
      { label: "Coverage", value: "~1,800 sq ft" },
      { label: "Ethernet Ports", value: "4x 1GbE" },
    ],
    strengths: ["Good coverage for single-floor homes", "Handles many connected devices well"],
    considerations: ["Larger homes may need a mesh add-on"],
  }),
  p({
    categoryId: "router",
    slug: "meshpoint-mesh-3pack",
    brand: "MeshPoint",
    name: "MeshPoint Mesh AXE (3-Pack)",
    tier: "performance",
    priceUSD: 399,
    summary: "Whole-home Wi-Fi 6E mesh coverage for larger or multi-floor homes.",
    specs: [
      { label: "Standard", value: "Wi-Fi 6E" },
      { label: "Coverage", value: "~6,000 sq ft" },
      { label: "Ethernet Ports", value: "2x 2.5GbE per node" },
      { label: "Nodes Included", value: "3" },
    ],
    strengths: ["Even coverage across large or multi-floor homes", "6GHz band for low-interference backhaul"],
    considerations: ["Higher cost than a single router"],
  }),

  // ---------------------------------------------------------------- Network Switch
  p({
    categoryId: "network-switch",
    slug: "portyard-8",
    brand: "Portyard",
    name: "Portyard 8-Port Gigabit",
    tier: "essential",
    priceUSD: 34,
    summary: "Expands a single wired connection into eight.",
    specs: [
      { label: "Ports", value: "8x 1GbE" },
      { label: "Switching Capacity", value: "16 Gbps" },
      { label: "Managed", value: "No" },
    ],
    strengths: ["Simple plug-and-play expansion", "Silent, fanless operation"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Access Point
  p({
    categoryId: "access-point",
    slug: "signalcast-ap",
    brand: "SignalCast",
    name: "SignalCast Ceiling AP",
    tier: "balanced",
    priceUSD: 149,
    summary: "Dedicated access point for extending coverage into a specific area.",
    specs: [
      { label: "Standard", value: "Wi-Fi 6" },
      { label: "Coverage", value: "~2,500 sq ft" },
      { label: "Power", value: "PoE (injector included)" },
    ],
    strengths: ["Purpose-built for coverage, not routing", "Clean ceiling/wall mount"],
    considerations: ["Needs a router or switch upstream to function"],
  }),

  // ---------------------------------------------------------------- Capture Card
  p({
    categoryId: "capture-card",
    slug: "framegrab-4k60",
    brand: "FrameGrab",
    name: "FrameGrab 4K60 Pro",
    tier: "balanced",
    priceUSD: 189,
    summary: "Captures external 4K video sources for streaming or recording.",
    specs: [
      { label: "Max Capture", value: "4K @ 60fps" },
      { label: "Passthrough", value: "4K @ 144fps" },
      { label: "Connection", value: "USB-C" },
      { label: "Latency", value: "<1 frame" },
    ],
    strengths: ["Near-zero passthrough latency for console/PC capture", "Wide software compatibility"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- External Storage
  p({
    categoryId: "external-storage",
    slug: "portadrive-2tb",
    brand: "PortaDrive",
    name: "PortaDrive 2TB SSD",
    tier: "balanced",
    priceUSD: 149,
    summary: "Fast, rugged portable storage for backups and project files.",
    specs: [
      { label: "Capacity", value: "2 TB" },
      { label: "Interface", value: "USB 3.2 Gen 2" },
      { label: "Speed", value: "1,050 MB/s" },
      { label: "Durability", value: "IP65, drop-resistant" },
    ],
    strengths: ["Fast enough to edit video directly from", "Durable for field/travel use"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Docking Station
  p({
    categoryId: "docking-station",
    slug: "hubframe-14in1",
    brand: "HubFrame",
    name: "HubFrame 14-in-1",
    tier: "balanced",
    priceUSD: 179,
    summary: "Turns a single USB-C cable into a full desktop setup.",
    specs: [
      { label: "Ports", value: "2x DP, HDMI, 3x USB-A, 2x USB-C, 2.5GbE, SD" },
      { label: "Power Delivery", value: "100 W" },
      { label: "Display Support", value: "Dual 4K@60Hz" },
    ],
    strengths: ["One-cable laptop docking", "Powers most laptops while docked"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- UPS
  p({
    categoryId: "ups",
    slug: "steadypower-850",
    brand: "SteadyPower",
    name: "SteadyPower 850VA",
    tier: "essential",
    priceUSD: 99,
    summary: "Battery backup that protects a desktop and monitor from outages.",
    specs: [
      { label: "Capacity", value: "850VA / 480W" },
      { label: "Runtime (typical desktop)", value: "~8-12 min" },
      { label: "Outlets", value: "6 (4 battery-backed)" },
    ],
    strengths: ["Protects against sudden power loss and surges", "Enough runtime for a safe shutdown"],
    considerations: ["Not sized for extended outages"],
  }),

  // ---------------------------------------------------------------- Expansion Cards
  p({
    categoryId: "expansion-cards",
    slug: "portplus-usbc-pcie",
    brand: "PortPlus",
    name: "PortPlus USB-C PCIe Card",
    tier: "essential",
    priceUSD: 39,
    summary: "Adds modern USB-C front/rear ports to an older motherboard.",
    specs: [
      { label: "Interface", value: "PCIe x4" },
      { label: "Ports Added", value: "2x USB-C 3.2 Gen 2" },
    ],
    strengths: ["Cheaper than replacing the whole motherboard for connectivity", "Simple installation"],
    considerations: [],
  }),

  // ---------------------------------------------------------------- Adapters
  p({
    categoryId: "adapters",
    slug: "bridgekit-dp-hdmi",
    brand: "BridgeKit",
    name: "BridgeKit DisplayPort → HDMI",
    tier: "essential",
    priceUSD: 15,
    summary: "Connects a DisplayPort output to an HDMI-only display.",
    specs: [
      { label: "Max Resolution", value: "4K @ 60Hz" },
      { label: "Direction", value: "DP (source) → HDMI (display)" },
    ],
    strengths: ["Inexpensive fix for a port mismatch", "No external power required"],
    considerations: ["Direction matters — won't work the other way around"],
  }),
];

export function getProduct(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function productsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}

const tierRank: Record<HardwareProduct["tier"], number> = {
  essential: 0,
  balanced: 1,
  performance: 2,
};

export function pickByTier(categoryId: string, tier: HardwareProduct["tier"]) {
  const inCategory = productsByCategory(categoryId);
  if (inCategory.length === 0) return undefined;
  const exact = inCategory.find((p) => p.tier === tier);
  if (exact) return exact;
  // Fall back to the closest available tier.
  return [...inCategory].sort(
    (a, b) => Math.abs(tierRank[a.tier] - tierRank[tier]) - Math.abs(tierRank[b.tier] - tierRank[tier]),
  )[0];
}
