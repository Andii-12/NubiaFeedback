"use client";

import { useEffect } from "react";
import {
  MONTHS,
  clampDateToToday,
  dateYearOptions,
  daysInMonth,
  parseDateParts,
  todayParts,
  toDateString,
} from "@/lib/date-parts";

export function DateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const today = todayParts();
  const parts = parseDateParts(clampDateToToday(value));
  const years = dateYearOptions().filter((year) => year <= today.year);
  const monthLimit = parts.year === today.year ? today.month : 12;
  const dayCount =
    parts.year === today.year && parts.month === today.month
      ? today.day
      : daysInMonth(parts.year, parts.month);

  useEffect(() => {
    const clamped = clampDateToToday(value);
    if (clamped !== value) onChange(clamped);
  }, [value, onChange]);

  function update(next: Partial<{ year: number; month: number; day: number }>) {
    onChange(
      clampDateToToday(
        toDateString(
          next.year ?? parts.year,
          next.month ?? parts.month,
          next.day ?? parts.day
        )
      )
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <label className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Он</span>
        <select
          className="h-10 w-full rounded-xl border border-border bg-white px-2 text-sm text-navy outline-none focus:border-primary"
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
          className="h-10 w-full rounded-xl border border-border bg-white px-2 text-sm text-navy outline-none focus:border-primary"
          value={parts.month}
          onChange={(event) => update({ month: Number(event.target.value) })}
        >
          {MONTHS.slice(0, monthLimit).map((label, index) => (
            <option key={label} value={index + 1}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Өдөр</span>
        <select
          className="h-10 w-full rounded-xl border border-border bg-white px-2 text-sm text-navy outline-none focus:border-primary"
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
