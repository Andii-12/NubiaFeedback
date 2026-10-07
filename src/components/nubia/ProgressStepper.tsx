"use client";

export function ProgressStepper({
  step,
  total = 4,
}: {
  step: number;
  total?: number;
}) {
  const percent = Math.min(100, (step / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-navy">
        Алхам {step} / {total}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-nubia-light">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
