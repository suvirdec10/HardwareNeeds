import Link from "next/link";
import { categoriesByGroup } from "@/lib/data/categories";
import { LogoMarkTile } from "@/components/brand/logo";

const productLinks = [
  { href: "/plan", label: "Plan Your Hardware" },
  { href: "/hardware", label: "Hardware Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/compatibility", label: "Compatibility" },
  { href: "/upgrade", label: "Upgrade Mode" },
];

const learnLinks = [
  { href: "/learn", label: "All Topics" },
  { href: "/learn/cpu", label: "CPU" },
  { href: "/learn/gpu", label: "GPU" },
  { href: "/learn/ram", label: "RAM" },
  { href: "/learn/storage", label: "Storage" },
];

export function Footer() {
  const groups = Array.from(categoriesByGroup().keys()).slice(0, 6);

  return (
    <footer className="divider-fade-top">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:py-20">
        <div>
          <Link href="/" className="group flex items-center gap-2.5">
            <LogoMarkTile size="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-text">HardwareNeeds</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
            Hardware planning, recommendation, compatibility, comparison, and education —
            in one place.
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">Product</p>
          <ul className="mt-4 space-y-2.5">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-text-muted transition-colors hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">Learn</p>
          <ul className="mt-4 space-y-2.5">
            {learnLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-text-muted transition-colors hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">Hardware</p>
          <ul className="mt-4 space-y-2.5">
            {groups.map((g) => (
              <li key={g}>
                <Link
                  href={`/hardware#${g.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {g}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="divider-fade-top">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-text-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} HardwareNeeds. Product and pricing data shown is sample data for demonstration.</p>
          <p>Built to help you understand hardware — not just buy it.</p>
        </div>
      </div>
    </footer>
  );
}
