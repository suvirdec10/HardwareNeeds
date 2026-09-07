import { Check, AlertTriangle, Zap, TrendingUp, Gauge } from "lucide-react";
import type { SystemSummary as SystemSummaryData } from "@/lib/data/types";
import { Tag } from "@/components/ui/tag";
import { CountUp } from "@/components/ui/count-up";

export function SystemSummary({ summary }: { summary: SystemSummaryData }) {
  const compatible = summary.compatibilityStatus === "compatible";

  return (
    <div className="mt-8 animate-fade-up rounded-xl border border-border bg-canvas-raised p-6 sm:p-8" style={{ animationDelay: "80ms" }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">System summary</span>
          <p className="mt-1 text-[13.5px] text-text-muted">Validated as a whole build, not just parts picked in isolation.</p>
        </div>
        <Tag tone={compatible ? "success" : "warning"}>
          {compatible ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
          {compatible ? "Compatible as configured" : "Needs a closer look"}
        </Tag>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border-faint bg-surface p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Estimated total</span>
          <CountUp value={summary.totalCostUSD} prefix="$" className="mt-1 block font-mono text-xl text-text" />
        </div>
        {typeof summary.workloadFitAvg === "number" && (
          <div className="rounded-lg border border-border-faint bg-surface p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Workload fit</span>
            <span className="mt-1 flex items-center gap-1.5 font-mono text-xl text-text">
              <Gauge className="h-4 w-4 text-accent" />
              {summary.workloadFitAvg}%
            </span>
          </div>
        )}
        {typeof summary.estimatedPowerDrawW === "number" && (
          <div className="rounded-lg border border-border-faint bg-surface p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Est. power draw</span>
            <span className="mt-1 flex items-center gap-1.5 font-mono text-xl text-text">
              <Zap className="h-4 w-4 text-accent" />
              {summary.estimatedPowerDrawW}W
            </span>
          </div>
        )}
        <div className="rounded-lg border border-border-faint bg-surface p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Compatibility checks</span>
          <span className="mt-1 flex items-center gap-1.5 font-mono text-xl text-text">
            <TrendingUp className="h-4 w-4 text-accent" />
            {summary.compatibilityChecks.filter((c) => c.ok).length}/{summary.compatibilityChecks.length || "—"}
          </span>
        </div>
      </div>

      {summary.compatibilityChecks.length > 0 && (
        <div className="mt-6 space-y-2">
          {summary.compatibilityChecks.map((c) => (
            <div key={c.label} className="flex items-start gap-2.5 text-[13px]">
              {c.ok ? (
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
              )}
              <span className="text-text-muted">
                <span className="font-medium text-text">{c.label}.</span> {c.detail}
              </span>
            </div>
          ))}
        </div>
      )}

      {summary.strengths.length > 0 && (
        <div className="mt-6 border-t border-border-faint pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Primary strengths</span>
          <ul className="mt-2.5 space-y-1.5">
            {summary.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.upgradePath.length > 0 && (
        <div className="mt-6 border-t border-border-faint pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Upgrade path</span>
          <ul className="mt-2.5 space-y-1.5">
            {summary.upgradePath.map((u, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.limitations.length > 0 && (
        <div className="mt-6 border-t border-border-faint pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">Potential limitations</span>
          <ul className="mt-2.5 space-y-1.5">
            {summary.limitations.map((l, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-muted">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
