export { cn } from "cn";
import type { Shift } from "@/types";

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function localDateISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function localTime(d = new Date()) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function formatClock(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function formatTimeRange(start: number, end: number) {
  return `${formatClock(start)}–${formatClock(end)}`;
}

export function clockToMinutes(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

export function parseTimeRange(value: string) {
  const match = /^(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const start = clockToMinutes(`${match[1]}:${match[2]}`);
  const end = clockToMinutes(`${match[3]}:${match[4]}`);
  if (start == null || end == null || end <= start) return null;
  return { start, end };
}

export function hourFromRange(value: string) {
  const range = parseTimeRange(value);
  return range ? Math.floor(range.start / 60) : null;
}

export function shiftFromHour(hour: number): Shift {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function stampDateTime(d = new Date()) {
  return {
    date: localDateISO(d),
    time: localTime(d),
    shift: shiftFromHour(d.getHours()),
  };
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000"
  );
}
