"use client";

import { ScanLine, Barcode, Monitor, Printer, Ticket, Wifi, MoreHorizontal } from "lucide-react";
import { DEVICES } from "@/lib/constants";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { optionLabel } from "@/lib/i18n/options";
import { cn } from "@/lib/utils";
import type { DeviceType } from "@/types";

const ICONS: Record<DeviceType, React.ReactNode> = {
  OCR: <ScanLine className="size-3.5" />,
  BGR: <Barcode className="size-3.5" />,
  WS: <Monitor className="size-3.5" />,
  BTP: <Printer className="size-3.5" />,
  BPP: <Ticket className="size-3.5" />,
  DCP: <Printer className="size-3.5" />,
  Network: <Wifi className="size-3.5" />,
  Other: <MoreHorizontal className="size-3.5" />,
};

export function DeviceSelector({
  value,
  onChange,
  showBgr = true,
}: {
  value: DeviceType[];
  onChange: (next: DeviceType[]) => void;
  showBgr?: boolean;
}) {
  const { locale } = useI18n();

  function toggle(device: DeviceType) {
    if (value.includes(device)) {
      onChange(value.filter((item) => item !== device));
    } else {
      onChange([...value, device]);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {DEVICES.filter((device) => showBgr || device.value !== "BGR").map((device) => {
        const selected = value.includes(device.value);
        return (
          <button
            key={device.value}
            type="button"
            onClick={() => toggle(device.value)}
            className={cn(
              "flex min-h-16 flex-col items-start gap-0.5 rounded-xl border px-2.5 py-2 text-left transition-all",
              selected
                ? "border-primary bg-nubia-light shadow-sm"
                : "border-border bg-white hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-md",
                selected ? "bg-primary text-white" : "bg-nubia-light text-primary"
              )}
            >
              {ICONS[device.value]}
            </span>
            <span className="text-sm font-semibold text-navy">
              {optionLabel(locale, "device", device.value)}
            </span>
            {optionLabel(locale, "hint", device.value) !== device.value ? (
              <span className="text-xs text-muted-foreground">
                {optionLabel(locale, "hint", device.value)}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
