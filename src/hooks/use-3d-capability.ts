"use client";

import * as React from "react";

/**
 * Decides whether the full interactive 3D scene should render.
 *
 * Falls back to a lightweight static visualization on small viewports,
 * for users who prefer reduced motion, or on hardware that reports very
 * limited concurrency — the 3D system should never be the reason a page
 * feels slow.
 */
export function use3DCapability() {
  const [capable, setCapable] = React.useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthQuery = window.matchMedia("(min-width: 768px)");

    const evaluate = () => {
      const cores = navigator.hardwareConcurrency ?? 4;
      const isWide = widthQuery.matches;
      const prefersReduced = motionQuery.matches;
      setReducedMotion(prefersReduced);
      setCapable(isWide && cores >= 4 && !prefersReduced);
    };

    evaluate();
    motionQuery.addEventListener("change", evaluate);
    widthQuery.addEventListener("change", evaluate);
    return () => {
      motionQuery.removeEventListener("change", evaluate);
      widthQuery.removeEventListener("change", evaluate);
    };
  }, []);

  return { capable, reducedMotion };
}
