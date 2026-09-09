"use client";

import { ScanLine, Barcode, Monitor, Printer, Ticket, Wifi, MoreHorizontal } from "lucide-react";
import { DEVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DeviceType } from "@/types";

const ICONS: Record<DeviceType, React.ReactNode> = {
  OCR: <ScanLine className="size-5" />,
  BGR: <Barcode className="size-5" />,
  WS: <Monitor className="size-5" />,
  BTP: <Printer className="size-5" />,
  BPP: <Ticket className="size-5" />,
  Network: <Wifi className="size-5" />,
  Other: <MoreHorizontal className="size-5" />,
};

export function DeviceSelector({
  value,
  onChange,
}: {
  value: DeviceType[];
  onChange: (next: DeviceType[]) => void;
}) {
  function toggle(device: DeviceType) {
    if (value.includes(device)) {
      onChange(value.filter((item) => item !== device));
    } else {
      onChange([...value, device]);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {DEVICES.map((device) => {
        const selected = value.includes(device.value);
        return (
          <button
            key={device.value}
            type="button"
            onClick={() => toggle(device.value)}
            className={cn(
              "flex min-h-[88px] flex-col items-start gap-1 rounded-[16px] border-2 p-3 text-left transition-all",
              selected
                ? "border-primary bg-nubia-light shadow-sm"
                : "border-border bg-white hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "grid size-8 place-items-center rounded-lg",
                selected ? "bg-primary text-white" : "bg-nubia-light text-primary"
              )}
            >
              {ICONS[device.value]}
            </span>
            <span className="text-[15px] font-semibold text-navy">
              {device.label}
            </span>
            <span className="text-xs text-muted-foreground">{device.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
