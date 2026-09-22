import type { FeedbackDTO, LocationType } from "@/types";
import { labels } from "@/lib/labels";

type LocationRef =
  | { _id?: unknown; name?: string; code?: string }
  | string
  | null
  | undefined;

function refItems(value: LocationRef | LocationRef[]) {
  const list = Array.isArray(value) ? value : value == null || value === "" ? [] : [value];
  return list.flatMap((item) => {
    if (item == null || item === "") return [];
    if (typeof item === "object") {
      const id = item._id ? String(item._id) : "";
      if (!id) return [];
      return [{ id, name: item.name || "", code: item.code || "" }];
    }
    return [{ id: String(item), name: "", code: "" }];
  });
}

export function readLocations(doc: {
  locationId?: LocationRef | LocationRef[];
  locationIds?: LocationRef | LocationRef[];
  locationType?: LocationType | string;
  locationTypes?: (LocationType | string)[];
}) {
  const many = refItems(doc.locationIds);
  const locations = many.length ? many : refItems(doc.locationId);
  const typeList =
    Array.isArray(doc.locationTypes) && doc.locationTypes.length
      ? doc.locationTypes
      : doc.locationType
        ? [doc.locationType]
        : [];
  const types = [...new Set(typeList)] as LocationType[];
  return { locations, types };
}

export function toFeedbackDTO(doc: {
  _id: unknown;
  requestId: string;
  airlineId: { _id?: unknown; name?: string } | string;
  locationId: { _id?: unknown; name?: string; code?: string } | string;
  locationIds?: LocationRef | LocationRef[];
  locationType: FeedbackDTO["locationType"];
  locationTypes?: LocationType[];
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
  const { locations, types } = readLocations(doc);
  const primary = locations[0] || { id: "", name: "", code: "" };
  const engineer =
    typeof doc.engineerId === "object" && doc.engineerId
      ? doc.engineerId
      : null;

  return {
    _id: String(doc._id),
    requestId: doc.requestId,
    airlineId: String(airline._id || doc.airlineId),
    airlineName: airline.name,
    locationId: primary.id,
    locationIds: locations.map((item) => item.id),
    locationName: locations.map((item) => item.name).filter(Boolean).join(", "),
    locationCode: locations.map((item) => item.code).filter(Boolean).join(", "),
    locationType: types[0] || doc.locationType,
    locationTypes: types.length ? types : [doc.locationType],
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
