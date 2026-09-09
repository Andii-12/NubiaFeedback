export type UserRole = "ADMIN" | "ENGINEER" | "VIEWER";
export type LocationType = "checkin" | "gate";
export type DeviceType =
  | "OCR"
  | "BGR"
  | "WS"
  | "BTP"
  | "BPP"
  | "Network"
  | "Other";
export type Shift = "morning" | "afternoon" | "evening";

export type DeviceStatus =
  | "normal"
  | "slow"
  | "intermittent"
  | "down"
  | "disconnected";

export type PrintingStatus =
  | "normal"
  | "slow"
  | "jammed"
  | "faded"
  | "none";

export type ScanningStatus =
  | "normal"
  | "slow"
  | "retries"
  | "partial"
  | "none";

export type WorkstationStatus =
  | "normal"
  | "slow"
  | "frozen"
  | "disconnected"
  | "reboot";

export type ImpactLevel = "none" | "low" | "medium" | "high" | "critical";

export type ResponseSpeed =
  | "very_fast"
  | "fast"
  | "average"
  | "slow"
  | "very_slow";

export type ResolutionSpeed = "yes" | "partial" | "no";
export type FullyResolved = "yes" | "temporary" | "no";
export type Communication = "excellent" | "good" | "average" | "poor";
export type ExplanationQuality =
  | "very_clear"
  | "clear"
  | "average"
  | "unclear";

export interface FeedbackFormState {
  airlineId: string;
  locationType: LocationType | "";
  locationId: string;
  date: string;
  shift: Shift | "";
  time: string;
  devices: DeviceType[];
  deviceStatus: DeviceStatus | "";
  printingStatus: PrintingStatus | "";
  scanningStatus: ScanningStatus | "";
  workstationStatus: WorkstationStatus | "";
  impactLevel: ImpactLevel | "";
  responseSpeed: ResponseSpeed | "";
  resolutionSpeed: ResolutionSpeed | "";
  fullyResolved: FullyResolved | "";
  communication: Communication | "";
  explanationQuality: ExplanationQuality | "";
  engineerRating: number;
  comment: string;
}

export interface AirlineDTO {
  _id: string;
  name: string;
  code: string;
  logo?: string;
  isActive: boolean;
}

export interface LocationDTO {
  _id: string;
  name: string;
  code: string;
  type: LocationType;
  isActive: boolean;
  qrIdentifier: string;
}

export interface EngineerDTO {
  _id: string;
  name: string;
  email?: string;
  isActive: boolean;
}

export interface AdminNoteDTO {
  text: string;
  author: string;
  createdAt: string;
}

export interface FeedbackDTO {
  _id: string;
  requestId: string;
  airlineId: string;
  airlineName?: string;
  locationId: string;
  locationName?: string;
  locationCode?: string;
  locationType: LocationType;
  date: string;
  time: string;
  shift: Shift;
  devices: DeviceType[];
  technicalAnswers: {
    deviceStatus: DeviceStatus;
    printingStatus?: PrintingStatus | "";
    scanningStatus?: ScanningStatus | "";
    workstationStatus?: WorkstationStatus | "";
    impactLevel: ImpactLevel;
  };
  engineerAnswers: {
    responseSpeed: ResponseSpeed;
    resolutionSpeed: ResolutionSpeed;
    fullyResolved: FullyResolved;
    communication: Communication;
    explanationQuality: ExplanationQuality;
  };
  engineerRating: number;
  comment?: string;
  engineerId?: string;
  engineerName?: string;
  adminNotes: AdminNoteDTO[];
  createdAt: string;
  updatedAt: string;
}

export const defaultFormState = (): FeedbackFormState => {
  const now = new Date();
  const hour = now.getHours();
  const shift: FeedbackFormState["shift"] =
    hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return {
    airlineId: "",
    locationType: "",
    locationId: "",
    date: `${y}-${m}-${day}`,
    shift,
    time: `${String(hour).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    devices: [],
    deviceStatus: "",
    printingStatus: "",
    scanningStatus: "",
    workstationStatus: "",
    impactLevel: "",
    responseSpeed: "",
    resolutionSpeed: "",
    fullyResolved: "",
    communication: "",
    explanationQuality: "",
    engineerRating: 0,
    comment: "",
  };
};
