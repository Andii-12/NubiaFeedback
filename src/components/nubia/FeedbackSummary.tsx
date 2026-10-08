"use client";

import { useI18n, useLabels } from "@/components/i18n/LocaleProvider";
import type { AirlineDTO, FeedbackFormState, LocationDTO } from "@/types";

function Row({
  label,
  value,
  editLabel,
  onEdit,
}: {
  label: string;
  value: string;
  editLabel: string;
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
          {editLabel}
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
  const { t } = useI18n();
  const labels = useLabels();
  const airline = airlines.find((a) => a._id === form.airlineId);
  const selected = locations.filter((item) => form.locationIds.includes(item._id));
  const checkinNames = selected
    .filter((item) => item.type === "checkin")
    .map((item) => item.name);
  const gateNames = selected
    .filter((item) => item.type === "gate")
    .map((item) => item.name);
  const locationLabel = [
    checkinNames.length ? `Check-in ${checkinNames.join(", ")}` : "",
    gateNames.length ? gateNames.join(", ") : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-[16px] border border-border bg-white p-4 shadow-sm">
      <Row
        label={t.form.airline}
        editLabel={t.common.edit}
        value={airline?.name || ""}
        onEdit={() => onEdit(1)}
      />
      <Row
        label={t.form.sumLocation}
        editLabel={t.common.edit}
        value={locationLabel}
        onEdit={() => onEdit(1)}
      />
      <Row label={t.form.date} editLabel={t.common.edit} value={form.date} onEdit={() => onEdit(1)} />
      <Row
        label={t.form.sumDevice}
        editLabel={t.common.edit}
        value={labels.devices(form.devices)}
        onEdit={() => onEdit(2)}
      />
      <Row
        label={t.form.sumWork}
        editLabel={t.common.edit}
        value={
          labels.deviceReport(form.deviceAnswers, form.deviceStatus) || "—"
        }
        onEdit={() => onEdit(2)}
      />
      <Row
        label={t.form.sumImpact}
        editLabel={t.common.edit}
        value={labels.impact(form.impactLevel)}
        onEdit={() => onEdit(2)}
      />
      <Row
        label={t.form.sumSpeed}
        editLabel={t.common.edit}
        value={labels.responseSpeed(form.responseSpeed)}
        onEdit={() => onEdit(3)}
      />
      <Row
        label={t.form.sumFast}
        editLabel={t.common.edit}
        value={[
          labels.resolutionSpeed(form.resolutionSpeed),
          form.resolutionNote,
        ]
          .filter(Boolean)
          .join(" · ")}
        onEdit={() => onEdit(3)}
      />
      <Row
        label={t.form.sumFully}
        editLabel={t.common.edit}
        value={[labels.fullyResolved(form.fullyResolved), form.resolvedNote]
          .filter(Boolean)
          .join(" · ")}
        onEdit={() => onEdit(3)}
      />
      <Row
        label={t.form.sumTalk}
        editLabel={t.common.edit}
        value={[labels.communication(form.communication), form.communicationNote]
          .filter(Boolean)
          .join(" · ")}
        onEdit={() => onEdit(3)}
      />
      <Row
        label={t.form.sumExplain}
        editLabel={t.common.edit}
        value={labels.explanation(form.explanationQuality)}
        onEdit={() => onEdit(3)}
      />
      <Row
        label={t.form.sumRating}
        editLabel={t.common.edit}
        value={form.engineerRating ? `${form.engineerRating} / 5` : "—"}
        onEdit={() => onEdit(3)}
      />
      <Row
        label={t.form.sumComment}
        editLabel={t.common.edit}
        value={form.comment || "—"}
        onEdit={() => onEdit(4)}
      />
    </div>
  );
}
