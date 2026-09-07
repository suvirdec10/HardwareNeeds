"use client";

import * as React from "react";

/**
 * Fades + slides a child into place the first time it enters the viewport.
 * Pure CSS transition driven by an IntersectionObserver — no animation
 * library, no layout thrash. Respects `prefers-reduced-motion` via the
 * sitewide `animation-duration: 0.01ms !important` override in globals.css,
 * so reduced-motion users still get the content, just without the motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Comp = Tag as "div";

  return (
    <Comp
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.6s var(--ease-premium) ${delay}ms, transform 0.6s var(--ease-premium) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Comp>
  );
}
