"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";
import { use3DCapability } from "@/hooks/use-3d-capability";
import { HardwareSystemFallback } from "@/components/three/hardware-system-fallback";

const HeroCanvas = dynamic(() => import("./hero-canvas").then((m) => m.HeroCanvas), {
  ssr: false,
});

/** Maps a value from [inMin, inMax] to [outMin, outMax], clamped. */
function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}

export function HeroExperience() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
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
      const scrolled = -rect.top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setProgress(p);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [capable]);

  const heroOpacity = mapRange(progress, 0, 0.18, 1, 0);
  const heroY = mapRange(progress, 0, 0.22, 0, -40);
  const scrollHintOpacity = mapRange(progress, 0, 0.06, 1, 0);
  const explode = mapRange(progress, 0.16, 0.7, 0, 1);
  const captionOpacityIn = mapRange(progress, 0.42, 0.56, 0, 1);
  const captionOpacityOut = mapRange(progress, 0.82, 0.94, 1, 0);
  const captionOpacity = Math.min(captionOpacityIn, captionOpacityOut);
  const captionY = mapRange(progress, 0.42, 0.56, 16, 0);

  return (
    <section ref={wrapperRef} className="relative" style={{ height: capable ? "300vh" : "auto" }}>
      <div className={capable ? "sticky top-0 h-screen overflow-hidden" : "relative overflow-hidden"}>
        <div className="absolute inset-0 -z-10">
          {capable ? (
            <HeroCanvas explode={explode} hovered={hovered} onHover={setHovered} />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_60%_35%,rgba(76,141,255,0.08),transparent_60%)]" />
          )}
        </div>

        <div className="grain-overlay" />

        <div className="container-page relative flex h-full min-h-screen flex-col justify-center py-32 lg:py-40">
          <div
            style={capable ? { opacity: heroOpacity, transform: `translateY(${heroY}px)` } : undefined}
            className="max-w-2xl"
          >
            <Eyebrow>Hardware planning, made understandable</Eyebrow>
            <h1 className="mt-5 text-balance text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.02em] text-text sm:text-6xl lg:text-[4.25rem]">
              Hardware, made understandable.
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-text-muted">
              Tell HardwareNeeds what you&apos;re trying to accomplish. We&apos;ll help you figure out the
              hardware you need, how it works together, and why.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LinkButton href="/plan" size="lg">
                Plan Your Hardware
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/hardware" variant="secondary" size="lg">
                Explore Hardware
              </LinkButton>
            </div>
          </div>

          {!capable && (
            <div className="mt-16">
              <HardwareSystemFallback />
            </div>
          )}

          {capable && (
            <div
              style={{ opacity: captionOpacity, transform: `translateY(${captionY}px)` }}
              className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex flex-col items-center text-center"
            >
              <div
                className="absolute inset-x-0 bottom-0 -z-10 h-56"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(8,9,11,0.9), transparent 75%)",
                }}
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                Scroll to explore
              </p>
              <p className="mt-2 text-2xl font-medium tracking-[-0.01em] text-text">
                Understand what you&apos;re looking at.
              </p>
              <p className="mt-1 max-w-md text-sm text-text-muted">
                Every part of a system works together. Hover any component to see what it does.
              </p>
            </div>
          )}

          {capable && (
            <div
              style={{ opacity: scrollHintOpacity }}
              className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <ChevronDown className="h-5 w-5 text-text-faint" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
