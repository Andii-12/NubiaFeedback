"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useI18n, useLabels } from "@/components/i18n/LocaleProvider";
import type { FeedbackDTO } from "@/types";

export function FeedbackTable({
  items,
  onDelete,
  sort,
  onSort,
}: {
  items: FeedbackDTO[];
  onDelete?: (item: FeedbackDTO) => void;
  sort?: string;
  onSort?: (sort: string) => void;
}) {
  const { t } = useI18n();
  const labels = useLabels();
  function toggle(desc: string, asc: string) {
    if (!onSort) return;
    onSort(sort === desc ? asc : desc);
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.table.id}</TableHead>
          <TableHead>{t.table.time}</TableHead>
          <TableHead>{t.table.airline}</TableHead>
          <TableHead>{t.table.location}</TableHead>
          <TableHead>{t.table.type}</TableHead>
          <TableHead>{t.table.device}</TableHead>
          <TableHead>{t.table.work}</TableHead>
          <TableHead>
            {onSort ? (
              <button type="button" onClick={() => toggle("rating_desc", "rating_asc")}>
                {t.table.rating}{sort === "rating_desc" ? " ↓" : sort === "rating_asc" ? " ↑" : ""}
              </button>
            ) : (
              t.table.rating
            )}
          </TableHead>
          <TableHead>{t.table.resolved}</TableHead>
          <TableHead>
            {onSort ? (
              <button type="button" onClick={() => toggle("date_desc", "date_asc")}>
                {t.table.date}{sort === "date_desc" ? " ↓" : sort === "date_asc" ? " ↑" : ""}
              </button>
            ) : (
              t.table.date
            )}
          </TableHead>
          <TableHead>{t.table.engineer}</TableHead>
          {onDelete ? <TableHead className="text-right">{t.table.action}</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={onDelete ? 12 : 11}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              {t.table.empty}
            </TableCell>
          </TableRow>
        ) : null}
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              <Link
                href={`/admin/responses/${item._id}`}
                className="font-medium text-primary"
              >
                {item.requestId}
              </Link>
            </TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>{item.airlineName}</TableCell>
            <TableCell>{item.locationName}</TableCell>
            <TableCell>
              {labels.locationTypes(
                item.locationTypes?.length ? item.locationTypes : [item.locationType]
              )}
            </TableCell>
            <TableCell>{labels.devices(item.devices)}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {labels.deviceReport(
                  item.technicalAnswers.deviceAnswers,
                  item.technicalAnswers.deviceStatus
                )}
              </Badge>
            </TableCell>
            <TableCell>{item.engineerRating}</TableCell>
            <TableCell>
              {labels.fullyResolved(item.engineerAnswers.fullyResolved)}
            </TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>
              {item.dutyEngineers?.length ? item.dutyEngineers.join(", ") : "—"}
            </TableCell>
            {onDelete ? (
              <TableCell className="text-right">
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  {t.table.delete}
                </button>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
