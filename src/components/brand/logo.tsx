import { cn } from "@/lib/utils";

/**
 * The HardwareNeeds mark: two posts (H / N's verticals) joined by a single
 * bent trace — a straight run into a 45° diagonal, the way a real PCB trace
 * routes — with a small via where it bends. One mark reads as both letters
 * rather than literally spelling either.
 */
export function LogoMark({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-5 w-5", className)} aria-hidden focusable="false">
      <path d="M7 6V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 6V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M7 9.5H11L17 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("text-accent", animate && "[stroke-dasharray:22] [stroke-dashoffset:22] animate-draw-line")}
      />
      <circle cx="11" cy="9.5" r="1.15" fill="currentColor" className="text-accent" />
    </svg>
  );
}

export function LogoMarkTile({
  className,
  size = "h-8 w-8",
  animate = false,
}: {
  className?: string;
  size?: string;
  animate?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface text-text transition-colors duration-300 group-hover:border-accent-border",
        size,
        className,
      )}
    >
      <LogoMark className="h-[55%] w-[55%] transition-transform duration-300 group-hover:scale-110" animate={animate} />
    </span>
  );
}
