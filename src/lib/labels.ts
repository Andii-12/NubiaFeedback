import {
  COMMUNICATION,
  DEVICE_STATUS,
  DEVICES,
  EXPLANATION_QUALITY,
  FULLY_RESOLVED,
  IMPACT_LEVELS,
  PRINTING_STATUS,
  RESOLUTION_SPEED,
  RESPONSE_SPEED,
  SCANNING_STATUS,
  SHIFTS,
  WORKSTATION_STATUS,
} from "@/lib/constants";
import type { LocationType } from "@/types";

function findLabel<T extends { value: string; label: string }>(
  list: T[],
  value?: string | null
) {
  if (!value) return "—";
  return list.find((item) => item.value === value)?.label ?? value;
}

export const labels = {
  device: (value?: string) => findLabel(DEVICES, value),
  devices: (values?: string[]) =>
    values?.length ? values.map((v) => findLabel(DEVICES, v)).join(", ") : "—",
  deviceStatus: (value?: string) => findLabel(DEVICE_STATUS, value),
  printing: (value?: string) => findLabel(PRINTING_STATUS, value),
  scanning: (value?: string) => findLabel(SCANNING_STATUS, value),
  workstation: (value?: string) => findLabel(WORKSTATION_STATUS, value),
  impact: (value?: string) => findLabel(IMPACT_LEVELS, value),
  impactSeverity: (value?: string) =>
    IMPACT_LEVELS.find((item) => item.value === value)?.severity ?? "—",
  shift: (value?: string) => findLabel(SHIFTS, value),
  responseSpeed: (value?: string) => findLabel(RESPONSE_SPEED, value),
  resolutionSpeed: (value?: string) => findLabel(RESOLUTION_SPEED, value),
  fullyResolved: (value?: string) => findLabel(FULLY_RESOLVED, value),
  communication: (value?: string) => findLabel(COMMUNICATION, value),
  explanation: (value?: string) => findLabel(EXPLANATION_QUALITY, value),
  locationType: (value?: LocationType | string) =>
    value === "gate" ? "Gate" : value === "checkin" ? "Check-in" : "—",
};
