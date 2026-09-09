"use client";

import { labels } from "@/lib/labels";
import type { FeedbackDTO } from "@/types";
import Link from "next/link";

export function DetailDrawer({ item }: { item: FeedbackDTO }) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <div className="text-xs text-muted-foreground">Request ID</div>
        <div className="text-lg font-semibold text-primary">{item.requestId}</div>
      </div>
      <Row label="Airline" value={item.airlineName || ""} />
      <Row
        label="Location"
        value={`${labels.locationType(item.locationType)} ${item.locationName}`}
      />
      <Row label="Date / Time" value={`${item.date} ${item.time}`} />
      <Row label="Shift" value={labels.shift(item.shift)} />
      <Row label="Devices" value={labels.devices(item.devices)} />
      <Row
        label="Technical status"
        value={labels.deviceStatus(item.technicalAnswers.deviceStatus)}
      />
      <Row
        label="Impact"
        value={labels.impact(item.technicalAnswers.impactLevel)}
      />
      <Row
        label="Engineer rating"
        value={`${item.engineerRating} / 5`}
      />
      <Row
        label="Resolved"
        value={labels.fullyResolved(item.engineerAnswers.fullyResolved)}
      />
      <Row label="Comment" value={item.comment || "—"} />
      <Link
        href={`/admin/responses/${item._id}`}
        className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-white"
      >
        Full details
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium text-navy">{value}</div>
    </div>
  );
}
