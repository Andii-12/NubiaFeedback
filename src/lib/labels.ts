import { formatDeviceAnswers } from "@/lib/device-answers";
import { optionLabel, type Locale } from "@/lib/i18n/options";
import type { LocationType } from "@/types";

export function createLabels(locale: Locale) {
  const text = (group: string, value?: string | null) =>
    value ? optionLabel(locale, group, value) : "—";

  return {
    device: (value?: string) => text("device", value),
    devices: (values?: string[]) =>
      values?.length
        ? values.map((value) => optionLabel(locale, "device", value)).join(", ")
        : "—",
    deviceStatus: (value?: string) => text("status", value),
    deviceReport: (
      answers?: { device: string; status: string; detail?: string }[],
      fallback?: string
    ) => formatDeviceAnswers(answers, locale) || text("status", fallback),
    printing: (value?: string) => text("print", value),
    scanning: (value?: string) => text("scan", value),
    workstation: (value?: string) => text("work", value),
    impact: (value?: string) => text("impact", value),
    impactSeverity: (value?: string) => {
      const severity: Record<string, string> = {
        none: "Low",
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
      };
      return value ? severity[value] || "—" : "—";
    },
    shift: (value?: string) => text("shift", value),
    responseSpeed: (value?: string) => text("speed", value),
    resolutionSpeed: (value?: string) => text("resolution", value),
    fullyResolved: (value?: string) => text("resolved", value),
    communication: (value?: string) => text("communication", value),
    explanation: (value?: string) => text("explanation", value),
    locationType: (value?: LocationType | string) =>
      value === "gate" ? "Gate" : value === "checkin" ? "Check-in" : "—",
    locationTypes: (values?: (LocationType | string)[]) => {
      if (!values?.length) return "—";
      return [...new Set(values)]
        .map((value) =>
          value === "gate" ? "Gate" : value === "checkin" ? "Check-in" : value
        )
        .join(", ");
    },
  };
}

export const labels = createLabels("mn");
