# HardwareNeeds

Hardware planning, recommendation, compatibility, comparison, and learning platform.

**The core idea:** tell HardwareNeeds what you're trying to accomplish, and it explains what
hardware that actually requires, how the pieces fit together, and why — not just what to buy.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`
- **React Three Fiber / drei / three.js** — the interactive hardware visualization
- **Radix UI primitives** — tooltip, tabs, select, slider, dialog, accordion
- **lucide-react** — icons

## Structure

```
src/
  app/                 Routes (App Router)
  components/
    ui/                Design system primitives (Button, Card, Tag, Tooltip)
    layout/             Navbar, Footer
    three/              Reusable 3D hardware system (parts, scene, fallback)
    home/, plan/, ...   Page-specific composition
  lib/
    data/               Sample hardware catalog, categories, compatibility rules,
                         learn content, planner goals/questions, and the
                         recommendation/upgrade rule engines. Structured so a real
                         database/API can replace the static arrays without
                         touching the pages that consume them.
  hooks/                use3DCapability (device/motion-aware 3D degradation)
```

All product, pricing, and compatibility data under `src/lib/data` is **sample data** for
demonstration — every product carries `isSampleData: true` and the UI labels it as such.

## Development

```bash
npm install
npm run dev
```
