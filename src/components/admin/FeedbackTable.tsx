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
import { labels } from "@/lib/labels";
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
  function toggle(desc: string, asc: string) {
    if (!onSort) return;
    onSort(sort === desc ? asc : desc);
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дугаар</TableHead>
          <TableHead>Цаг</TableHead>
          <TableHead>Авиакомпани</TableHead>
          <TableHead>Байршил</TableHead>
          <TableHead>Төрөл</TableHead>
          <TableHead>Төхөөрөмж</TableHead>
          <TableHead>Ажиллагаа</TableHead>
          <TableHead>
            {onSort ? (
              <button type="button" onClick={() => toggle("rating_desc", "rating_asc")}>
                Үнэлгээ{sort === "rating_desc" ? " ↓" : sort === "rating_asc" ? " ↑" : ""}
              </button>
            ) : (
              "Үнэлгээ"
            )}
          </TableHead>
          <TableHead>Шийдэгдсэн</TableHead>
          <TableHead>
            {onSort ? (
              <button type="button" onClick={() => toggle("date_desc", "date_asc")}>
                Огноо{sort === "date_desc" ? " ↓" : sort === "date_asc" ? " ↑" : ""}
              </button>
            ) : (
              "Огноо"
            )}
          </TableHead>
          <TableHead>Өдрийн инженер</TableHead>
          {onDelete ? <TableHead className="text-right">Үйлдэл</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={onDelete ? 12 : 11}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              Хариулт алга
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
                  Устгах
                </button>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
