"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({
  value,
  onValueChange,
  options,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-border-strong bg-surface px-4 text-[14px] text-text transition-colors hover:border-accent-border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className,
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-text-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 overflow-hidden rounded-md border border-border-strong bg-canvas-raised shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
          position="popper"
          sideOffset={6}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className="relative flex cursor-pointer select-none items-center rounded px-3 py-2.5 pl-8 text-[13.5px] text-text-muted outline-none transition-colors data-[highlighted]:bg-surface-2 data-[highlighted]:text-text data-[state=checked]:text-text"
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2.5 inline-flex items-center">
                  <Check className="h-3.5 w-3.5 text-accent" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
