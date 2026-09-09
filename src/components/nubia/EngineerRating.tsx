"use client";

import { Star } from "lucide-react";
import { ENGINEER_RATING_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function EngineerRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="grid size-12 place-items-center rounded-full hover:bg-nubia-light"
            aria-label={`${star} од`}
          >
            <Star
              className={cn(
                "size-8",
                star <= value
                  ? "fill-amber-400 text-amber-400"
                  : "text-border"
              )}
            />
          </button>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-navy">
        {value ? `${value} / 5 · ${ENGINEER_RATING_LABELS[value]}` : "Үнэлгээ сонгоно уу"}
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
