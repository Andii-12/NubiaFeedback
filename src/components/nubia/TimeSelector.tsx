"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  clockToMinutes,
  cn,
  formatClock,
  formatTimeRange,
  parseTimeRange,
} from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = [0, 15, 30, 45];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function TimeField({
  label,
  value,
  align,
  onChange,
}: {
  label: string;
  value: string;
  align: "start" | "end";
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function choose(nextHour: number, nextMinute: number, closeAfter: boolean) {
    onChange(`${pad(nextHour)}:${pad(nextMinute)}`);
    if (closeAfter) setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-border bg-white px-3 text-sm text-navy outline-none focus:border-primary"
      >
        <span>{`${pad(hour)}:${pad(minute)}`}</span>
        <Clock className="size-4 text-muted-foreground" />
      </button>
      {open ? (
        <div
          className={cn(
            "absolute bottom-full z-30 mb-1 w-[232px] rounded-xl border border-border bg-white p-2 shadow-lg",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          <div className="grid grid-cols-6 gap-1">
            {HOURS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => choose(item, minute, false)}
                className={cn(
                  "h-8 rounded-lg text-xs font-medium",
                  item === hour
                    ? "bg-primary text-white"
                    : "text-navy hover:bg-nubia-light"
                )}
              >
                {pad(item)}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1 border-t border-border pt-2">
            {MINUTES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => choose(hour, item, true)}
                className={cn(
                  "h-8 rounded-lg text-xs font-medium",
                  item === minute
                    ? "bg-primary text-white"
                    : "text-navy hover:bg-nubia-light"
                )}
              >
                {pad(item)}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TimeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const { t } = useI18n();
  const parsed = parseTimeRange(value);
  const start = parsed ? formatClock(parsed.start) : "09:00";
  const end = parsed ? formatClock(parsed.end) : "10:00";

  useEffect(() => {
    if (!parseTimeRange(value)) onChange(formatTimeRange(9 * 60, 10 * 60));
  }, [value, onChange]);

  function commit(startValue: string, endValue: string) {
    const startMinutes = clockToMinutes(startValue);
    let endMinutes = clockToMinutes(endValue);
    if (startMinutes == null || endMinutes == null) return;
    if (endMinutes <= startMinutes) {
      endMinutes = Math.min(startMinutes + 60, 23 * 60 + 45);
    }
    if (endMinutes <= startMinutes) return;
    onChange(formatTimeRange(startMinutes, endMinutes));
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
      <TimeField
        label={t.form.timeFrom}
        value={start}
        align="start"
        onChange={(next) => commit(next, end)}
      />
      <span className="pb-2 text-sm text-muted-foreground">–</span>
      <TimeField
        label={t.form.timeTo}
        value={end}
        align="end"
        onChange={(next) => commit(start, next)}
      />
    </div>
  );
}
