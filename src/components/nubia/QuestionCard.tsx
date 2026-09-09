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
        "rounded-[16px] border border-border bg-white p-4 shadow-sm",
        className
      )}
    >
      <h2 className="text-[17px] font-semibold leading-snug text-navy">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
