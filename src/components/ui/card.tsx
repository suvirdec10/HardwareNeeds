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
          "transition-colors duration-300 ease-out hover:border-border-strong hover:bg-surface-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
