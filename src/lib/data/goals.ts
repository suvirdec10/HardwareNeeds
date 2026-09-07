import type { Goal } from "./types";

const budgetQuestion = {
  id: "budget",
  prompt: "What's your budget?",
  helper: "Approximate is fine — this shapes which tier of hardware we recommend.",
  type: "slider" as const,
  min: 500,
  max: 5000,
  step: 100,
  unit: "$",
  defaultValue: 1500,
};

const existingHardwareQuestion = {
  id: "existingHardware",
  prompt: "Are you starting from scratch, or working with existing hardware?",
  type: "single" as const,
  options: [
    { value: "scratch", label: "Starting from scratch", description: "New build, no reusable parts." },
    { value: "some", label: "I have some parts already", description: "e.g. a case, monitor, or peripherals." },
    { value: "upgrade", label: "I want to upgrade what I have", description: "Use Upgrade Mode instead for a tailored flow." },
  ],
};

export const goals: Goal[] = [
  {
    id: "gaming",
    label: "Gaming",
    icon: "Gamepad2",
    description: "Play modern games at the resolution and smoothness you care about.",
    focusCategories: ["gpu", "cpu", "ram", "storage", "monitor", "psu", "case", "cooler"],
    questions: [
      {
        id: "games",
        prompt: "What kind of games do you mostly play?",
        type: "multi",
        options: [
          { value: "competitive", label: "Competitive / esports", description: "Valorant, CS2, Overwatch — high frame rates matter most." },
          { value: "aaa", label: "Story-driven / AAA", description: "Visually demanding single-player titles." },
          { value: "open-world", label: "Open-world / simulation", description: "Large, detailed worlds — CPU and GPU both matter." },
          { value: "indie", label: "Indie / mixed library", description: "Less demanding — most hardware handles these well." },
        ],
      },
      {
        id: "resolution",
        prompt: "What resolution do you want to play at?",
        type: "single",
        options: [
          { value: "1080p", label: "1080p", description: "Most affordable, easiest to drive at high frame rates." },
          { value: "1440p", label: "1440p", description: "The current sweet spot for detail and performance." },
          { value: "4k", label: "4K", description: "Maximum detail — needs a performance-tier GPU." },
        ],
      },
      {
        id: "refreshRate",
        prompt: "How important is high refresh rate / smoothness?",
        type: "single",
        options: [
          { value: "standard", label: "60Hz is fine", description: "Prioritize resolution and visual detail instead." },
          { value: "high", label: "High refresh matters (144Hz+)", description: "Smoothness and responsiveness are a priority." },
          { value: "max", label: "As high as possible", description: "Competitive-focused, frame rate is the priority." },
        ],
      },
      {
        id: "performancePreference",
        prompt: "Would you rather prioritize raw performance or value?",
        type: "single",
        options: [
          { value: "value", label: "Best value", description: "Great performance without paying for the last few percent." },
          { value: "balanced", label: "Balanced", description: "A mix of performance and price." },
          { value: "performance", label: "Maximum performance", description: "Willing to spend more for the best experience." },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "school",
    label: "School",
    icon: "GraduationCap",
    description: "Reliable, affordable hardware for classes, research, and everyday schoolwork.",
    focusCategories: ["cpu", "ram", "storage", "monitor"],
    questions: [
      {
        id: "workload",
        prompt: "What will you mostly be doing?",
        type: "multi",
        options: [
          { value: "docs", label: "Documents, browsing, video calls" },
          { value: "coding", label: "Programming assignments" },
          { value: "design", label: "Design or media coursework" },
          { value: "heavy", label: "Data-heavy coursework (stats, engineering, CAD)" },
        ],
      },
      {
        id: "portability",
        prompt: "Do you need this to be portable?",
        type: "single",
        options: [
          { value: "desktop", label: "Desktop is fine", description: "Stays at a desk." },
          { value: "portable", label: "Needs to move between locations", description: "Consider a laptop-first plan instead." },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "programming",
    label: "Programming",
    icon: "Code2",
    description: "Fast builds, smooth multitasking, and headroom for local dev environments.",
    focusCategories: ["cpu", "ram", "storage", "monitor"],
    questions: [
      {
        id: "domain",
        prompt: "What do you primarily build?",
        type: "multi",
        options: [
          { value: "web", label: "Web / app development" },
          { value: "data", label: "Data science / ML" },
          { value: "systems", label: "Systems / compiled languages" },
          { value: "mobile", label: "Mobile development" },
        ],
      },
      {
        id: "environments",
        prompt: "How many dev environments/VMs/containers run at once, typically?",
        type: "single",
        options: [
          { value: "light", label: "One project at a time" },
          { value: "moderate", label: "A few services or containers" },
          { value: "heavy", label: "Many — full local stacks, multiple VMs" },
        ],
      },
      {
        id: "displays",
        prompt: "How many monitors do you want to work across?",
        type: "single",
        options: [
          { value: "one", label: "One" },
          { value: "two", label: "Two" },
          { value: "three", label: "Three or more" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "video-editing",
    label: "Video Editing",
    icon: "Clapperboard",
    description: "Smooth timeline scrubbing, fast exports, and enough storage for footage.",
    focusCategories: ["cpu", "gpu", "ram", "storage", "monitor", "psu", "cooler"],
    questions: [
      {
        id: "software",
        prompt: "What editing software do you use most?",
        type: "single",
        options: [
          { value: "premiere", label: "Premiere Pro / Resolve" },
          { value: "final-cut", label: "Final Cut Pro" },
          { value: "other", label: "Other / multiple tools" },
        ],
      },
      {
        id: "resolution",
        prompt: "What resolution do you typically edit in?",
        type: "single",
        options: [
          { value: "1080p", label: "1080p" },
          { value: "4k", label: "4K" },
          { value: "8k", label: "6K/8K or RAW" },
        ],
      },
      {
        id: "complexity",
        prompt: "How complex are your typical projects?",
        type: "single",
        options: [
          { value: "simple", label: "Simple cuts, light color/effects" },
          { value: "moderate", label: "Multi-layer timelines, moderate effects" },
          { value: "heavy", label: "Heavy color grading, VFX, multi-cam" },
        ],
      },
      {
        id: "storageNeeds",
        prompt: "How much active project storage do you need?",
        type: "single",
        options: [
          { value: "modest", label: "Under 1TB" },
          { value: "large", label: "1-4TB" },
          { value: "huge", label: "4TB+" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "streaming",
    label: "Streaming",
    icon: "Radio",
    description: "Play and encode at the same time without dropping frames.",
    focusCategories: ["cpu", "gpu", "ram", "storage", "microphone", "webcam", "capture-card"],
    questions: [
      {
        id: "streamType",
        prompt: "What are you mostly streaming?",
        type: "single",
        options: [
          { value: "gameplay", label: "Gameplay (playing on the same PC)" },
          { value: "console", label: "Console/external source via capture card" },
          { value: "irl", label: "IRL / talking / creative streams" },
        ],
      },
      {
        id: "encodeMethod",
        prompt: "Do you plan to encode on the GPU or dedicate a second PC?",
        type: "single",
        options: [
          { value: "single", label: "Single PC, GPU encoding" },
          { value: "dual", label: "Two-PC or dedicated encoding setup" },
        ],
      },
      {
        id: "quality",
        prompt: "What stream quality are you targeting?",
        type: "single",
        options: [
          { value: "720p", label: "720p/1080p, standard bitrate" },
          { value: "1080p60", label: "1080p60, higher bitrate" },
          { value: "1440p", label: "1440p or higher" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "3d-rendering",
    label: "3D Rendering",
    icon: "Box",
    description: "Move and render complex 3D scenes without waiting on your hardware.",
    focusCategories: ["gpu", "cpu", "ram", "storage", "psu", "cooler", "case"],
    questions: [
      {
        id: "software",
        prompt: "What do you use most?",
        type: "single",
        options: [
          { value: "blender", label: "Blender / Cinema 4D" },
          { value: "cad", label: "CAD (SolidWorks, Fusion 360)" },
          { value: "arch", label: "Archviz (Twinmotion, Enscape, V-Ray)" },
        ],
      },
      {
        id: "renderEngine",
        prompt: "Do you primarily render on GPU or CPU?",
        type: "single",
        options: [
          { value: "gpu", label: "GPU rendering (Cycles/OptiX, Redshift)" },
          { value: "cpu", label: "CPU rendering" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      {
        id: "sceneComplexity",
        prompt: "How complex are your typical scenes?",
        type: "single",
        options: [
          { value: "simple", label: "Simple models, light textures" },
          { value: "moderate", label: "Moderate detail and textures" },
          { value: "heavy", label: "Highly detailed scenes, large textures" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "content-creation",
    label: "Content Creation",
    icon: "Sparkles",
    description: "A flexible setup spanning editing, design, and publishing.",
    focusCategories: ["cpu", "gpu", "ram", "storage", "monitor", "microphone", "webcam"],
    questions: [
      {
        id: "formats",
        prompt: "What kind of content do you make?",
        type: "multi",
        options: [
          { value: "video", label: "Video" },
          { value: "photo", label: "Photo" },
          { value: "design", label: "Graphic design" },
          { value: "audio", label: "Audio / podcasting" },
        ],
      },
      {
        id: "colorWork",
        prompt: "Does your work depend on accurate color?",
        type: "single",
        options: [
          { value: "yes", label: "Yes — color accuracy matters" },
          { value: "no", label: "Not critical" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "workstation",
    label: "Workstation",
    icon: "Briefcase",
    description: "Professional, reliability-focused hardware for demanding technical work.",
    focusCategories: ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler"],
    questions: [
      {
        id: "field",
        prompt: "What's the primary use?",
        type: "single",
        options: [
          { value: "engineering", label: "Engineering / CAD / simulation" },
          { value: "data", label: "Data science / analytics" },
          { value: "dev", label: "Software development" },
          { value: "creative", label: "Creative production" },
        ],
      },
      {
        id: "uptime",
        prompt: "How important is uptime/reliability?",
        type: "single",
        options: [
          { value: "standard", label: "Standard reliability is fine" },
          { value: "critical", label: "Downtime is costly — prioritize reliability" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    icon: "Sparkles",
    description: "Local LLM inference, fine-tuning, and machine learning experimentation.",
    focusCategories: ["gpu", "cpu", "ram", "storage", "psu", "case", "cooler"],
    questions: [
      {
        id: "aiUse",
        prompt: "What are you mainly doing?",
        type: "multi",
        options: [
          { value: "inference", label: "Running existing models locally (LLM inference)", description: "Chatbots, coding assistants, image generation." },
          { value: "finetuning", label: "Fine-tuning or training smaller models" },
          { value: "datascience", label: "Data science / general ML experimentation" },
          { value: "learning", label: "Learning AI/ML fundamentals" },
        ],
      },
      {
        id: "modelSize",
        prompt: "How large are the models you want to run?",
        helper: "This is the single biggest factor in how much VRAM you need.",
        type: "single",
        options: [
          { value: "small", label: "Small (7B parameters and under)", description: "Runs comfortably on 8-12GB VRAM." },
          { value: "medium", label: "Medium (13B-34B)", description: "Wants 16-24GB VRAM for good performance." },
          { value: "large", label: "Large (70B+)", description: "Needs 24GB+ VRAM, or multiple GPUs / heavy quantization." },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "home-server",
    label: "Home Server",
    icon: "Server",
    description: "Always-on hardware for storage, media, or self-hosted services.",
    focusCategories: ["cpu", "ram", "storage", "case", "psu", "network-switch"],
    questions: [
      {
        id: "purpose",
        prompt: "What will the server mainly do?",
        type: "multi",
        options: [
          { value: "media", label: "Media server (Plex/Jellyfin)" },
          { value: "backup", label: "File storage / backup" },
          { value: "self-hosted", label: "Self-hosted apps / containers" },
          { value: "virtualization", label: "Virtualization — multiple VMs" },
          { value: "web-hosting", label: "Web hosting / small websites" },
          { value: "database", label: "Databases" },
          { value: "cybersecurity-lab", label: "Cybersecurity / pentesting lab" },
          { value: "small-business", label: "Small business server" },
        ],
      },
      {
        id: "storageAmount",
        prompt: "How much storage do you expect to need?",
        type: "single",
        options: [
          { value: "small", label: "Under 4TB" },
          { value: "medium", label: "4-16TB" },
          { value: "large", label: "16TB+" },
        ],
      },
      {
        id: "noise",
        prompt: "Where will it live?",
        type: "single",
        options: [
          { value: "living-space", label: "Living space — noise matters" },
          { value: "closet", label: "Closet/utility space — noise is less critical" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
  {
    id: "networking",
    label: "Networking",
    icon: "Wifi",
    description: "Reliable coverage and speed across your whole space.",
    focusCategories: ["router", "access-point", "network-switch"],
    questions: [
      {
        id: "deviceCount",
        prompt: "Roughly how many devices connect to your network?",
        type: "single",
        options: [
          { value: "few", label: "Under 10" },
          { value: "moderate", label: "10-25" },
          { value: "many", label: "25+" },
        ],
      },
      {
        id: "internetSpeed",
        prompt: "What's your internet plan's speed?",
        type: "single",
        options: [
          { value: "under-300", label: "Under 300 Mbps" },
          { value: "300-1000", label: "300 Mbps - 1 Gbps" },
          { value: "over-1000", label: "Over 1 Gbps" },
        ],
      },
      {
        id: "coverage",
        prompt: "How large is the space you need covered?",
        type: "single",
        options: [
          { value: "apartment", label: "Apartment / single floor" },
          { value: "house", label: "Multi-floor house" },
          { value: "large", label: "Large home or detached areas" },
        ],
      },
      {
        id: "connectionType",
        prompt: "Do you prefer wired or wireless where possible?",
        type: "single",
        options: [
          { value: "wired", label: "Wired when possible — best reliability" },
          { value: "wireless", label: "Mostly wireless — flexibility matters more" },
        ],
      },
      {
        id: "environment",
        prompt: "Any environmental challenges?",
        type: "multi",
        options: [
          { value: "thick-walls", label: "Thick walls / older construction" },
          { value: "multi-floor", label: "Multiple floors" },
          { value: "outdoor", label: "Needs some outdoor coverage" },
          { value: "none", label: "No major challenges" },
        ],
      },
    ],
  },
  {
    id: "custom-setup",
    label: "Custom Setup",
    icon: "Sliders",
    description: "Not sure which category fits? Tell us more and we'll tailor questions.",
    focusCategories: ["cpu", "gpu", "ram", "storage", "monitor", "psu", "case", "cooler"],
    questions: [
      {
        id: "primaryUse",
        prompt: "What will this hardware primarily be used for?",
        type: "multi",
        options: [
          { value: "gaming", label: "Gaming" },
          { value: "creative", label: "Creative work" },
          { value: "productivity", label: "Productivity / office" },
          { value: "development", label: "Development" },
          { value: "server", label: "Server / self-hosting" },
        ],
      },
      {
        id: "performancePreference",
        prompt: "Performance preference?",
        type: "single",
        options: [
          { value: "value", label: "Best value" },
          { value: "balanced", label: "Balanced" },
          { value: "performance", label: "Maximum performance" },
        ],
      },
      budgetQuestion,
      existingHardwareQuestion,
    ],
  },
];

export function getGoal(id: string) {
  return goals.find((g) => g.id === id);
}
