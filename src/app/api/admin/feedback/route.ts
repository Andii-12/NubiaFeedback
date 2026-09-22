import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/lib/models";
import { getSessionUser } from "@/lib/api-auth";
import { toFeedbackDTO } from "@/lib/feedback-map";
import { rangeToDates } from "@/lib/date-range";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "this_month";
  const { from, to } = rangeToDates(
    range,
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined
  );
  const query: Record<string, unknown> = {};
  if (from && to) query.date = { $gte: from, $lte: to };
  if (searchParams.get("airlineId")) query.airlineId = searchParams.get("airlineId");
  const locationFilters: Record<string, unknown>[] = [];
  const locationId = searchParams.get("locationId");
  const locationType = searchParams.get("locationType");
  if (locationId) {
    locationFilters.push({
      $or: [{ locationId }, { locationIds: locationId }],
    });
  }
  if (locationType) {
    locationFilters.push({
      $or: [{ locationType }, { locationTypes: locationType }],
    });
  }
  if (locationFilters.length) query.$and = locationFilters;
  if (searchParams.get("device")) query.devices = searchParams.get("device");
  if (searchParams.get("status")) {
    const status = searchParams.get("status");
    const statusMatch = {
      $or: [
        { "technicalAnswers.deviceStatus": status },
        { "technicalAnswers.deviceAnswers.status": status },
      ],
    };
    query.$and = [
      ...((query.$and as Record<string, unknown>[]) || []),
      statusMatch,
    ];
  }
  if (searchParams.get("impact"))
    query["technicalAnswers.impactLevel"] = searchParams.get("impact");
  if (searchParams.get("resolved"))
    query["engineerAnswers.fullyResolved"] = searchParams.get("resolved");
  if (searchParams.get("rating"))
    query.engineerRating = Number(searchParams.get("rating"));
  const q = searchParams.get("q");
  if (q) {
    query.$or = [
      { requestId: { $regex: q, $options: "i" } },
      { comment: { $regex: q, $options: "i" } },
    ];
  }

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const total = await Feedback.countDocuments(query);
  const rows = await Feedback.find(query)
    .populate("airlineId", "name code")
    .populate("locationId", "name code type")
    .populate("locationIds", "name code type")
    .populate("engineerId", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    items: rows.map((row) => toFeedbackDTO(row.toObject())),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
