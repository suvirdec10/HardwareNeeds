export interface FaqEntry {
  id: string;
  question: string;
  answer: string[];
}

export const faqEntries: FaqEntry[] = [
  {
    id: "vs-google",
    question: "How is HardwareNeeds different from just searching on Google?",
    answer: [
      "Google can show you individual products and reviews, but HardwareNeeds is designed to understand what you're actually trying to build or accomplish.",
      "Instead of making you research CPUs, GPUs, RAM, motherboards, power supplies, compatibility, and dozens of specifications separately, HardwareNeeds combines those factors and recommends hardware based on your workload, budget, compatibility requirements, and priorities.",
    ],
  },
  {
    id: "vs-pcpartpicker",
    question: "Why shouldn't I just use PCPartPicker?",
    answer: [
      "PCPartPicker is excellent for selecting parts and checking a lot of PC compatibility requirements — it's a great tool.",
      "HardwareNeeds has a different goal: it starts with what you want to accomplish and explains what hardware you need and why, rather than starting from a parts list you already know you need.",
      "It's also meant to eventually cover more than custom gaming PCs — AI workloads, programming, servers, NAS systems, workstations, networking, maker hardware, school projects, and business technology.",
    ],
  },
  {
    id: "how-recommend",
    question: "How does HardwareNeeds decide what hardware to recommend?",
    answer: [
      "HardwareNeeds considers factors such as budget, workload, performance needs, compatibility, power requirements, memory requirements, upgradeability, efficiency, software ecosystem, price/performance, and portability where applicable.",
      "The goal isn't simply to recommend the most expensive component — it's to recommend hardware that makes sense for the specific person asking.",
    ],
  },
  {
    id: "real-specs",
    question: "Are the hardware specifications real?",
    answer: [
      "Yes — HardwareNeeds uses real hardware products and specifications drawn from public manufacturer and retailer listings, not invented data.",
      "If a specification can't be reliably verified, it's either left out or clearly marked with lower confidence rather than guessed at. Every product also lists whether its data is \"Verified\" or \"Reference\" quality.",
    ],
  },
  {
    id: "uses-ai",
    question: "Does HardwareNeeds use AI?",
    answer: [
      "Yes, in a specific way: AI helps interpret what you're trying to accomplish, understand natural-language requests, compare tradeoffs, and explain recommendations in plain language.",
      "AI does not invent specifications. Hardware facts always come from the structured HardwareNeeds catalog and compatibility system — AI reasons over that trusted data, it doesn't replace it.",
      "Right now, that layer is a deterministic assistant built on the real recommendation engine, not a live language model — see the assistant panel on the Plan page for details.",
    ],
  },
  {
    id: "full-pc",
    question: "Can HardwareNeeds build an entire PC for me?",
    answer: [
      "HardwareNeeds is being designed to recommend complete, compatible systems — CPU, GPU, motherboard, RAM, storage, power supply, case, and cooling.",
      "It checks compatibility between the selected components and explains why each part was chosen, not just what to buy.",
    ],
  },
  {
    id: "ai-hardware",
    question: "Can HardwareNeeds help with AI and machine learning hardware?",
    answer: [
      "Yes — things like running local LLMs, machine learning, model inference, model fine-tuning, CUDA workloads, data science, and general GPU computing.",
      "VRAM, GPU ecosystem, memory capacity, compute performance, power consumption, and budget can all matter for these workloads, and the planner weighs them accordingly.",
    ],
  },
  {
    id: "servers",
    question: "Can HardwareNeeds recommend servers?",
    answer: [
      "HardwareNeeds is built to support server-oriented workloads: home servers, web hosting, virtualization, databases, NAS, cybersecurity labs, small-business servers, AI servers, and development servers.",
    ],
  },
  {
    id: "compatibility",
    question: "Can HardwareNeeds tell me whether parts are compatible?",
    answer: [
      "Yes. Examples of what it checks: CPU ↔ motherboard socket, motherboard ↔ RAM generation, GPU ↔ PSU, GPU ↔ case, CPU ↔ cooler, motherboard ↔ case, storage ↔ motherboard interfaces, PCIe compatibility, ECC support, and server CPU ↔ server motherboard.",
    ],
  },
  {
    id: "beginners",
    question: "Is HardwareNeeds only for people who already understand computers?",
    answer: [
      "No — this is one of the central reasons HardwareNeeds exists.",
      "Technical specifications are accompanied by understandable explanations. For example, VRAM: \"Memory dedicated to the graphics processor. More VRAM can help with larger AI models, higher-resolution gaming, and demanding GPU workloads.\"",
    ],
  },
  {
    id: "database-currency",
    question: "How current is the hardware database?",
    answer: [
      "HardwareNeeds is an evolving project. The architecture is built to support a large and continuously expanding catalog of real hardware, but it doesn't claim that every piece of hardware in existence is already included — the current catalog is a carefully-sourced seed, not a finished inventory.",
    ],
  },
  {
    id: "who-built-it",
    question: "Who built HardwareNeeds?",
    answer: [
      "HardwareNeeds was built by Suvir Rao, a high school student at Amador Valley High School with an interest in hardware, computing, software, and technology.",
      "The project started from a simple idea: choosing hardware should be easier to understand than it usually is.",
    ],
  },
  {
    id: "get-started",
    question: "How do I get started?",
    answer: [
      "Click \"Plan Your Hardware.\" You'll describe what you want to accomplish, select your goals, budget, and requirements, and get hardware recommendations with the reasoning behind each one.",
    ],
  },
];

export function getFaqEntry(id: string) {
  return faqEntries.find((f) => f.id === id);
}
