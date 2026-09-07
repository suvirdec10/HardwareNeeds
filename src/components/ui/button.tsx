import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-[#04070d] shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_1px_2px_rgba(0,0,0,0.3)] hover:bg-accent-strong hover:shadow-[0_1px_0_0_rgba(255,255,255,0.3)_inset,0_6px_16px_-4px_rgba(76,141,255,0.45)] active:bg-accent",
  secondary:
    "bg-transparent text-text border border-border-strong hover:border-accent-border hover:bg-surface",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-surface/60",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium tracking-[-0.01em] transition-[background-color,border-color,box-shadow,transform,opacity,color] cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-px active:translate-y-0 active:scale-[0.98] whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: BaseProps &
  React.ComponentPropsWithoutRef<typeof Link> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
