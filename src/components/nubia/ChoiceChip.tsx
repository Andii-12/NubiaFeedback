"use client";

import { cn } from "@/lib/utils";

export function ChoiceChip({
  selected,
  onClick,
  children,
  className,
  icon,
  tone,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  tone?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-[14px] border-2 px-3.5 py-3 text-left text-[15px] font-medium transition-all",
        selected
          ? "border-primary bg-nubia-light text-navy shadow-sm"
          : "border-border bg-white text-navy hover:border-primary/40 hover:bg-nubia-light/60",
        tone && selected ? tone : "",
        className
      )}
    >
      {icon ? <span className="shrink-0 text-lg">{icon}</span> : null}
      <span className="flex-1">{children}</span>
      <span
        className={cn(
          "grid size-5 place-items-center rounded-full border",
          selected
            ? "border-primary bg-primary text-white"
            : "border-border bg-white"
        )}
      >
        {selected ? (
          <svg viewBox="0 0 12 12" className="size-3" fill="none">
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
