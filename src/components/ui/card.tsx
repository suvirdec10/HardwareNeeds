import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface",
        interactive &&
          "transition-[border-color,background-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2 hover:shadow-[0_16px_32px_-16px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
