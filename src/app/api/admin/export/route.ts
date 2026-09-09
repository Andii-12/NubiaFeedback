import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/lib/models";
import { getSessionUser } from "@/lib/api-auth";
import { rangeToDates } from "@/lib/date-range";
import { toFeedbackDTO } from "@/lib/feedback-map";
import { labels } from "@/lib/labels";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";
  const range = searchParams.get("range") || "this_month";
  const { from, to } = rangeToDates(
    range,
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined
  );
  const query: Record<string, unknown> = {};
  if (from && to) query.date = { $gte: from, $lte: to };
  if (searchParams.get("airlineId")) query.airlineId = searchParams.get("airlineId");
  if (searchParams.get("locationId")) query.locationId = searchParams.get("locationId");
  if (searchParams.get("device")) query.devices = searchParams.get("device");

  const rows = await Feedback.find(query)
    .populate("airlineId", "name")
    .populate("locationId", "name code")
    .sort({ date: -1, time: -1 });
  const mapped = rows.map((row) => {
    const item = toFeedbackDTO(row.toObject());
    return {
      ID: item.requestId,
      Date: item.date,
      Time: item.time,
      Airline: item.airlineName,
      Location: item.locationName,
      Type: labels.locationType(item.locationType),
      Devices: labels.devices(item.devices),
      Status: labels.deviceStatus(item.technicalAnswers.deviceStatus),
      Impact: labels.impact(item.technicalAnswers.impactLevel),
      Rating: item.engineerRating,
      Resolved: labels.fullyResolved(item.engineerAnswers.fullyResolved),
      Comment: item.comment || "",
    };
  });

  if (format === "xlsx") {
    const sheet = XLSX.utils.json_to_sheet(mapped);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Feedback");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="nubia-feedback.xlsx"',
      },
    });
  }

  const headers = Object.keys(mapped[0] || { ID: "" });
  const csv = [
    headers.join(","),
    ...mapped.map((row) =>
      headers
        .map((h) => `"${String((row as Record<string, unknown>)[h] ?? "").replaceAll('"', '""')}"`)
        .join(",")
    ),
  ].join("\n");
  const bom = "\uFEFF";
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nubia-feedback.csv"',
    },
  });
}
