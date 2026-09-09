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
}: {
  items: FeedbackDTO[];
  onDelete?: (item: FeedbackDTO) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Airline</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Resolved</TableHead>
          <TableHead>Date</TableHead>
          {onDelete ? <TableHead className="text-right">Action</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
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
            <TableCell>{labels.locationType(item.locationType)}</TableCell>
            <TableCell>{labels.devices(item.devices)}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {labels.deviceStatus(item.technicalAnswers.deviceStatus)}
              </Badge>
            </TableCell>
            <TableCell>{item.engineerRating}</TableCell>
            <TableCell>
              {labels.fullyResolved(item.engineerAnswers.fullyResolved)}
            </TableCell>
            <TableCell>{item.date}</TableCell>
            {onDelete ? (
              <TableCell className="text-right">
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
