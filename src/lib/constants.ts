import type {
  Communication,
  DeviceStatus,
  DeviceType,
  ExplanationQuality,
  FullyResolved,
  ImpactLevel,
  PrintingStatus,
  ResolutionSpeed,
  ResponseSpeed,
  ScanningStatus,
  Shift,
  WorkstationStatus,
} from "@/types";

export const DEVICES: {
  value: DeviceType;
  label: string;
  hint: string;
}[] = [
  { value: "OCR", label: "OCR", hint: "Passport / ID уншигч" },
  { value: "BGR", label: "BGR", hint: "Barcode уншигч" },
  { value: "WS", label: "WS", hint: "Workstation" },
  { value: "BTP", label: "BTP", hint: "Bag tag printer" },
  { value: "BPP", label: "BPP", hint: "Boarding pass printer" },
  { value: "Network", label: "Network", hint: "Сүлжээ" },
  { value: "Other", label: "Бусад", hint: "Бусад төхөөрөмж" },
];

export const SHIFTS: { value: Shift; label: string }[] = [
  { value: "morning", label: "Өглөө" },
  { value: "afternoon", label: "Өдөр" },
  { value: "evening", label: "Орой" },
];

export const DEVICE_STATUS: {
  value: DeviceStatus;
  label: string;
  tone: "success" | "warning" | "caution" | "danger" | "muted";
}[] = [
  { value: "normal", label: "Хэвийн", tone: "success" },
  { value: "slow", label: "Удаан", tone: "warning" },
  { value: "intermittent", label: "Хааяа ажиллахгүй", tone: "caution" },
  { value: "down", label: "Ажиллахгүй", tone: "danger" },
  { value: "disconnected", label: "Тасалдаж байсан", tone: "muted" },
];

export const PRINTING_STATUS: { value: PrintingStatus; label: string }[] = [
  { value: "normal", label: "Хэвийн хэвлэж байсан" },
  { value: "slow", label: "Удаан хэвлэж байсан" },
  { value: "jammed", label: "Цаас гацсан" },
  { value: "faded", label: "Бүдгэрч хэвлэсэн" },
  { value: "none", label: "Огт хэвлээгүй" },
];

export const SCANNING_STATUS: { value: ScanningStatus; label: string }[] = [
  { value: "normal", label: "Хэвийн уншсан" },
  { value: "slow", label: "Удаан уншсан" },
  { value: "retries", label: "Олон дахин оролдсон" },
  { value: "partial", label: "Заримдаа уншаагүй" },
  { value: "none", label: "Огт уншаагүй" },
];

export const WORKSTATION_STATUS: {
  value: WorkstationStatus;
  label: string;
}[] = [
  { value: "normal", label: "Хэвийн" },
  { value: "slow", label: "Удаан" },
  { value: "frozen", label: "Гацсан" },
  { value: "disconnected", label: "Холболт тасарсан" },
  { value: "reboot", label: "Дахин асаах шаардлагатай болсон" },
];

export const IMPACT_LEVELS: {
  value: ImpactLevel;
  label: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}[] = [
  { value: "none", label: "Нөлөөлөөгүй", severity: "Low" },
  { value: "low", label: "Бага зэрэг нөлөөлсөн", severity: "Low" },
  { value: "medium", label: "Ажил удаашруулсан", severity: "Medium" },
  {
    value: "high",
    label: "Түр хугацаанд ажиллах боломжгүй болсон",
    severity: "High",
  },
  {
    value: "critical",
    label: "Check-in / Boarding зогссон",
    severity: "Critical",
  },
];

export const RESPONSE_SPEED: { value: ResponseSpeed; label: string }[] = [
  { value: "very_fast", label: "Маш хурдан" },
  { value: "fast", label: "Хурдан" },
  { value: "average", label: "Дундаж" },
  { value: "slow", label: "Удаан" },
  { value: "very_slow", label: "Маш удаан" },
];

export const RESOLUTION_SPEED: {
  value: ResolutionSpeed;
  label: string;
}[] = [
  { value: "yes", label: "Тийм" },
  { value: "partial", label: "Хэсэгчлэн" },
  { value: "no", label: "Үгүй" },
];

export const FULLY_RESOLVED: { value: FullyResolved; label: string }[] = [
  { value: "yes", label: "Тийм" },
  { value: "temporary", label: "Түр шийдэгдсэн" },
  { value: "no", label: "Үгүй" },
];

export const COMMUNICATION: {
  value: Communication;
  label: string;
  emoji: string;
}[] = [
  { value: "excellent", label: "Маш сайн", emoji: "😀" },
  { value: "good", label: "Сайн", emoji: "🙂" },
  { value: "average", label: "Дундаж", emoji: "😐" },
  { value: "poor", label: "Муу", emoji: "🙁" },
];

export const EXPLANATION_QUALITY: {
  value: ExplanationQuality;
  label: string;
}[] = [
  { value: "very_clear", label: "Маш ойлгомжтой" },
  { value: "clear", label: "Ойлгомжтой" },
  { value: "average", label: "Дундаж" },
  { value: "unclear", label: "Ойлгомжгүй" },
];

export const ENGINEER_RATING_LABELS: Record<number, string> = {
  1: "Маш муу",
  2: "Муу",
  3: "Дундаж",
  4: "Сайн",
  5: "Маш сайн",
};

export const PRINT_DEVICES: DeviceType[] = ["BTP", "BPP"];
export const SCAN_DEVICES: DeviceType[] = ["OCR", "BGR"];
export const WS_DEVICES: DeviceType[] = ["WS", "Network"];

export const TONE_CLASSES: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  caution: "border-orange-200 bg-orange-50 text-orange-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  muted: "border-slate-200 bg-slate-50 text-slate-700",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-800 border-amber-200",
  High: "bg-orange-50 text-orange-800 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};
