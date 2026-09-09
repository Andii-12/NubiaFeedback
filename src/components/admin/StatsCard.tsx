import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  hint,
  change,
}: {
  label: string;
  value: string | number;
  hint?: string;
  change?: number;
}) {
  return (
    <div className="rounded-[16px] border border-border bg-white p-5 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-navy">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof change === "number" ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              change >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}
