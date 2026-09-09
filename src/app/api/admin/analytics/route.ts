import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/lib/models";
import { getSessionUser } from "@/lib/api-auth";
import { previousRange, rangeToDates } from "@/lib/date-range";
import { percentChange } from "@/lib/utils";

function populatedName(value: unknown, fallback = "Unknown") {
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name?: string }).name || fallback);
  }
  return fallback;
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "this_month";
  const { from, to } = rangeToDates(
    range,
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined
  );
  const prev = previousRange(from, to);
  const current = await Feedback.find({ date: { $gte: from, $lte: to } })
    .populate("airlineId", "name")
    .populate("locationId", "name");
  const previous = await Feedback.find({
    date: { $gte: prev.from, $lte: prev.to },
  });

  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);
  const todayItems = await Feedback.find({ date: today });
  const yesterdayItems = await Feedback.find({ date: yesterday });

  const issueCount = (items: typeof current) =>
    items.filter((i) => i.technicalAnswers.deviceStatus !== "normal").length;
  const avgRating = (items: typeof current) =>
    items.length
      ? Math.round(
          (items.reduce((s, i) => s + i.engineerRating, 0) / items.length) * 10
        ) / 10
      : 0;
  const critical = (items: typeof current) =>
    items.filter((i) => i.technicalAnswers.impactLevel === "critical").length;

  const deviceMap: Record<string, number> = {};
  const locationMap: Record<string, number> = {};
  const airlineMap: Record<string, number> = {};
  const ratingMap: Record<string, number> = {
    "Very Good": 0,
    Good: 0,
    Average: 0,
    Poor: 0,
  };
  const trendMap: Record<string, number> = {};
  let resolved = 0;
  let partial = 0;
  let notResolved = 0;

  for (const item of current) {
    for (const device of item.devices) {
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    }
    const locName = populatedName(item.locationId);
    locationMap[locName] = (locationMap[locName] || 0) + 1;
    const airlineName = populatedName(item.airlineId);
    airlineMap[airlineName] = (airlineMap[airlineName] || 0) + 1;
    if (item.engineerRating >= 5) ratingMap["Very Good"] += 1;
    else if (item.engineerRating === 4) ratingMap.Good += 1;
    else if (item.engineerRating === 3) ratingMap.Average += 1;
    else ratingMap.Poor += 1;
    trendMap[item.date] = (trendMap[item.date] || 0) + 1;
    if (item.engineerAnswers.fullyResolved === "yes") resolved += 1;
    else if (item.engineerAnswers.fullyResolved === "temporary") partial += 1;
    else notResolved += 1;
  }

  const total = current.length || 1;

  return NextResponse.json({
    overview: {
      today: todayItems.length,
      todayChange: percentChange(todayItems.length, yesterdayItems.length),
      issues: issueCount(todayItems),
      issuesChange: percentChange(issueCount(todayItems), issueCount(yesterdayItems)),
      rating: avgRating(todayItems),
      ratingChange: percentChange(avgRating(todayItems) * 10, avgRating(yesterdayItems) * 10),
      critical: critical(todayItems),
      criticalChange: percentChange(critical(todayItems), critical(yesterdayItems)),
      latest: current
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt as Date).getTime() -
            new Date(a.createdAt as Date).getTime()
        )
        .slice(0, 8)
        .map((item) => ({
          _id: String(item._id),
          requestId: item.requestId,
          time: item.time,
          date: item.date,
          airlineName: populatedName(item.airlineId, ""),
          locationName: populatedName(item.locationId, ""),
          locationType: item.locationType,
          devices: item.devices,
          status: item.technicalAnswers.deviceStatus,
          rating: item.engineerRating,
          resolved: item.engineerAnswers.fullyResolved,
        })),
    },
    devices: Object.entries(deviceMap).map(([name, count]) => ({ name, count })),
    locations: Object.entries(locationMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    airlines: Object.entries(airlineMap).map(([name, count]) => ({
      name,
      count,
    })),
    ratings: Object.entries(ratingMap).map(([name, count]) => ({ name, count })),
    averageRating: avgRating(current),
    trend: Object.entries(trendMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count })),
    resolution: {
      resolved: Math.round((resolved / total) * 100),
      partial: Math.round((partial / total) * 100),
      notResolved: Math.round((notResolved / total) * 100),
    },
    previousCount: previous.length,
    currentCount: current.length,
  });
}
