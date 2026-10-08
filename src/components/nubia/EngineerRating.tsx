"use client";

import { Star } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { optionLabel } from "@/lib/i18n/options";
import { cn } from "@/lib/utils";

export function EngineerRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const { locale, t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="grid size-10 place-items-center rounded-full hover:bg-nubia-light"
            aria-label={`${star} ${t.form.star}`}
          >
            <Star
              className={cn(
                "size-7",
                star <= value
                  ? "fill-amber-400 text-amber-400"
                  : "text-border"
              )}
            />
          </button>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-navy">
        {value
          ? `${value} / 5 · ${optionLabel(locale, "rating", String(value))}`
          : t.form.pickRating}
      </p>
    </div>
  );
}

export function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return <EngineerRating value={value} onChange={onChange} />;
}
