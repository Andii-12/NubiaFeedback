import type { FeedbackDTO } from "@/types";
import { labels } from "@/lib/labels";

export function toFeedbackDTO(doc: {
  _id: unknown;
  requestId: string;
  airlineId: { _id?: unknown; name?: string } | string;
  locationId: { _id?: unknown; name?: string; code?: string } | string;
  locationType: FeedbackDTO["locationType"];
  date: string;
  time: string;
  shift: FeedbackDTO["shift"];
  devices: FeedbackDTO["devices"];
  technicalAnswers: FeedbackDTO["technicalAnswers"];
  engineerAnswers: FeedbackDTO["engineerAnswers"];
  engineerRating: number;
  comment?: string;
  engineerId?: { _id?: unknown; name?: string } | string | null;
  adminNotes?: { text: string; author: string; createdAt: Date | string }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}): FeedbackDTO {
  const airline =
    typeof doc.airlineId === "object" && doc.airlineId
      ? doc.airlineId
      : { _id: doc.airlineId, name: "" };
  const location =
    typeof doc.locationId === "object" && doc.locationId
      ? doc.locationId
      : { _id: doc.locationId, name: "", code: "" };
  const engineer =
    typeof doc.engineerId === "object" && doc.engineerId
      ? doc.engineerId
      : null;

  return {
    _id: String(doc._id),
    requestId: doc.requestId,
    airlineId: String(airline._id || doc.airlineId),
    airlineName: airline.name,
    locationId: String(location._id || doc.locationId),
    locationName: location.name,
    locationCode: location.code,
    locationType: doc.locationType,
    date: doc.date,
    time: doc.time,
    shift: doc.shift,
    devices: doc.devices,
    technicalAnswers: doc.technicalAnswers,
    engineerAnswers: doc.engineerAnswers,
    engineerRating: doc.engineerRating,
    comment: doc.comment || "",
    engineerId: engineer?._id ? String(engineer._id) : undefined,
    engineerName: engineer?.name,
    adminNotes: (doc.adminNotes || []).map((note) => ({
      text: note.text,
      author: note.author,
      createdAt:
        typeof note.createdAt === "string"
          ? note.createdAt
          : new Date(note.createdAt).toISOString(),
    })),
    createdAt:
      typeof doc.createdAt === "string"
        ? doc.createdAt
        : new Date(doc.createdAt).toISOString(),
    updatedAt:
      typeof doc.updatedAt === "string"
        ? doc.updatedAt
        : new Date(doc.updatedAt).toISOString(),
  };
}

export { labels };
