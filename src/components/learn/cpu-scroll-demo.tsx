"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { use3DCapability } from "@/hooks/use-3d-capability";

const CpuCanvas = dynamic(() => import("./cpu-canvas").then((m) => m.CpuCanvas), { ssr: false });

const stages = [
  {
    title: "Cores",
    body: "Each core is an independent execution unit. This chip has eight — meaning eight instruction streams can genuinely run at once.",
  },
  {
    title: "Threads",
    body: "Most cores here run two threads each, filling idle execution slots when one thread is waiting on data.",
  },
  {
    title: "Cache",
    body: "A ring of fast on-die memory keeps frequently used data close to the cores, avoiding slow round-trips to system RAM.",
  },
  {
    title: "Clock speed",
    body: "Each core executes billions of cycles per second. Higher clocks mean faster single-threaded work.",
  },
  {
    title: "Workload",
    body: "Not every task uses every core. A lightly threaded game might only keep five of eight cores meaningfully busy.",
  },
  {
    title: "Performance",
    body: "Real-world performance is the combination of all of this — core count, clock speed, cache, and how well a workload actually uses them.",
  },
];

export function CpuScrollDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [stage, setStage] = React.useState(0);
  const { capable } = use3DCapability();

  React.useEffect(() => {
    if (!capable) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setStage(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [capable]);

  if (!capable) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {stages.map((s) => (
          <div key={s.title} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-[13.5px] font-medium text-text">{s.title}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "420vh" }}>
      <div className="sticky top-16 grid h-[calc(100vh-4rem)] items-center gap-10 lg:grid-cols-2">
        <div className="relative order-2 h-[50vh] lg:order-1 lg:h-[60vh]">
          <CpuCanvas stage={stage} />
        </div>
        <div className="order-1 lg:order-2">
          {stages.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                "border-l-2 py-3 pl-5 transition-all duration-500",
                i === stage
                  ? "border-accent opacity-100"
                  : "border-border opacity-35",
              )}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg font-medium text-text">{s.title}</p>
              {i === stage && (
                <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-text-muted">{s.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
