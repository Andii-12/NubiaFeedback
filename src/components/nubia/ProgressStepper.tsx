"use client";

import { cn } from "@/lib/utils";

export function ProgressStepper({
  step,
  total = 4,
}: {
  step: number;
  total?: number;
}) {
  const percent = Math.min(100, (step / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-navy">Алхам {step} / {total}</span>
        <span className="text-muted-foreground">{Math.round(percent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-nubia-light">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < step ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}
