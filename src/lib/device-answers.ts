import {
  DEVICES,
  DEVICE_STATUS,
  PRINT_DEVICES,
  PRINTING_STATUS,
  SCAN_DEVICES,
  SCANNING_STATUS,
  WS_DEVICES,
  WORKSTATION_STATUS,
} from "@/lib/constants";
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

export function deviceLabel(device: string) {
  return DEVICES.find((item) => item.value === device)?.label || device;
}

export function detailQuestion(device: string) {
  const kind = deviceDetailKind(device);
  const name = deviceLabel(device);
  if (kind === "print") return `${name} хэвлэлт ямар байсан бэ?`;
  if (kind === "scan") return `${name} уншилт ямар байсан бэ?`;
  if (kind === "workstation") return `${name} систем ямар байсан бэ?`;
  return "";
}

export function detailOptions(device: string) {
  const kind = deviceDetailKind(device);
  if (kind === "print") return PRINTING_STATUS;
  if (kind === "scan") return SCANNING_STATUS;
  if (kind === "workstation") return WORKSTATION_STATUS;
  return [];
}

export function detailLabel(device: string, value?: string) {
  if (!value) return "";
  return detailOptions(device).find((item) => item.value === value)?.label || value;
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

export function missingDeviceAnswer(devices: string[], answers: DeviceAnswer[]) {
  for (const device of orderedDevices(devices)) {
    const answer = answers.find((item) => item.device === device);
    const name = deviceLabel(device);
    if (!answer?.status) return `${name} ажиллагааг сонгоно уу.`;
    if (deviceDetailKind(device) && !answer.detail) {
      return `${name} дэлгэрэнгүй ажиллагааг сонгоно уу.`;
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
  answers?: { device: string; status: string; detail?: string }[]
) {
  if (!answers?.length) return "";
  return orderedDevices(answers.map((item) => item.device))
    .map((device) => {
      const answer = answers.find((item) => item.device === device);
      if (!answer) return "";
      const status =
        DEVICE_STATUS.find((item) => item.value === answer.status)?.label ||
        answer.status;
      const detail = detailLabel(device, answer.detail);
      return detail
        ? `${deviceLabel(device)}: ${status} · ${detail}`
        : `${deviceLabel(device)}: ${status}`;
    })
    .filter(Boolean)
    .join("; ");
}
