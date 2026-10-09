import {
  DEVICES,
  PRINT_DEVICES,
  PRINTING_STATUS,
  BTP_STATUS,
  DCP_STATUS,
  DCS_STATUS,
  KEYBOARD_STATUS,
  NETWORK_STATUS,
  SCAN_DEVICES,
  SCANNING_STATUS,
  WS_DEVICES,
  WORKSTATION_STATUS,
} from "@/lib/constants";
import { line, optionLabel, type Locale } from "@/lib/i18n/options";
import type { DeviceStatus, DeviceType } from "@/types";

export type DeviceAnswer = {
  device: DeviceType;
  status: DeviceStatus | "";
  detail: string;
};

export type DeviceDetailKind = "print" | "scan" | "workstation";

const STATUS_RANK: DeviceStatus[] = [
  "normal",
  "slow",
  "intermittent",
  "disconnected",
  "down",
];

export function deviceDetailKind(device: string): DeviceDetailKind | null {
  if (PRINT_DEVICES.includes(device as DeviceType)) return "print";
  if (SCAN_DEVICES.includes(device as DeviceType)) return "scan";
  if (WS_DEVICES.includes(device as DeviceType)) return "workstation";
  return null;
}

export function deviceLabel(device: string, locale: Locale = "mn") {
  return optionLabel(locale, "device", device);
}

export function detailQuestion(device: string, locale: Locale = "mn") {
  const kind = deviceDetailKind(device);
  const name = deviceLabel(device, locale);
  if (kind === "print") return line(locale, "printQ", name);
  if (kind === "scan") return line(locale, "scanQ", name);
  if (device === "WS") return line(locale, "dcsQ");
  if (kind === "workstation") return line(locale, "systemQ", name);
  return "";
}

export function detailOptions(device: string) {
  const kind = deviceDetailKind(device);
  if (device === "OCR") return KEYBOARD_STATUS;
  if (device === "WS") return DCS_STATUS;
  if (device === "BTP" || device === "BPP") return BTP_STATUS;
  if (device === "DCP") return DCP_STATUS;
  if (device === "Network") return NETWORK_STATUS;
  if (kind === "print") return PRINTING_STATUS;
  if (kind === "scan") return SCANNING_STATUS;
  if (kind === "workstation") return WORKSTATION_STATUS;
  return [];
}

export function detailLabel(device: string, value?: string, locale: Locale = "mn") {
  if (!value) return "";
  const kind = deviceDetailKind(device);
  const group = kind === "print" ? "print" : kind === "scan" ? "scan" : "work";
  return optionLabel(locale, group, value);
}

export function orderedDevices(devices: string[]) {
  return DEVICES.map((item) => item.value).filter((device) =>
    devices.includes(device)
  );
}

export function pruneAnswers(devices: DeviceType[], answers: DeviceAnswer[]) {
  return answers.filter((answer) => devices.includes(answer.device));
}

export function answerFor(answers: DeviceAnswer[], device: DeviceType) {
  return (
    answers.find((item) => item.device === device) || {
      device,
      status: "" as const,
      detail: "",
    }
  );
}

export function upsertAnswer(
  answers: DeviceAnswer[],
  device: DeviceType,
  patch: Partial<Pick<DeviceAnswer, "status" | "detail">>
) {
  const current = answerFor(answers, device);
  const next = { ...current, ...patch, device };
  const rest = answers.filter((item) => item.device !== device);
  return [...rest, next];
}

export function missingDeviceAnswer(
  devices: string[],
  answers: DeviceAnswer[],
  locale: Locale = "mn"
) {
  for (const device of orderedDevices(devices)) {
    const answer = answers.find((item) => item.device === device);
    const name = deviceLabel(device, locale);
    if (answer?.status !== "normal" && answer?.status !== "down") {
      return line(locale, "pickStatus", name);
    }
    if (answer.status === "down" && deviceDetailKind(device)) {
      const allowed = detailOptions(device).some((item) => item.value === answer.detail);
      if (!allowed) return line(locale, "pickDetail", name);
    }
  }
  return "";
}

export function worstStatus(answers: DeviceAnswer[]): DeviceStatus {
  let worst: DeviceStatus = "normal";
  for (const answer of answers) {
    if (!answer.status) continue;
    if (STATUS_RANK.indexOf(answer.status) > STATUS_RANK.indexOf(worst)) {
      worst = answer.status;
    }
  }
  return worst;
}

export function firstDetail(devices: DeviceType[], answers: DeviceAnswer[], kind: DeviceDetailKind) {
  const match = orderedDevices(devices).find(
    (device) => deviceDetailKind(device) === kind
  );
  if (!match) return "";
  return answers.find((item) => item.device === match)?.detail || "";
}

export function formatDeviceAnswers(
  answers?: { device: string; status: string; detail?: string }[],
  locale: Locale = "mn"
) {
  if (!answers?.length) return "";
  return orderedDevices(answers.map((item) => item.device))
    .map((device) => {
      const answer = answers.find((item) => item.device === device);
      if (!answer) return "";
      const status = optionLabel(locale, "status", answer.status);
      const detail = detailLabel(device, answer.detail, locale);
      const name = deviceLabel(device, locale);
      return detail ? `${name}: ${status} · ${detail}` : `${name}: ${status}`;
    })
    .filter(Boolean)
    .join("; ");
}
