"use client";

import * as React from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animates a number counting up to `value` the first time it enters the
 * viewport. Jumps straight to the final value under `prefers-reduced-motion`
 * (this is JS-driven, not CSS, so it needs its own check rather than relying
 * on the sitewide animation-duration override).
 */
export function CountUp({
  value,
  prefix = "",
  duration = 900,
  className,
}: {
  value: number;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [reduceMotion] = React.useState(prefersReducedMotion);
  const [display, setDisplay] = React.useState(reduceMotion ? value : 0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  React.useEffect(() => {
    if (!started || reduceMotion) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US")}
    </span>
  );
}
