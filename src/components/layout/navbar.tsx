"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/plan", label: "Plan" },
  { href: "/hardware", label: "Hardware" },
  { href: "/compare", label: "Compare" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-canvas/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-surface">
            <span className="h-2 w-2 rounded-sm bg-accent" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-text">HardwareNeeds</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[13.5px] font-medium transition-colors",
                  active ? "text-text" : "text-text-muted hover:text-text",
                )}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute -bottom-[21px] left-0 right-0 h-px origin-left animate-fade-in-fast bg-accent"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/plan" size="sm">
            Plan Your Hardware
          </LinkButton>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-text transition-colors hover:border-border-strong lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className="grid transition-transform duration-300"
            style={{ transform: mobileOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </span>
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-b border-border bg-canvas transition-all duration-300 ease-out lg:hidden",
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                {item.label}
              </Link>
            ))}
            <LinkButton href="/plan" className="mt-2 w-full justify-center">
              Plan Your Hardware
            </LinkButton>
          </nav>
        </div>
      </div>
    </header>
  );
}
