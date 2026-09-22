"use client";

import {
  MONTHS,
  dateYearOptions,
  daysInMonth,
  parseDateParts,
  toDateString,
} from "@/lib/date-parts";

export function DateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const parts = parseDateParts(value);
  const years = dateYearOptions();
  const dayCount = daysInMonth(parts.year, parts.month);

  function update(next: Partial<{ year: number; month: number; day: number }>) {
    onChange(
      toDateString(
        next.year ?? parts.year,
        next.month ?? parts.month,
        next.day ?? parts.day
      )
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <label className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Он</span>
        <select
          className="h-12 w-full rounded-[14px] border-2 border-border bg-white px-2 text-base text-navy outline-none focus:border-primary"
          value={parts.year}
          onChange={(event) => update({ year: Number(event.target.value) })}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Сар</span>
        <select
          className="h-12 w-full rounded-[14px] border-2 border-border bg-white px-2 text-base text-navy outline-none focus:border-primary"
          value={parts.month}
          onChange={(event) => update({ month: Number(event.target.value) })}
        >
          {MONTHS.map((label, index) => (
            <option key={label} value={index + 1}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Өдөр</span>
        <select
          className="h-12 w-full rounded-[14px] border-2 border-border bg-white px-2 text-base text-navy outline-none focus:border-primary"
          value={Math.min(parts.day, dayCount)}
          onChange={(event) => update({ day: Number(event.target.value) })}
        >
          {Array.from({ length: dayCount }, (_, index) => index + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
