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
