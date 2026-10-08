"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";

export function ProgressStepper({
  step,
  total = 4,
}: {
  step: number;
  total?: number;
}) {
  const { t } = useI18n();
  const percent = Math.min(100, (step / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-navy">
        {t.common.step} {step} / {total}
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
