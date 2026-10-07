"use client";

import { cn } from "@/lib/utils";

export function QuestionCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-white p-3 shadow-sm",
        className
      )}
    >
      <h2 className="text-[15px] font-semibold leading-snug text-navy">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      ) : null}
      <div className="mt-2.5">{children}</div>
    </section>
  );
}
