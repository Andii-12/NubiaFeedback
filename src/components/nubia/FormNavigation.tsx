"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FormNavigation({
  onBack,
  onNext,
  nextLabel = "Үргэлжлүүлэх →",
  backLabel = "Буцах",
  showBack = true,
  loading = false,
  disabled = false,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 px-4 py-3 backdrop-blur md:static md:mt-6 md:rounded-[16px] md:border md:px-4">
      <div className={cn("grid gap-2", showBack ? "grid-cols-2" : "grid-cols-1")}>
        {showBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 rounded-[14px] text-base"
          >
            {backLabel}
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={onNext}
          disabled={disabled || loading}
          className="h-12 rounded-[14px] text-base"
        >
          {loading ? "Илгээж байна..." : nextLabel}
        </Button>
      </div>
    </div>
  );
}
