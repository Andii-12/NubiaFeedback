"use client";

import { labels } from "@/lib/labels";
import type { AirlineDTO, FeedbackFormState, LocationDTO } from "@/types";

function Row({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-0">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-medium text-navy">{value || "—"}</div>
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-primary"
        >
          Засах
        </button>
      ) : null}
    </div>
  );
}

export function FeedbackSummary({
  form,
  airlines,
  locations,
  onEdit,
}: {
  form: FeedbackFormState;
  airlines: AirlineDTO[];
  locations: LocationDTO[];
  onEdit: (step: number) => void;
}) {
  const airline = airlines.find((a) => a._id === form.airlineId);
  const location = locations.find((l) => l._id === form.locationId);

  return (
    <div className="rounded-[16px] border border-border bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-navy">Хяналт</h3>
      <p className="mb-2 text-sm text-muted-foreground">
        Илгээхээсээ өмнө мэдээллээ шалгана уу.
      </p>
      <Row
        label="Airline"
        value={airline?.name || ""}
        onEdit={() => onEdit(1)}
      />
      <Row
        label="Location"
        value={`${labels.locationType(form.locationType)} ${location?.name || ""}`}
        onEdit={() => onEdit(1)}
      />
      <Row
        label="Device"
        value={labels.devices(form.devices)}
        onEdit={() => onEdit(2)}
      />
      <Row
        label="Technical Status"
        value={labels.deviceStatus(form.deviceStatus)}
        onEdit={() => onEdit(2)}
      />
      <Row
        label="Impact"
        value={labels.impact(form.impactLevel)}
        onEdit={() => onEdit(2)}
      />
      <Row
        label="Engineer Response"
        value={labels.responseSpeed(form.responseSpeed)}
        onEdit={() => onEdit(3)}
      />
      <Row
        label="Problem Resolved"
        value={labels.fullyResolved(form.fullyResolved)}
        onEdit={() => onEdit(3)}
      />
      <Row
        label="Engineer Rating"
        value={form.engineerRating ? `${form.engineerRating} / 5` : "—"}
        onEdit={() => onEdit(3)}
      />
      <Row
        label="Comment"
        value={form.comment || "—"}
        onEdit={() => onEdit(4)}
      />
    </div>
  );
}
